#!/bin/bash

set -e

WG_CONFIG=/etc/wireguard/wg0.conf

if [ ! -f "$WG_CONFIG" ]; then
  echo "Création du fichier de configuration WireGuard..."
  cat <<EOF > $WG_CONFIG
[Interface]
PrivateKey = $(wg genkey)
Address = 10.0.0.1/24
ListenPort = 51820

EOF
  chmod 600 $WG_CONFIG
fi

echo "Démarrage de WireGuard..."
wg-quick up wg0 || { echo "Impossible de démarrer WireGuard"; exit 1; }

echo "Démarrage de l'API WireGuard..."
/app/wg_api
