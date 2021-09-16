#!/bin/sh

echo "Creating backups..."
cp -R $1 ~/tmp/production_api.bak && cp -R $2 ~/tmp/production_frontend.bak
if [ $? -ne 0 ]
    then
    echo "An error occured when creating the backups. Check that the directories exist and have the appropiate permissions"
    exit 1
fi
echo "Backups created succesfully."