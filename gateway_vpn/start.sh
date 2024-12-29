#!/bin/bash

# Configuration
IMAGE_NAME="jordansissilian/gateway_silentwave_vpn:v1-amd64"
CONTAINER_NAME="gateway_vpn"
LOCAL_FILE="/root/gateway_vpn/vpn.json" #Path vers votre vpn.json
CONTAINER_FILE="/etc/krakend/data/vpn.json"
HOST_PORT=8082
CONTAINER_PORT=8080
START_COMMAND="./scripts/run.sh"

# Étape 1 : Lancer le conteneur en attente
echo "Démarrage du conteneur en mode attente..."
docker run -dit --name "$CONTAINER_NAME" -p "$HOST_PORT:$CONTAINER_PORT" --entrypoint bash "$IMAGE_NAME"

# Vérification du démarrage du conteneur
if [ $? -ne 0 ]; then
    echo "Échec du démarrage du conteneur."
    exit 1
fi

# Étape 2 : Copier le fichier dans le conteneur
echo "Copie du fichier $LOCAL_FILE vers le conteneur ($CONTAINER_FILE)..."
docker cp "$LOCAL_FILE" "$CONTAINER_NAME:$CONTAINER_FILE"

if [ $? -ne 0 ]; then
    echo "Échec de la copie du fichier dans le conteneur."
    docker stop "$CONTAINER_NAME" >/dev/null 2>&1
    docker rm "$CONTAINER_NAME" >/dev/null 2>&1
    exit 1
fi

# Étape 3 : Lancer le service dans le conteneur
echo "Lancement du service dans le conteneur..."
docker exec -d -it "$CONTAINER_NAME" bash -c "$START_COMMAND"

if [ $? -ne 0 ]; then
    echo "Échec du lancement du service dans le conteneur."
    docker stop "$CONTAINER_NAME" >/dev/null 2>&1
    docker rm "$CONTAINER_NAME" >/dev/null 2>&1
    exit 1
fi

echo "Conteneur lancé avec succès et fichier remplacé !"