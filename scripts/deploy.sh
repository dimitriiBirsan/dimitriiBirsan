#!/usr/bin/env bash
set -euo pipefail

# Restrict command arguments before interpolating them into the remote shell.
[[ "${DEPLOY_HOST:-}" =~ ^[a-zA-Z0-9.-]+$ ]] || { echo 'DEPLOY_HOST must be a hostname or IPv4 address'; exit 1; }
[[ "${DEPLOY_USER:-}" =~ ^[a-zA-Z0-9_-]+$ ]] || { echo 'Invalid DEPLOY_USER'; exit 1; }
[[ "${DEPLOY_PATH:-}" =~ ^/[a-zA-Z0-9/_-]+$ && "$DEPLOY_PATH" != '/' ]] || { echo 'DEPLOY_PATH must be an absolute application directory'; exit 1; }
[[ "${IMAGE_DIGEST:-}" =~ ^sha256:[a-f0-9]{64}$ ]] || { echo 'Invalid image digest'; exit 1; }
[[ -n "${DEPLOY_KEY:-}" && -n "${DEPLOY_KNOWN_HOSTS:-}" ]] || { echo 'SSH key and pinned known-hosts entries are required'; exit 1; }

umask 077
key_file="$(mktemp)"
hosts_file="$(mktemp)"
image_file="$(mktemp)"
trap 'rm -f "$key_file" "$hosts_file" "$image_file"' EXIT
printf '%s\n' "$DEPLOY_KEY" > "$key_file"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$hosts_file"
image_name="ghcr.io/${GITHUB_REPOSITORY,,}@${IMAGE_DIGEST}"
printf 'services:\n  website:\n    image: %s\n' "$image_name" > "$image_file"
ssh_options=(-i "$key_file" -o BatchMode=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$hosts_file")
remote="${DEPLOY_USER}@${DEPLOY_HOST}"

# The provisioned application directory contains its production .env file.
# Keep the previous manifest and digest available for an explicit rollback.
ssh "${ssh_options[@]}" "$remote" "test -d '$DEPLOY_PATH' && cd '$DEPLOY_PATH' && if test -f compose.release.yml; then cp compose.release.yml compose.previous.yml; fi && if test -f image.release.yml; then cp image.release.yml image.previous.yml; fi"
scp "${ssh_options[@]}" docker-compose.yml "$remote:$DEPLOY_PATH/compose.release.yml"
scp "${ssh_options[@]}" "$image_file" "$remote:$DEPLOY_PATH/image.release.yml"
ssh "${ssh_options[@]}" "$remote" "cd '$DEPLOY_PATH' && docker compose --project-name dimitrii-website -f compose.release.yml -f image.release.yml config --quiet && docker compose --project-name dimitrii-website -f compose.release.yml -f image.release.yml pull website && docker compose --project-name dimitrii-website -f compose.release.yml -f image.release.yml up -d --no-build --no-deps --wait website"
