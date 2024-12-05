#!/bin/bash

# Ce script est conçu pour générer et mettre à jour un fichier de configuration KrakenD (`krakend.json`) en ajoutant de nouveaux endpoints à partir de deux fichiers sources :
# - Un fichier de données (`vpn.json`) contenant les hôtes.
# - Un fichier modèle (`api_template.json`) contenant les endpoints à ajouter.
#
# Le script effectue les actions suivantes :
# 1. Extraction des hôtes et des endpoints à partir des fichiers.
# 2. Création de nouveaux endpoints en ajoutant les hôtes au modèle d'endpoint et en les modifiant pour inclure un préfixe unique.
# 3. Mise à jour du fichier `krakend.json` avec les nouveaux endpoints combinés.
#

RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

KPATH="/etc/krakend/"
DATA_FILE="${KPATH}data/vpn.json"
TEMPLATE_FILE="${KPATH}data/api_template.json"
KRAKEND_JSON="${KPATH}krakend.json"
OUTPUT_FILE_1="${KPATH}krakend_tmp1.json"
OUTPUT_FILE_2="${KPATH}krakend_tmp2.json"

get_current_time() {
  echo $(date "+%Y-%m-%d %H:%M:%S")
}

# Vérification des fichiers nécessaires
if [[ ! -f "$DATA_FILE" ]]; then
  echo -e "${RED}[$(get_current_time)] Erreur : Fichier '$DATA_FILE' introuvable.${NC}"
  exit 1
fi

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo -e "${RED}[$(get_current_time)] Erreur : Fichier '$TEMPLATE_FILE' introuvable.${NC}"
  exit 1
fi

if [[ ! -f "$KRAKEND_JSON" ]]; then
  echo -e "${RED}[$(get_current_time)] Erreur : Fichier '$KRAKEND_JSON' introuvable.${NC}"
  exit 1
fi

# Récupération des hôtes et des endpoints du fichier template
hosts=$(jq -r '.[].host' "$DATA_FILE")
endpoints=$(cat "$TEMPLATE_FILE")

new_endpoints=()
it=0

# Création des nouveaux endpoints
for host in $hosts; do
  modified_endpoints=$(echo "$endpoints" | jq --arg it "$it" --arg host "$host" \
    'map(
      .endpoint = ("/" + ($it | tostring) + .endpoint) |
      .backend[].host = $host
    )')
  
  new_endpoints+=($(echo "$modified_endpoints" | jq -c '.[]'))
  
  it=$((it + 1))
done

# Création du fichier temporaire part1
echo -e "${BLUE}[$(get_current_time)] Création du fichier ${NC}'$OUTPUT_FILE_1'${BLUE} avec les nouveaux endpoints...${NC}"
echo "[" > "$OUTPUT_FILE_1"
for ((i=0; i<${#new_endpoints[@]}; i++)); do
  if (( i < ${#new_endpoints[@]} - 1 )); then
    echo "${new_endpoints[$i]}," >> "$OUTPUT_FILE_1"
  else
    echo "${new_endpoints[$i]}" >> "$OUTPUT_FILE_1"
  fi
done
echo "]" >> "$OUTPUT_FILE_1"

existing_endpoints=$(jq -r '.endpoints' "$KRAKEND_JSON")
final_endpoints=$(echo "$existing_endpoints" | jq --argjson new_endpoints "$(echo ${new_endpoints[@]} | jq -s '.')" \
  '. + $new_endpoints')

final_output=$(jq --argjson endpoints "$final_endpoints" \
  '.endpoints = $endpoints' <<< "$(cat $KRAKEND_JSON)")

# Création du fichier temporaire part2
echo -e "${BLUE}[$(get_current_time)] Création du fichier ${NC}'$OUTPUT_FILE_2'${BLUE} avec les endpoints combinés...${NC}"
echo "$final_output" > "$OUTPUT_FILE_2"

echo -e "${GREEN}[$(get_current_time)] Le fichier ${NC}'$OUTPUT_FILE_1'${GREEN} a été généré avec succès avec les nouveaux endpoints.${NC}"
echo -e "${GREEN}[$(get_current_time)] Le fichier ${NC}'$OUTPUT_FILE_2'${GREEN} a été généré avec succès avec les endpoints combinés.${NC}"

# Mise à jour de krakend.json avec le fichier final
cp "$OUTPUT_FILE_2" "$KRAKEND_JSON"

rm -f "$OUTPUT_FILE_1"
rm -f "$OUTPUT_FILE_2"

echo -e "${YELLOW}[$(get_current_time)] Les fichiers temporaires ont été supprimés et '$KRAKEND_JSON' a été mis à jour.${NC}"
echo -e "${YELLOW}[$(get_current_time)] Le fichier final ${NC}'$KRAKEND_JSON'${YELLOW} a été créé avec succès.${NC}"