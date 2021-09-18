#!/bin/bash
echo "Checking lint"
poetry run flake8 --exclude="*.pyc,venv/,*/migrations/*"

echo "Running tests"
poetry run coverage run manage.py test

echo "Check test coverage"
poetry run coverage report --fail-under=80