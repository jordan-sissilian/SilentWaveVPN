#!/bin/bash

echo "Exécution du script de configuration Krakend..."
/bin/bash scripts/config_krakend.sh

# Vérification de la réussite du précédent script
if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution de config_krakend.sh. Arrêt du script."
  exit 1
fi

# Exécution du script de configuration VPN API
echo "Exécution du script de configuration VPN API..."
/bin/bash scripts/config_vpn_api.sh

# Vérification de la réussite du précédent script
if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution de config_vpn_api.sh. Arrêt du script."
  exit 1
fi

# Exécution du script de configuration de l'endpoint VPN API
echo "Exécution du script de configuration de l'endpoint VPN API..."
/bin/bash scripts/config_endpoint_vpn_api.sh

# Vérification de la réussite du précédent script
if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution de config_endpoint_vpn_api.sh. Arrêt du script."
  exit 1
fi

# Lancement de Krakend
echo "Lancement de Krakend..."
krakend run -c krakend.json

# Vérification du succès de Krakend
if [ $? -ne 0 ]; then
  echo "Erreur lors du lancement de Krakend."
  exit 1
fi
