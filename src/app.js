console.log("start atas-service");

var express = require('express');
var DangerzoneHandler = require('./classes/DangerzoneHandler.js');
import { appConstants } from './constants/appConstants.js'
const PORT = process.env.PORT || 8000;

export const app = express();

// setup db connection
var mongoose = require('mongoose'),
    Dangerzone = require('./api/models/dangerzone'),
    bodyParser = require('body-parser'),
    cors = require('cors');

//mongoose db connect
mongoose.Promise = global.Promise;
var dbpromise = mongoose.connect(appConstants.MONGODB_URL, {
	useMongoClient: true
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// We initialize the server here
app.listen(PORT, function() {
    console.log('Server listening on port', PORT);
});

// routes
var routes = require('./api/routes/route');
routes(app);

var dangerzonehandler = new DangerzoneHandler(mongoose);

// DB Connection error handling
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + appConstants.MONGODB_URL);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});


// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});
