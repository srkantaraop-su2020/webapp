# test-webapp
Cloud assignment 2
An Ecommerce web application for books using Node, React and MySQL

# Features
Create and Update user, login and logout, maintain cookies and session 
Buy and Sell books

# API Endpoints for User operations
GET: v1/user?userName=x - Get user by userName
PUT: v1/user?userName=x - Update a user
POST: v1/user - Create a new user
POST: v1/user/login - login user
GET: v1/user/logout - logout user
POST: v1/book - Create a book
GET: v1/book - Retrieve all books
PUT: v1/book - Update a book
GET: v1/book/:bookId - Retrieve book by bookId
DELETE: /v1/book/:bookId - Delete book by bookId
POST: v1/author - Create Author
PUT: v1/author/:bookId - Update Authors
POST: v1/addToCart - Add items to cart
GET: v1/getCartItems/:buyerId - Get Cart items by BuyerId
PUT: /v1/updateCartItem/:cartId - Update Cart items

# Installation and usage steps for backend
npm i or npm install
node server.js

# Installation and usage steps for frontend
cd frontend 
npm i or npm install
npm start or npm run start 

# Test the application
npm test

# Accessible ports
Front end : http://localhost:3000/
Back end : http://localhost:8080/ 