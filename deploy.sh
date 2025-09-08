#!/bin/bash
set -e  # Exit on any error
sleep 2

# ----- Ensure required env variables -----
: "${BASE_DIR:?Need to set BASE_DIR}"
: "${BRANCH:?Need to set BRANCH}"
: "${TAG:=latest}"
: "${REPO_NAME:?Need to set REPO_NAME}"
: "${REPO_URL:?Need to set REPO_URL}"
: "${CONTAINER_NAME:?Need to set CONTAINER_NAME}"

cd "$BASE_DIR" || exit 1

# ----- Update or clone repo -----
if [ -d "$REPO_NAME" ]; then
    echo "🔄 Updating existing repo..."
    cd "$REPO_NAME"
    git fetch origin
    git reset --hard origin/"$BRANCH"
    git clean -fd
else
    echo "📥 Cloning repository $REPO_URL (branch: $BRANCH)..."
    git clone -b "$BRANCH" "$REPO_URL" "$REPO_NAME"
    cd "$REPO_NAME"
fi

# ----- Show recent commits -----
git log -n 3 --oneline

# ----- Copy .env only (do not overwrite Dockerfile) -----
cp "$BASE_DIR/.env" .

# ----- Build Docker image with tag -----
IMAGE_NAME="$REPO_NAME:$TAG"
echo "🐳 Building Docker image $IMAGE_NAME..."
docker build -t "$IMAGE_NAME" .

# ----- Stop old container if running -----
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping existing container $CONTAINER_NAME..."
    docker rm -f "$CONTAINER_NAME"
fi

# ----- Remove old image (optional) -----
docker rmi "$REPO_NAME:latest" 2>/dev/null || true

# ----- Start container -----
if [ -f docker-compose.yml ]; then
    echo "🚀 Starting $CONTAINER_NAME service with docker-compose..."
    docker compose up -d --build --force-recreate
else
    echo "🚀 Running container $CONTAINER_NAME directly..."
    docker run -d --name "$CONTAINER_NAME" --env-file .env -p 3000:3000 "$IMAGE_NAME"
fi

# ----- Show logs -----
sleep 5
echo "📄 Logs from $CONTAINER_NAME ($TAG):"
docker logs "$CONTAINER_NAME"
