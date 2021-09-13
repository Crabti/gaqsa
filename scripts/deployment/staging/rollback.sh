#!/bin/sh
echo "Initiating rollback..."
echo "Rolling back api..."
rsync -a --delete --exclude '*/media/*' ~/tmp/staging_api.bak/ $1
if [ $? -ne 0 ]
    then
    echo "An error occured when attempting to rollback the frontend folder. Please do a manual rollback or push a fix."
fi

echo "Rolling back frontend..."
rsync -a --delete ~/tmp/staging_frontend.bak/ $2
if [ $? -ne 0 ]
    then
    echo "An error occured when attempting to rollback the frontend folder. Please do a manual rollback or push a fix."
fi

echo "Removing backups..."
rm -r ~/tmp/staging_api.bak
rm -r ~/tmp/staging_frontend.bak