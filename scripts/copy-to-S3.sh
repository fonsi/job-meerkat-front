#!/bin/bash
#
# SPA note — unknown paths must still serve the app shell (same HTML as `/`).
# Otherwise S3 returns its generic XML error for deep links and refreshes.
#
# Configure one of:
# - S3 static website hosting: set Error document to `index.html` or `404.html`
#   (this build copies `index.html` → `404.html` so either name works).
# - CloudFront: custom error responses for 403/404 → `/index.html` with HTTP 200.
#
# Website hosting endpoint or CloudFront is required; the REST API endpoint does
# not use the error document.

set -euo pipefail

# Do not `source` .env files: values (emails, URLs with @, etc.) are not shell-safe.
load_env_file() {
    local file="$1"
    [ -f "$file" ] || {
        echo "Missing ${file}" >&2
        return 1
    }
    while IFS= read -r line || [ -n "$line" ]; do
        line="${line//$'\r'/}"
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ -z "${line// }" ]] && continue
        line="${line#export }"
        line="${line#export	}"
        case "$line" in
            *=*)
                key="${line%%=*}"
                val="${line#*=}"
                key="${key#"${key%%[![:space:]]*}"}"
                key="${key%"${key##*[![:space:]]}"}"
                [[ -z "$key" ]] && continue
                if [[ "$val" =~ ^\"(.*)\"$ ]]; then
                    val="${BASH_REMATCH[1]}"
                elif [[ "$val" =~ ^\'(.*)\'$ ]]; then
                    val="${BASH_REMATCH[1]}"
                fi
                export "${key}"="${val}"
                ;;
        esac
    done <"$file"
}

load_env_file .env.local

export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
export AWS_REGION=$AWS_REGION

PUBLIC_DIR="./.output/public"
if [ -f "${PUBLIC_DIR}/index.html" ]; then
    cp "${PUBLIC_DIR}/index.html" "${PUBLIC_DIR}/404.html"
fi

aws s3 sync "${PUBLIC_DIR}" "$WEB_BUCKET" --exclude "*.DS_Store" --delete