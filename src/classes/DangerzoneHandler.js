'use strict';
var insidePolygon = require('./helper/insidePolygon')
import { appConstants } from '../constants/appConstants.js'

module.exports = class DangerzoneHandler {

    constructor(mongoose, mqttTrackerObserver){
        this.mongoose = mongoose;
        this.Dangerzone = this.mongoose.model('Dangerzone');

        this.mqttTrackerObserver = mqttTrackerObserver;

        // keep track of nodes inside dangerzone
        this.trackersInsideDangerzoneList = [];

        this.message_alarmOff = '{"port":1,"payload_fields":{"alarm": false}}';
        this.message_alarmOn = '{"port":1,"payload_fields":{"alarm": true}}';
    }

    checkIfInDangerzone(trackerId, payload){
        var alarmTopic = appConstants.MQTT_TOPIC_TRACKER + trackerId + "/down";
        var gpsObject = JSON.parse(payload.toString());
        var elementIndex = this.trackersInsideDangerzoneList.indexOf(trackerId);
        var self = this;

        if(appConstants.LOGGING){console.log("New Message, GPS-Data: "+ JSON.stringify(gpsObject))}

        // find all dangerzones
        this.Dangerzone.find()
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
    }

    handleMongooseError(error){
        console.log("ERROR" + error);
    }
}

