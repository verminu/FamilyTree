const express = require('express');
const bodyParser = require('body-parser');
const userApiRouter = require('./server/api-router');
const {join} = require("path");

// create the express application
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userApiRouter);

// Serve static files from the React app's build folder
app.use(express.static(join(__dirname, 'client/build')));

// Define a catch-all route to serve the React app
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'client/build', 'index.html'));
});

// start the application and listen to the specified port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});