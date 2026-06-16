#!/usr/bin/env bash
set -euo pipefail

printf "\nIMPROX AI secure local environment setup\n"
printf "This will create .env.local. The API key will NOT be printed.\n\n"

read -rp "Team users string [admin:ChangeMe123:admin:IMPROX Admin,editor:Editor123:enterprise:Production Editor]: " TEAM_USERS_INPUT
TEAM_USERS_INPUT=${TEAM_USERS_INPUT:-"admin:ChangeMe123:admin:IMPROX Admin,editor:Editor123:enterprise:Production Editor"}

read -rsp "Paste NVIDIA API key: " NVIDIA_KEY
printf "\n"

read -rp "NVIDIA chat model [meta/llama-3.1-405b-instruct]: " CHAT_MODEL
CHAT_MODEL=${CHAT_MODEL:-"meta/llama-3.1-405b-instruct"}

cat > .env.local <<ENV
# Private IMPROX AI local environment. Do not commit this file.
TEAM_USERS=${TEAM_USERS_INPUT}
ADMIN_SECRET=change_this_admin_secret

NVIDIA_API_KEY=${NVIDIA_KEY}
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_CHAT_MODEL=${CHAT_MODEL}

IMPROX_GENIUS_API_KEY=${NVIDIA_KEY}
IMPROX_GENIUS_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
IMPROX_GENIUS_MODEL=${CHAT_MODEL}

IMPROX_IMAGE_API_URL=https://integrate.api.nvidia.com/v1/images/generations
IMPROX_IMAGE_EDIT_API_URL=https://integrate.api.nvidia.com/v1/images/edits
IMPROX_IMAGE_MODEL=black-forest-labs/flux_1-kontext-dev
IMPROX_IMAGE_EDIT_MODEL=qwen/qwen-image-edit-2511
ENV

chmod 600 .env.local
printf "\nDone. .env.local created securely. Run: npm run dev\n"
