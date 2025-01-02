#!/bin/bash

set -e

# Configuration
DNS=${DNS:-"94.140.14.14,2606:4700:4700::1111"}
LISTEN_PORT=${LISTEN_PORT:-51820}
WG_CONFIG=/etc/wireguard/wg0.conf

# Détection automatique de l'interface réseau
INTERFACE=$(ip route | grep default | awk '{print $5}')

# Vérification des dépendances
if ! command -v wg &>/dev/null || ! command -v wg-quick &>/dev/null; then
  echo "WireGuard n'est pas installé. Assurez-vous que wg et wg-quick sont disponibles."
  exit 1
fi

# Création du fichier de configuration WireGuard si nécessaire
if [ ! -f "$WG_CONFIG" ]; then
  echo "Création du fichier de configuration WireGuard..."
  PrivateKey=$(wg genkey) || { echo "Erreur lors de la génération de la clé privée"; exit 1; }
  cat <<EOF > $WG_CONFIG
[Interface]
PrivateKey = $PrivateKey
Address = 10.0.0.1/24, fd00::1/64
ListenPort = $LISTEN_PORT
DNS = $DNS

EOF
  chmod 600 $WG_CONFIG
fi

# Arrêter WireGuard s'il est déjà en cours d'exécution
wg-quick down wg0 &>/dev/null || true

# Démarrage de WireGuard
echo "Démarrage de WireGuard..."
wg-quick up wg0 || { echo "Impossible de démarrer WireGuard"; exit 1; }

INTERFACE=$(ip route | grep default | awk '{print $5}')
iptables -t nat -A POSTROUTING -o $INTERFACE -s 10.0.0.0/24 -j MASQUERADE
ip6tables -t nat -A POSTROUTING -o $INTERFACE -s fd00::/64 -j MASQUERADE

# Démarrage de l'API WireGuard
echo "Démarrage de l'API WireGuard..."
exec /app/wg_api
# while true; do sleep 1; done