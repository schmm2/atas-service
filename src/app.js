console.log("start atas-service");

// INCLUDES + SETUP
var express = require('express');
var DangerzoneHandler = require('./classes/DangerzoneHandler.js');
import { appConstants } from './constants/appConstants.js'
const PORT = process.env.PORT || 8000;
const mqtt = require('mqtt')
import mqtt_regex from 'mqtt-regex';

export const app = express();

// setup db connection
var mongoose = require('mongoose'),
  Dangerzone = require('./api/models/dangerzone'),
  Node = require('./api/models/node'),
  NodeData = require('./api/models/nodedata'),
  bodyParser = require('body-parser'),
  cors = require('cors');

var trackerIDPattern = appConstants.MQTT_TOPIC_TRACKER + "+id/#path";

// RUN

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

// MQTT
var mqttOptions = {
    port: appConstants.MQTT_BROKER_PORT,
    host: appConstants.MQTT_BROKER_URL,
    clientId: appConstants.NAME + Math.random().toString(16).substr(2, 8),
    username: appConstants.MQTT_BROKER_USER,
    password: appConstants.MQTT_BROKER_PASSWORD,
    keepalive: 60,
    reconnectPeriod: 2000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var mqttTrackerObserver = mqtt.connect(appConstants.MQTT_BROKER_URL, mqttOptions);
var dangerzonehandler = new DangerzoneHandler(mongoose, mqttTrackerObserver);

mqttTrackerObserver.on('connect', function () {
    console.log(appConstants.NAME + " - Mqtt connected");
    // subscribe
    mqttTrackerObserver.subscribe(appConstants.MQTT_TOPIC_TRACKER + "+/up/gps");
    mqttTrackerObserver.subscribe(appConstants.MQTT_TOPIC_TRACKER + "+/up/buttonpressed");
})

mqttTrackerObserver.on('message', function(topic, payload, packet) {
    // get node id
    var message_info = mqtt_regex(trackerIDPattern).exec;
    // get tracker id from topic parameter
    var trackerId = message_info(topic).id;

    if(appConstants.LOGGING){console.log("Tracker: "+ trackerId)}
    if(appConstants.LOGGING){console.log("New Message arrived, topic:" + topic)}

    // switch throug topics
    switch(topic) {
        case (appConstants.MQTT_TOPIC_TRACKER + trackerId + "/up/gps"):
            dangerzonehandler.checkIfInDangerzone(trackerId,payload);
            break;
        default:
            break;
    }
});


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
