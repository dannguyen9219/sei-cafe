require('dotenv').config(); // Make sure all the variables in .env are accessible to us; this will read all that is in .env //
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require ('morgan');
const PORT = process.env.PORT || 3001 // because frontend is on 3000

// Connect to the database
require('./config/database.js'); // this runs the database file

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico'))); // Use this so that it doesn't matter what OS you use // directory name - current directory you are inside - value of directory you are currently inside - Mern-infrastructure // this is to have a favicon on our website

app.use(express.static(path.join(__dirname, 'build'))); // want to static the build folder because it is the production ready code to deploy; this is what we want to serve; static means anything in this folder I want to serve as is // it will also figure out what computer you are on, and it will figure out the path

// Check if token and create req.user
app.use(require('./config/checkToken'));

// API //
app.use('/api/users', require('./routes/api/users'));
// Protect the API routes below from anonymous users
const ensureLoggedIn = require('./config/ensureLoggedIn');
app.use('/api/items', ensureLoggedIn, require('./routes/api/items'));
app.use('/api/orders', ensureLoggedIn, require('./routes/api/orders'));

// This is the catch all and is necessary to return the index.html on all non-AJAX requests
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
}); // Whenever you do something that isn't an API request, and not in the build folder, then run this catch all route; it will route back to index.html 


app.listen(PORT, () => {
    console.log(`Backend is listening on ${PORT}`)
});