# simple-nodejs-app
Node JS application for MEAN stack. We are working with JavaScript, ExpressJS, NodeJS and MongoDB.

With the above stack we are trying to create a simple user module where we can `signup`, `login`, `logout`...

**Project has a dependency on MongoDB so its important that you do the setup properly to ge this application working.

## Install dependencies
Start by installing all the dependencies for this project.
>npm install

## nodejs-app
To start the server instance run below command
>npm run start:server

Now the server instance is available at below location.
>http://localhost:3000/

## MongoDB
There is a pretty good article on MongoDB setup and connection.
https://codezup.com/integrate-mongodb-with-node-js-mean-stack/
- Read through this article and do the setup.
- Update the connection string in app.js
- Update the password in nodemon.json

Now you can connect to the DB from your local system.

## Postman
Lets use postman to create user / sign up.

| URL | Method | Body |
| :---:         |     :---:      |          :---: |
|http://localhost:3000/api/user/signup|POST|{"username": "myUserName","password": "myUserNamePassword","displayName": "Cool Name Here","roles": ["CS"]}|
|http://localhost:3000/api/user/login|POST|{"username":"super-admin","password":"kumar16$"}|

With login API you will receive `token` which you can use to call other APIs, like, `getUsers`.
