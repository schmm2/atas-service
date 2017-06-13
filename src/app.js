import express from 'express'
var DangerzoneHandler = require('./classes/DangerzoneHandler.js');
export const app = express();

// setup
var mongoose = require('mongoose'),
    Dangerzone = require('./api/models/dangerzone'),
    bodyParser = require('body-parser'),
    cors = require('cors');

//mongoose db connect
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/atasdb');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
var routes = require('./api/routes/route');
routes(app);

var dangerzonehandler = new DangerzoneHandler(mongoose);