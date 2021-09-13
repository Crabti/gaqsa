#!/bin/sh

STAGING_API_DIR="~/api.staging.gaqsa.com"
STAGING_FRONTEND_DIR="~/staging.gaqsa.com"

SCRIPT_DIR=$(dirname "$0")

LOCAL_BACKEND=$2
LOCAL_FRONTEND=$3

if [ $# -eq 3 ]
    then
    echo "Deploying to staging..."

    # Create backups
    ssh $1 'bash -s' < $SCRIPT_DIR/create_backup.sh $STAGING_API_DIR $STAGING_FRONTEND_DIR
    
    if [ $? -ne 0 ]
        then
        exit 2
    fi
    #############################

    # Initiating file sync and updates
    if
        $SCRIPT_DIR/sync_files.sh $LOCAL_BACKEND $1:$STAGING_API_DIR && \
        $SCRIPT_DIR/sync_files.sh $LOCAL_FRONTEND $1:$STAGING_FRONTEND_DIR && \
        ssh $1 'bash -s' < $SCRIPT_DIR/update_django.sh $STAGING_API_DIR
    then
        echo "Deployment to staging finished."
        exit 0
    else
        # Rollback application file changes with backup
        ssh $1 'bash -s' < $SCRIPT_DIR/rollback.sh $STAGING_API_DIR $STAGING_FRONTEND_DIR
        exit 3
        #############################
    fi

else
    echo "Invalid command usasge. Usage: deploy_staging.sh SSH_USER@SSH_HOST LOCAL_BACKEND_FOLDER LOCAL_FRONTEND_FOLDER"
    exit 1
fi