# Burger Queen - API

<p align="center">
  <img width="250" alt="What the hell is this?" src="https://github.com/alefyp/BOG001-burger-queen-api/blob/dev/Bqapi.png" />
</p>

_A very nice API._

## Stack
  - Node.js
  - Express
  - MongoDB

To complete this project I learned about routes, URLs, HTTP and REST (verbs, request, response, headers, params, body, status codes), JSON, JWT (JSON Web Tokens), MongoDB, hash functions, environment variables and docker containers.

## Install 
```
npm start
```

Environment variables:
  - `PORT`: 8080 by default
  - `DB_URL`: MongoDB connection string 
  - `JWT_SECRET`: Authentication implements JWT (JSON Web Tokens). In order to sign (encrypt) and verify (decrypt) the tokens, we need a secret.
  - `ADMIN_EMAIL`: Root admin user. `admin@localhost` by default.
  - `ADMIN_PASSOWRD`: Admin user password. 

## Endpoints

### `/`

* `GET /`

### `/auth`

* `POST /auth`

### `/users`

* `GET /users`
* `GET /users/:uid`
* `POST /users`
* `PUT /users/:uid`
* `DELETE /users/:uid`

### `/products`

* `GET /products`
* `GET /products/:productid`
* `POST /products`
* `PUT /products/:productid`
* `DELETE /products/:productid`

### `/orders`

* `GET /orders`
* `GET /orders/:orderId`
* `POST /orders`
* `PUT /orders/:orderId`
* `DELETE /orders/:orderId`

Full documentation <a href="https://laboratoria.github.io/burger-queen-api/index.html">here</a>.