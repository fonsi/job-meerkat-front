#!/bin/bash

source .env.local

export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
export AWS_REGION=$AWS_REGION

aws s3 sync ./out $WEB_BUCKET --exclude "*.DS_Store" --delete