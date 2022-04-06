const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require ('morgan');
const PORT = process.env.PORT || 3001 // because frontend is on 3000


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico'))); // Use this so that it doesn't matter what OS you use // directory name - current directory you are inside - value of directory you are currently inside - Mern-infrastructure // this is to have a favicon on our website

app.use(express.static(path.join(__dirname, 'build'))); // want to static the build folder because it is the production ready code to deploy; this is what we want to serve; static means anything in this folder I want to serve as is //

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
}); // Whenever you do something that isn't an API request, and not in the build folder, then run this catch all route; it will route back to index.html 


app.listen(PORT, () => {
    console.log(`Backend is listening on ${PORT}`)
});