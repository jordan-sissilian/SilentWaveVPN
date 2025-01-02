#!/bin/bash

# Ce script permet de mettre à jour un fichier de configuration KrakenD (`krakend.json`) en y ajoutant des entrées spécifiques extraites d'un fichier de données (`vpn.json`).
#
# Le script exécute les actions suivantes :
# 1. Parcours des entrées dans le fichier de données (`vpn.json`) et validation de la présence de champs essentiels (name, host, location, max-user).
# 2. Création de nouvelles entrées JSON avec les données extraites du fichier de données.
# 3. Mise à jour du fichier `krakend.json` en ajoutant chaque nouvelle entrée au bon endroit dans la structure existante sous `proxy.static.data.vpn`.
#

RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

KPATH="/etc/krakend/"
DATA_FILE="${KPATH}data/vpn.json"
JSON_FILE="${KPATH}krakend.json"
TARGET_CONFIG_ID="config_vpn"
id_counter=1

get_current_time() {
  echo $(date "+%Y-%m-%d %H:%M:%S")
}

# Vérification de l'existence du fichier de données
if [[ ! -f "$DATA_FILE" ]]; then
  echo -e "${RED}[$(get_current_time)] Erreur : Fichier DATA ${NC}'$DATA_FILE'${RED} introuvable.${NC}"
  exit 1
fi

# Vérification de l'existence du fichier JSON
if [[ ! -f "$JSON_FILE" ]]; then
  echo -e "${RED}[$(get_current_time)] Erreur : Fichier JSON ${NC}'$JSON_FILE'${RED} introuvable.${NC}"
  exit 1
fi

# Vérification de la validité du fichier DATA avec jq
if ! jq empty "$DATA_FILE" >/dev/null 2>&1; then
  echo -e "${RED}[$(get_current_time)] Erreur : Le fichier ${NC}'$DATA_FILE'${RED} contient un JSON invalide.${NC}"
  exit 1
fi

# Vérification de la validité du fichier JSON avec jq
if ! jq empty "$JSON_FILE" >/dev/null 2>&1; then
  echo -e "${RED}[$(get_current_time)] Erreur : Le fichier ${NC}'$JSON_FILE'${RED} contient un JSON invalide.${NC}"
  exit 1
fi

echo -e "${BLUE}[$(get_current_time)] Début de la mise à jour du fichier ${NC} ${JSON_FILE} ${NC}"

# Parcours de chaque entrée dans le fichier DATA_FILE
jq -c '.[]' "$DATA_FILE" | while IFS= read -r line; do
  name=$(echo "$line" | jq -r '.name')
  host=$(echo "$line" | jq -r '.host')
  location=$(echo "$line" | jq -r '.location')
  maxUser=$(echo "$line" | jq -r '.max-user')

  # Vérification de la complétude de l'entrée
  if [[ -z "$name" || -z "$host" || -z "$location" || -z "$maxUser" ]]; then
    echo -e "${RED}[$(get_current_time)] Erreur : Une entrée est incomplète (name: '$name', host: '$host', location: '$location', max-user: '$maxUser'). Ignorée.${NC}"
    continue
  fi

  # Création d'une nouvelle entrée JSON avec les données récupérées
  new_entry=$(jq -n --arg name "$name" --arg host "$host" --arg location "$location" --arg max-user "$maxUser" \
    '{name: $name, host: $host, location: $location, max-user: $maxUser}')

  # Vérification de la création de l'entrée JSON
  if [[ -z "$new_entry" ]]; then
    echo -e "${RED}[$(get_current_time)] Erreur : Impossible de créer une entrée JSON valide pour name='$name', host='$host', location='$location', max-user='$maxUser'. Ignorée.${NC}"
    continue
  fi

  # Mise à jour du fichier JSON avec la nouvelle entrée
  jq --argjson new_entry "$new_entry" \
     --arg id "$id_counter" \
     --arg target_id "$TARGET_CONFIG_ID" \
     '.endpoints[].extra_config |= 
      if .id == $target_id then
        .proxy.static.data.vpn += {($id | tostring): $new_entry}
      else
        .
      end' "$JSON_FILE" > "$JSON_FILE.tmp"

  # Vérification de l'exécution de jq pour la mise à jour
  if [[ $? -ne 0 ]]; then
    echo -e "${RED}[$(get_current_time)] Erreur : Échec de la mise à jour de ${NC}'$JSON_FILE'${RED} avec jq pour name='$name'. Ignorée.${NC}"
    continue
  fi

  # Sauvegarde des modifications dans le fichier JSON
  mv "$JSON_FILE.tmp" "$JSON_FILE" || {
    echo -e "${RED}[$(get_current_time)] Erreur : Impossible de sauvegarder les modifications dans ${NC}'$JSON_FILE'${RED}.${NC}"
    exit 1
  }

  echo -e "${GREEN}[$(get_current_time)] \tDonnée ajoutée : '$name', '$host', '$location', '$maxUser'.${NC}"
  id_counter=$((id_counter + 1))

done

echo -e "${BLUE}[$(get_current_time)] Mise à jour du fichier ${NC}${JSON_FILE}${BLUE} terminée avec succès.${NC}"