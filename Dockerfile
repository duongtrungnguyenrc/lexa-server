FROM node:20
FROM python:3.10

WORKDIR /usr/src

COPY package.json .
COPY package-lock.json .

RUN pip install pyspark
RUN npm install

COPY . .