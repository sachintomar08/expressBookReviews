const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here    
    res.send(JSON.stringify(books,null,4));
});

// Get the book list available in the shop using Promise callbacks with Axios
public_users.get('/promise/books', function (req, res) {
    axios.get('http://localhost:5000/')
        .then(function (response) {
            return res.status(200).send(response.data);
        })
        .catch(function (error) {
            return res.status(500).json({ message: "Error fetching book list", error: error.message });
        });
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on ISBN using Promise callbacks with Axios
public_users.get('/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get('http://localhost:5000/isbn/' + isbn)
        .then(function (response) {
            return res.status(200).send(response.data);
        })
        .catch(function (error) {
            return res.status(500).json({ message: "Error fetching book details", error: error.message });
        });
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get('http://localhost:5000/isbn/' + isbn);
        return res.status(200).send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    // Step 1: Get all the keys of the books object
    const bookKeys = Object.keys(books);
    let authorBooks = {};
    // Step 2: Iterate through the keys and check the author
    bookKeys.forEach(key => {
        if (
            books[key].author.trim().toLowerCase() ===
            author.trim().toLowerCase()
        ) {
            authorBooks[key] = books[key];
        }
    });
    res.status(200).json(authorBooks);
});

// Get book details based on author using Promise callbacks with Axios
public_users.get('/promise/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get('http://localhost:5000/author/' + encodeURIComponent(author))
        .then(function (response) {
            return res.status(200).send(response.data);
        })
        .catch(function (error) {
            return res.status(500).json({ message: "Error fetching books by author", error: error.message });
        });
});

// Get book details based on author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get('http://localhost:5000/author/' + encodeURIComponent(author));
        return res.status(200).send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    // Step 1: Get all the keys of the books object
    const bookKeys = Object.keys(books);
    let titleBooks = {};
    // Step 2: Iterate through the keys and check the author
    bookKeys.forEach(key => {
        if (
            books[key].title.trim().toLowerCase() ===
            title.trim().toLowerCase()
        ) {
            titleBooks[key] = books[key];
        }
    });
    res.status(200).json(titleBooks);
});

// Get all books based on title using Promise callbacks with Axios
public_users.get('/promise/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get('http://localhost:5000/title/' + encodeURIComponent(title))
        .then(function (response) {
            return res.status(200).send(response.data);
        })
        .catch(function (error) {
            return res.status(500).json({ message: "Error fetching books by title", error: error.message });
        });
});

// Get all books based on title using async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get('http://localhost:5000/title/' + encodeURIComponent(title));
        return res.status(200).send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;