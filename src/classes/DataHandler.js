'use strict';
import { appConstants } from '../constants/appConstants.js'

module.exports = class DataHandler {
    constructor(mongoose){
        this.mongoose = mongoose;
        this.Node = this.mongoose.model('Node');
        this.NodeData = this.mongoose.model('NodeData');
    }

    storeData(data){
        var data = JSON.parse(data.toString());
        var self = this;

        console.log("Datahandler, Node ID: "+ data.dev_id);

        var newNodeData = new self.NodeData({
            longitude: data.payload_fields.gps.lng,
            latitude: data.payload_fields.gps.lat,
            buttonpressed: (data.payload_fields.buttonpressed == 'true'),
            time: data.metadata.time,
            snr: data.metadata.snr,
            rssi: data.metadata.rssi,
            gateway: data.metadata.gateway,
        });
        newNodeData.save();

        var newNode = new this.Node({
            name: data.dev_id,
            data: [newNodeData],
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
                        node.data.push(newNodeData);
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