'use strict';
import { appConstants } from '../constants/appConstants.js'

module.exports = class DataHandler {
    constructor(mongoose){
        this.mongoose = mongoose;
        this.Node = this.mongoose.model('Node');
        this.UplinkMessage = this.mongoose.model('UplinkMessage');
        this.UplinkMessageGateway = this.mongoose.model('UplinkMessageGateway');
    }

    storeData(data){
        var data = JSON.parse(data.toString());
        var self = this;

        var newUplinkMessage = new self.UplinkMessage({
            longitude: data.payload_fields.gps.lng,
            latitude: data.payload_fields.gps.lat,
            counter: data.counter,
            buttonpressed: (data.payload_fields.buttonpressed == 'true'),
            indangerzone: (data.payload_fields.indangerzone == 'true'),
            data_rate: data.metadata.data_rate,
            coding_rate: data.metadata.coding_rate,
            time: data.metadata.time,
            gateways: []
        });
        newUplinkMessage.save();

        if(typeof data.metadata.gateways != 'undefined'){
            for (var i = 0; i < data.metadata.gateways.length; i++) {
                var newUplinkMessageGateway = new self.UplinkMessageGateway({
                    snr: data.metadata.gateways[i].snr,
                    rssi: data.metadata.gateways[i].rssi,
                    gtw_id: data.metadata.gateways[i].gtw_id
                });
                newUplinkMessageGateway.save();
                // store
                newUplinkMessage.gateways.push(newUplinkMessageGateway);
            }
        }

        var newNode = new this.Node({
            name: data.dev_id,
            uplinkmessages: [newUplinkMessage],
        });

        this.Node.findOne(
            {name: data.dev_id}, // find a document
            function (err, node) { // callback
                // handle error
                if (err) {
                    console.log(err);
                } else {
                    // not existing yet, store node
                    if(node == null){
                        newNode.save(function (err) {
                            if(err){
                                console.log(err);
                            }else{
                                // save new node
                                newNode.save();
                            }
                        });
                    } else{
                        // add node data
                        node.uplinkmessages.push(newUplinkMessage);
                        node.save();
                    }
                }
            }
        );
    }

    handleMongooseError(error){
        console.log("ERROR" + error);
    }
}