#!/bin/sh

STAGING_DIR="/home/gaqsacom/staging.crabti.gaqsa.com"


upload () {
    scp -r $BACKEND_FOLDER $USER@$HOST:$STAGING_DIR && scp -r $FRONTEND_FOLDER $USER@$HOST:$STAGING_DIR 
    if [ $? -ne 0]
        then
        echo "An error occured when uploading the folders."
        exit 2
    fi
    echo "Folders uploaded succesfully."
}
if [ $# -eq 2 ]
    then
    echo "Deploying to staging..."
    echo "Uploading artifacts to staging with scp..."

    upload
    
    echo "Connecting to staging with ssh..."
    
    ssh $1@$2 "cd $APP_HOME && $CHECKOUT_COMMAND"
    
    echo "Deployment to staging was succesful."
    exit 0
else
    echo "Invalid command usasge. Usage: deploy_staging.sh SSH_USER SSH_HOST"
    exit 1
fi