const app = require('./build/bundle').app,
    PORT = process.env.PORT || 8000;

// We initialize the server here
app.listen(PORT, function() {
    console.log('Server listening on port', PORT);
});



