'use strict';
const mqtt = require('mqtt')
var insidePolygon = require('./helper/insidePolygon')
import { appConstants } from '../constants/appConstants.js'
import mqtt_regex from 'mqtt-regex';

module.exports = class DangerzoneHandler {

    constructor(mongoose){
        this.mongoose = mongoose;
        this.mqttTrackerObserver = null;

        // keep track of nodes inside dangerzone
        this.trackersInsideDangerzoneList = [];

        this.message_alarmOff = '{"port":1,"payload_fields":{"alarm": false}}';
        this.message_alarmOn = '{"port":1,"payload_fields":{"alarm": true}}';

        this.mqttOptions = {
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

        this.trackerIDPattern = appConstants.MQTT_TOPIC_TRACKER + "+id/#path";

        // init the handler
        this.init();
    }

    init(){
        this.mqttTrackerObserver = mqtt.connect(appConstants.MQTT_BROKER_URL, this.mqttOptions);
        var self = this;

        this.mqttTrackerObserver.on('connect', function () {
            console.log(appConstants.NAME + " - Mqtt connected");
            // subscribe
            self.mqttTrackerObserver.subscribe(appConstants.MQTT_TOPIC_TRACKER + "+/up/gps");
            self.mqttTrackerObserver.subscribe(appConstants.MQTT_TOPIC_TRACKER + "+/up/buttonpressed");
        })

        this.mqttTrackerObserver.on('message', function(topic, payload, packet) {
           // get node id
            var message_info = mqtt_regex(self.trackerIDPattern).exec;
            // get tracker id from topic parameter
            var trackerId = message_info(topic).id;
            //console.log("Tracker: "+ trackerId);
            var alarmTopic = appConstants.MQTT_TOPIC_TRACKER + trackerId + "/down";
            // log
            //console.log("New Message arrived, topic:" + topic);

            // switch throug topics
            switch(topic) {
                case (appConstants.MQTT_TOPIC_TRACKER + trackerId + "/up/gps"):
                    var gpsObject = JSON.parse(payload.toString());
                    var elementIndex = self.trackersInsideDangerzoneList.indexOf(trackerId);
                    // find all dangerzones
                    var Dangerzone = self.mongoose.model('Dangerzone');
                    Dangerzone.find()
                        .exec(function (err, listOfDangerzones) {
                            var insideDangerzone = false;

                            if (err) return handleMongooseError(err);
                            // check if gps data are inside a dangerzone
                            for (var i = 0; i < listOfDangerzones.length; i++) {
                                //console.log(listOfDangerzones[i]);
                                if (insidePolygon(gpsObject, listOfDangerzones[i])) {
                                    // tracker not yet informed / added to list
                                    if(elementIndex == -1){
                                        // inside a dangerzone, alarm the tracker
                                        self.mqttTrackerObserver.publish(alarmTopic, self.message_alarmOn);
                                        self.trackersInsideDangerzoneList.push(trackerId);
                                    }
                                    insideDangerzone = true;
                                    break;
                                }
                            }
                            // found tracker which left the dangerzone
                            if(insideDangerzone == false && elementIndex > -1){
                                self.mqttTrackerObserver.publish(alarmTopic, self.message_alarmOff);
                                self.trackersInsideDangerzoneList.splice(elementIndex, 1);
                            }
                        });
                    break;
                default:
                    break;
            }
        });

        function handleMongooseError(error){
            console.log("ERROR" + error);
        }
    }
}

