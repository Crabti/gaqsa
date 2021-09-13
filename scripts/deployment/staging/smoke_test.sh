#!/bin/sh

if [ -z "$1" ]
then
    echo "usage: smoketest.sh <url>"
    exit 1
fi

status=`curl -LI $1 -o /dev/null -w '%{http_code}\n' -s`

if [ "$status" != "200" ]
then
    echo "status was other than '200': was '$status'"
    exit 1
else
    echo "Smoke tests pass sucessfully with status $status"
fi
