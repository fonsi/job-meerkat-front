#!/bin/bash

source .env.local

export AWS_PROFILE=$AWS_PROFILE

aws s3 sync ./out $WEB_BUCKET --exclude "*.DS_Store" --delete