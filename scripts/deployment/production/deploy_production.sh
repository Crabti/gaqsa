#!/bin/sh

PRODUCTION_API_DIR="~/api.gaqsa.com"
PRODUCTION_FRONTEND_DIR="~/prod.gaqsa.com"

SCRIPT_DIR=$(dirname "$0")

LOCAL_BACKEND=$2
LOCAL_FRONTEND=$3

if [ $# -eq 3 ]
    then
    echo "Deploying to production..."

    # Check that folders exist
    if [ ! -d $LOCAL_BACKEND ]
        then
        echo "$LOCAL_BACKEND does not exist."
        exit 1
    fi
    if [ ! -d $LOCAL_FRONTEND ]
        then
        echo "$LOCAL_FRONTEND does not exist."
        exit 1
    fi

    # Create backups
    ssh $1 'bash -s' < $SCRIPT_DIR/create_backup.sh $PRODUCTION_API_DIR $PRODUCTION_FRONTEND_DIR
    
    if [ $? -ne 0 ]
        then
        exit 2
    fi
    #############################

    # Initiating file sync and updates
    if
        $SCRIPT_DIR/sync_files.sh $LOCAL_BACKEND $1:$PRODUCTION_API_DIR && \
        $SCRIPT_DIR/sync_files.sh $LOCAL_FRONTEND $1:$PRODUCTION_FRONTEND_DIR && \
        ssh $1 'bash -s' < $SCRIPT_DIR/update_django.sh $PRODUCTION_API_DIR
    then
        echo "Deployment to production finished."
        exit 0
    else
        # Rollback application file changes with backup
        ssh $1 'bash -s' < $SCRIPT_DIR/rollback.sh $PRODUCTION_API_DIR $PRODUCTION_FRONTEND_DIR
        exit 3
        #############################
    fi

else
    echo "Invalid command usasge. Usage: deploy_production.sh SSH_USER@SSH_HOST LOCAL_BACKEND_FOLDER LOCAL_FRONTEND_FOLDER"
    exit 1
fi