#!/bin/sh

echo "Syncing $1 to $2..."
rsync -aP $1/* $2
if [ $? -ne 0 ]
    then
    echo "An error ocurred syncing $1 with $2"
    exit 1
fi
echo "$2 succesfully synced with $1"
