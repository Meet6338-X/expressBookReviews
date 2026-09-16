const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios").default;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username or Password not provided" });

  // check if user already exists
  if (isValid(username))
    return res.status(400).json({ message: "Username alredy registered" });

  // register user and return response
  users.push({ username: username, password: password });

  return res
    .status(200)
    .json({ message: "User successfully registred. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  return res.status(200).json({
    status: "success",
    results: Object.keys(books).length,
    data: books,
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ status: "success", data: book });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booKeys = Object.keys(books);
  const bookIsbn = booKeys.filter((key) => books[key].author === author);
  const book = books[parseInt(bookIsbn[0])];

  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ status: "success", data: book });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booKeys = Object.keys(books);
  const bookIsbn = booKeys.filter((key) => books[key].title === title);
  const book = books[parseInt(bookIsbn[0])];

  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ status: "success", data: book });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const bookReview = books[isbn].reviews;

  if (!bookReview) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ status: "success", reviews: bookReview });
});

module.exports.general = public_users;
