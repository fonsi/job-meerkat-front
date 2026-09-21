#!/bin/bash
#
# Deploy the /jobpost/{slug} HTML Lambda (Function URL) to eu-west-1.
# Loads .env.local the same way as copy-to-S3.sh. Pass Serverless args through,
# e.g. `--stage=production`.
#
# After deploy, copy the Function URL into CloudFront as a custom origin.
# See docs/cloudfront-jobpost.md.

set -euo pipefail

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

: "${AWS_ACCESS_KEY_ID:?AWS_ACCESS_KEY_ID is required}"
: "${AWS_SECRET_ACCESS_KEY:?AWS_SECRET_ACCESS_KEY is required}"
: "${AWS_REGION:?AWS_REGION is required}"
: "${NEXT_PUBLIC_API_ENDPOINT:?NEXT_PUBLIC_API_ENDPOINT is required}"
: "${NEXT_PUBLIC_SITE_URL:?NEXT_PUBLIC_SITE_URL is required}"
: "${NEXT_PUBLIC_APP_ENV:?NEXT_PUBLIC_APP_ENV is required}"

export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_REGION
export AWS_DEFAULT_REGION="$AWS_REGION"
export NEXT_PUBLIC_API_ENDPOINT NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_APP_ENV
export NEXT_PUBLIC_GA_MEASUREMENT_ID="${NEXT_PUBLIC_GA_MEASUREMENT_ID:-}"
export NEXT_PUBLIC_ADSENSE_ID="${NEXT_PUBLIC_ADSENSE_ID:-}"
export UMAMI_ID="${UMAMI_ID:-}"

npx serverless deploy --verbose "$@"
