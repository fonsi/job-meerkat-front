#!/bin/bash
#
# SPA note — unknown paths serve the prerendered branded 404 page (`404.html`).
# `/job/?slug=` redirects to `/jobpost/{slug}` (full document load). A request to
# `/job?slug=…` (no slash before `?`) often 302s to `/job/` and drops the query.
# Do not use `trailingSlash: 'always'` with query URLs.
#
# Configure SPA fallback on S3 only (website hosting error document `404.html`).
# This build writes a script-free `404.html` from the prerendered `/404/` page
# so error documents are not hydrated as `/company/$id` (or similar) client routes.
# Do not use CloudFront custom errors that map 403/404 → `/index.html` with HTTP 200:
# those are distribution-wide and would replace `/jobpost/{slug}` Lambda 404s.
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
node scripts/writeStatic404.js

aws s3 sync "${PUBLIC_DIR}" "$WEB_BUCKET" --exclude "*.DS_Store" --delete