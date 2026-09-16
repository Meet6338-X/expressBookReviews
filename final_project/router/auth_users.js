const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const userswithsamename = users.filter((user) => user.username === username);

  if (userswithsamename.length > 0) return true;

  return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validateUser = users.filter(
    (user) => user.username === username && user.password === password
  );

  if (validateUser.length > 0) return true;

  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username or Password not provided Cannot Login" });

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });

    req.session.authorization = { accessToken, username };

    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const review = req.query.review;
  // const bookReview = books[isbn].reviews;
  const currUsername = req.session.authorization.username;

  // console.log(review);
  // console.log(bookReview);
  // console.log(currUsername);

  // bookReview[currUsername] = review;

  // add review to the reviews section for each user
  books[isbn].reviews[currUsername] = review;
  // console.log(books[isbn].reviews);

  // return res.status(200).json({ status: "success", reviews: bookReview });
  return res.status(200).json({ status: "added", review: review });
});

// Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const currUsername = req.session.authorization.username;

  // delete current user reviews
  delete books[isbn].reviews[currUsername];
  // console.log(books[isbn].reviews);

  return res
    .status(200)
    .json({ status: "deleted", message: `${currUsername} reviews deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
