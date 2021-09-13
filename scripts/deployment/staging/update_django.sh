#!/bin/sh

cd $1
echo "Activating python virtual environment in $1..."
source venv/bin/activate

export ENV=staging


if [ $? -ne 0 ]
then
    echo "An error occured activating the virtual environemnt. Make sure the environment exists and that the path argument is correct."
    exit 1
fi

echo "Updating dependencies..."
poetry install
if [ $? -ne 0 ]
then
    echo "An error occured installing dependencies."
    exit 2
fi

echo "Starting initial checks..."
python3 manage.py check
if [ $? -ne 0 ]
then
    echo "An error occured during the final checks."
    exit 3
fi

echo "Collecting static files..."
python3 manage.py collectstatic --noinput
if [ $? -ne 0 ]
then
    echo "An error occured when collecting static files."
    exit 4
fi

echo "Applying database migrations..."
python3 manage.py migrate --noinput
if [ $? -ne 0 ]
then
    echo "An error occured when applying migrations."
    exit 5
fi

echo "Starting final checks..."
python3 manage.py check --database default --deploy
if [ $? -ne 0 ]
then
    echo "An error occured during the final checks."
    exit 6
fi

echo "Restarting wsgi..."
touch backend/staging.wsgi.py
if [ $? -ne 0 ]
then
    echo "wsgi.py couldn't be found. Failed to restart apache automatically."
fi

echo "Django webapp updated succesfully."