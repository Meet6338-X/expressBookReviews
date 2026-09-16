const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios").default;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

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
    return res.status(400).json({ message: "Username already registered" });

  // register user and return response
  users.push({ username: username, password: password });

  return res
    .status(200)
    .json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop (async/await with Axios)
public_users.get("/", async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    return res.status(200).json({
      status: "success",
      results: Object.keys(response.data).length,
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get book details based on ISBN (async/await with Axios)
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get(`${BASE_URL}/data/isbn/${req.params.isbn}`);
    return res.status(200).json({ status: "success", data: response.data });
  } catch (error) {
    return res.status(404).json({ message: "Not found" });
  }
});

// Get book details based on author (async/await with Axios)
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get(
      `${BASE_URL}/data/author/${encodeURIComponent(req.params.author)}`
    );
    return res.status(200).json({ status: "success", data: response.data });
  } catch (error) {
    return res.status(404).json({ message: "Not found" });
  }
});

// Get all books based on title (async/await with Axios)
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get(
      `${BASE_URL}/data/title/${encodeURIComponent(req.params.title)}`
    );
    return res.status(200).json({ status: "success", data: response.data });
  } catch (error) {
    return res.status(404).json({ message: "Not found" });
  }
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

// ---------- Internal data endpoints (fetched by the Axios calls above) ----------

// serve the full books object
public_users.get("/data/books", (req, res) => {
  return res.status(200).json(books);
});

// serve book by ISBN
public_users.get("/data/isbn/:isbn", (req, res) => {
  const book = books[parseInt(req.params.isbn)];
  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(book);
});

// serve books by author
public_users.get("/data/author/:author", (req, res) => {
  const author = req.params.author;
  const result = Object.keys(books)
    .filter((key) => books[key].author === author)
    .reduce((acc, key) => {
      acc[key] = books[key];
      return acc;
    }, {});
  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(result);
});

// serve books by title
public_users.get("/data/title/:title", (req, res) => {
  const title = req.params.title;
  const result = Object.keys(books)
    .filter((key) => books[key].title === title)
    .reduce((acc, key) => {
      acc[key] = books[key];
      return acc;
    }, {});
  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(result);
});

module.exports.general = public_users;
