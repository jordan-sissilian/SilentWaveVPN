#!/bin/bash

# Ce script permet d'ajouter un nouvel endpoint au fichier de configuration KrakenD (`krakend.json`) si cet endpoint n'existe pas déjà.
# Il se base sur un fichier template (`info_template.json`) contenant l'endpoint à ajouter.
#
# Le script réalise les étapes suivantes :
# 1. Extraction du premier endpoint à partir du fichier `info_template.json`.
# 2. Vérification si cet endpoint existe déjà dans la liste des endpoints du fichier `krakend.json`.
# 3. Si l'endpoint existe déjà, le script affiche un message et termine sans modification.
# 4. Si l'endpoint n'existe pas, il est ajouté à la liste des endpoints existants et le fichier `krakend.json` est mis à jour.
#

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

KPATH="/etc/krakend/"
DATA_FILE="${KPATH}data/info_template.json"
KRAKEND_JSON="${KPATH}krakend.json"

# Fonction pour obtenir l'heure actuelle formatée
get_current_time() {
  echo $(date "+%Y-%m-%d %H:%M:%S")
}

# Vérification des fichiers nécessaires
if [[ ! -f "$DATA_FILE" ]]; then
  echo -e "${RED}[$(get_current_time)] Erreur : Fichier ${NC}'$DATA_FILE'${RED} introuvable.${NC}"
  exit 1
fi

if [[ ! -f "$KRAKEND_JSON" ]]; then
  echo -e "${RED}[$(get_current_time)] Erreur : Fichier ${NC}'$KRAKEND_JSON'${RED} introuvable.${NC}"
  exit 1
fi

# Récupération du premier objet 'endpoint' du fichier info_template.json
vpn_endpoint=$(jq -r '.[0]' "$DATA_FILE")

# Récupération des 'endpoints' existants dans krakend.json
existing_endpoints=$(jq -r '.endpoints' "$KRAKEND_JSON")

# Vérification si l'endpoint existe déjà dans les endpoints existants
endpoint_exists=$(echo "$existing_endpoints" | jq --argjson vpn_endpoint "$vpn_endpoint" \
  'any(. == $vpn_endpoint)')

if [[ "$endpoint_exists" == "true" ]]; then
  # Si l'endpoint existe déjà, afficher un message
  echo -e "${YELLOW}[$(get_current_time)] L'endpoint '/info existe déjà dans ${NC}'$KRAKEND_JSON'${YELLOW}. Aucune modification apportée.${NC}"
  exit 0
else
  # Si l'endpoint n'existe pas, ajout de l'endpoint
  updated_endpoints=$(echo "$existing_endpoints" | jq --argjson vpn_endpoint "$vpn_endpoint" \
    '. + [$vpn_endpoint]')

  final_output=$(jq --argjson endpoints "$updated_endpoints" \
    '.endpoints = $endpoints' <<< "$(cat $KRAKEND_JSON)")

  echo -e "${GREEN}[$(get_current_time)] Mise à jour de ${NC}'$KRAKEND_JSON'${GREEN} avec les nouveaux endpoints...${NC}"
  echo "$final_output" > "$KRAKEND_JSON"

  echo -e "${GREEN}[$(get_current_time)] Le fichier ${NC}'$KRAKEND_JSON'${GREEN} a été mis à jour avec succès.${NC}"
fi
