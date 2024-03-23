FROM node:20.10.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

FROM python:3.10

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app/package*.json ./

RUN pip install --upgrade pip
RUN pip install pyspark

COPY . .

EXPOSE 3000
