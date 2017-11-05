const path = require("path");
const express = require('express');
var BUILD_DIR = path.join(__dirname, "build")
var PORT = process.env.PORT || 8000;

var app = express();
app.use(express.static(BUILD_DIR));

// We initialize the server here
app.listen(PORT, function() {
    console.log('Server listening on port', PORT);
});



