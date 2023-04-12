"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Police_1 = __importDefault(require("../models/Police"));
const argon2_1 = __importDefault(require("argon2"));
const connection_1 = require("../connection");
const mongodb_1 = require("mongodb");
require('dotenv').config();
const policeRegister = async (req, res) => {
    const db = await connection_1.connection.getDb();
    let logs;
    const collection = db.collection('police');
    try {
        const policeData = req.body;
        const hashedPassword = await argon2_1.default.hash(policeData.policePassword);
        const _police = new Police_1.default({
            _id: policeData._id,
            policeName: policeData.policeName,
            policePassword: hashedPassword,
            policeNumber: policeData.policeNumber
        });
        let result;
        try {
            result = await collection.insertOne(_police);
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = [{
                        field: "Unexpected Mongo Error",
                        message: "Default Message"
                    }];
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        console.log(result);
        if (result.acknowledged) {
            req.session.authenticationID = (result.insertedId).toString();
            logs = {
                field: "Successful Sign Up",
                policeId: result.insertedId,
                policeName: _police.policeName
            };
            res.status(200).json(logs);
            return logs;
        }
        else {
            logs =
                {
                    field: "Mongo Unknown Error Occurred",
                    message: "Better check with administrator",
                };
            res.status(400).json({ logs });
            return { logs };
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const policeLogIn = async (req, res) => {
    const db = await connection_1.connection.getDb();
    try {
        let result;
        let logs;
        let collection;
        const loginEntity = req.body;
        collection = db.collection('police');
        try {
            result = await collection.findOne({
                _id: loginEntity.policeId
            });
            console.log(result);
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = [{
                        field: "Entity Missing",
                        message: "That entity doesn't exist",
                    }];
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        const valid = await argon2_1.default.verify(result.policePassword, loginEntity.policePassword);
        if (valid) {
            console.log(result);
            req.session.authenticationID = (result._id).toString();
            console.log(req.session.authenticationID);
            logs =
                {
                    field: "Successful Log In",
                    policeId: result._id,
                    policeName: result.policeName
                };
            res.status(200).json(logs);
            return { logs };
        }
        else {
            logs = [
                {
                    field: "Password",
                    message: "Incorrect password",
                }
            ];
            res.status(400).json({ logs });
            return { logs };
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const me = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            };
        res.status(400).json({ logs });
        return null;
    }
    logs =
        {
            field: "Logged in",
            message: req.session.authenticationID,
        };
    res.status(200).json({ logs });
    return req.session.authenticationID;
};
const policeLogOut = async (req, res) => {
    let logs;
    try {
        req.session.destroy((err) => {
            res.clearCookie('kavachid');
            if (err) {
                console.log(err);
                logs =
                    {
                        field: "Error in Clearing Cookie",
                        message: "Please contact the administrator",
                    };
                res.status(400).json(logs);
                return;
            }
            logs =
                {
                    field: "Successful Logout",
                    message: "Logged out",
                };
            res.status(200).json(logs);
            return;
        });
    }
    catch (e) {
        console.log(e);
        logs =
            {
                field: "Error in Clearing Cookie",
                message: "Please contact the administrator",
            };
        res.status(400).json(logs);
        throw e;
    }
};
module.exports = {
    policeRegister, policeLogIn, policeLogOut, me
};
//# sourceMappingURL=PoliceController.js.map