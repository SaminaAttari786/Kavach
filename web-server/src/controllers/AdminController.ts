import { Request, Response } from 'express';
// import { ResponseFormat } from "../resolvers/Format";
// import argon2 from "argon2";
import { connection } from "../connection";
import { MongoServerError } from 'mongodb'
import { uploadOnImgur } from '../imgur';
import { formatDate, addWeeksToDate } from '../utils/DateFormat'
import mongoose from "mongoose";
import { calculateDistance, isNearby } from '../utils/CheckDistance';

require('dotenv').config()


const uploadImageTrial = async (req: Request, res: Response) => {
    console.log(req.file, req.body)
    let logs = {
        field: "Image Uploaded",
        message: req.file
    }
    res.status(200).json({ logs })
}

const sendMessageTrial =  async(req: Request, res:Response) => {

    console.log(req)
    let logs;
    let _num = '+91'+ req.body.num
    try {
        // Download the helper library from https://www.twilio.com/docs/node/install
        // Set environment variables for your credentials
        // Read more at http://twil.io/secure
        const accountSid = "AC40b97c92dee093371027ad5a964f24ef";
        const authToken = "a8873200268946a99d4189d032698577";
        const client = require("twilio")(accountSid, authToken);
        let status = client.messages.create({ body: "Thanks for otp", from: "+15075167323", to: _num }).then(message => {
            console.log(message.sid)
            return message.sid
        });

        res.status(200).json(status)
        return
        
    } catch (e) {
        res.status(400).json({ e });
        throw e;
    }

}

const checkDistance =  async(req: Request, res:Response) => {
    const policeLat: number = parseFloat(req.body.policeLat)
    const policeLon: number = parseFloat(req.body.policeLon)
    const centerLat: number = parseFloat(req.body.centerLat)
    const centerLon: number = parseFloat(req.body.centerLon)
    const radius: number = parseFloat(req.body.radius)

    let _distance = isNearby(policeLat, policeLon, centerLat, centerLon, radius);
    
    res.status(200).json(_distance)

}

module.exports = {
    uploadImageTrial, sendMessageTrial, checkDistance
}