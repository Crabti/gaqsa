FROM python:3.8.1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=${PYTHONPATH}:${PWD}

WORKDIR /app/backend

# Install wait script
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

RUN pip3 install poetry
RUN pip3 install mysqlclient
RUN poetry config virtualenvs.create false
COPY poetry.lock pyproject.toml /app/backend/
RUN poetry install
COPY . /app/backend
