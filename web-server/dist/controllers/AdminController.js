"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CheckDistance_1 = require("../utils/CheckDistance");
require('dotenv').config();
const uploadImageTrial = async (req, res) => {
    console.log(req.file, req.body);
    let logs = {
        field: "Image Uploaded",
        message: req.file
    };
    res.status(200).json({ logs });
};
const sendMessageTrial = async (req, res) => {
    console.log(req);
    let logs;
    let _num = '+91' + req.body.num;
    try {
        const accountSid = "AC40b97c92dee093371027ad5a964f24ef";
        const authToken = "a8873200268946a99d4189d032698577";
        const client = require("twilio")(accountSid, authToken);
        let status = client.messages.create({ body: "Thanks for otp", from: "+15075167323", to: _num }).then(message => {
            console.log(message.sid);
            return message.sid;
        });
        res.status(200).json(status);
        return;
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const checkDistance = async (req, res) => {
    const policeLat = parseFloat(req.body.policeLat);
    const policeLon = parseFloat(req.body.policeLon);
    const centerLat = parseFloat(req.body.centerLat);
    const centerLon = parseFloat(req.body.centerLon);
    const radius = parseFloat(req.body.radius);
    let _distance = (0, CheckDistance_1.isNearby)(policeLat, policeLon, centerLat, centerLon, radius);
    res.status(200).json(_distance);
};
module.exports = {
    uploadImageTrial, sendMessageTrial, checkDistance
};
//# sourceMappingURL=AdminController.js.map