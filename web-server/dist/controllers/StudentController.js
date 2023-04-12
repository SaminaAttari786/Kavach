"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const connection_1 = require("../connection");
const mongodb_1 = require("mongodb");
require('dotenv').config();
const policeRegister = async (req, res) => {
    const db = await connection_1.connection.getDb();
    const collection = db.collection('police');
    try {
        const policeData = req.body;
        console.log(agentData);
        let credentials = new CredentialsInput();
        credentials.email = agentData.agentEmail;
        credentials.username = agentData.agentName;
        credentials.password = agentData.agentPassword;
        let logs = validation(credentials);
        if (logs) {
            res.status(400).json({ logs });
            return { logs };
        }
        const hashedPassword = await argon2_1.default.hash(credentials.password);
        const _agent = new Agent({
            agentName: agentData.agentName,
            agentEmail: agentData.agentEmail,
            agentPassword: hashedPassword,
            agentAge: agentData.agentAge,
            agentMobile: agentData.agentMobile,
            agentCity: agentData.agentCity,
            agentState: agentData.agentState,
            agentPincode: agentData.agentPincode,
            agentAddress: agentData.agentAddress,
            agentLatitude: '',
            agentLongitude: ''
        });
        let geoLocationResponse;
        var API_KEY = process.env.LOCATIONIQ_API_KEY;
        var BASE_URL = "https://us1.locationiq.com/v1/search?format=json&limit=1";
        let address = _agent.agentAddress + ' ' + _agent.agentPincode;
        var url = BASE_URL + "&key=" + API_KEY + "&q=" + address;
        let config = {
            method: 'get',
            url: url,
            headers: {}
        };
        await axios(config).then(function (response) {
            console.log(response.data[0]);
            geoLocationResponse = response.data[0];
        }).catch(function (error) {
            console.log(error);
            geoLocationResponse = null;
        });
        if (geoLocationResponse === null) {
            logs = [
                {
                    field: "LocationIQ Error",
                    message: "Better check with administrator",
                }
            ];
            res.status(400).json({ logs });
            return;
        }
        else {
            console.log(geoLocationResponse);
            console.log(typeof geoLocationResponse);
            _agent.agentLatitude = geoLocationResponse.lat * 1;
            _agent.agentLongitude = geoLocationResponse.lon * 1;
        }
        let result;
        try {
            result = await collection.insertOne(_agent);
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
            console.log(result);
            let validationContract = new (web3.getWeb3()).eth.Contract(ValidationABI.abi, process.env.VALIDATION_ADDRESS, {});
            validationContract.methods.addAgent(result.insertedId.toString()).send({ from: process.env.OWNER_ADDRESS, gasPrice: '3000000' })
                .then(function (blockchain_result) {
                console.log(blockchain_result);
            }).catch((err) => {
                console.log(err);
                logs = [
                    {
                        field: "Blockchain Error",
                        message: err,
                    }
                ];
                res.status(400).json({ logs });
                return { logs };
            });
            logs = [
                {
                    field: "Successful Insertion",
                    message: "Done",
                }
            ];
            res.status(200).json({ logs });
            return { logs };
        }
        else {
            logs = [
                {
                    field: "Unknown Error Occurred",
                    message: "Better check with administrator",
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
const studentLogIn = async (req, res) => {
    console.log(req);
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        let logs;
        const studentId = req.body.studentId;
        const studentPassword = req.body.studentPassword;
        collection = db.collection('student');
        let _student;
        try {
            _student = await collection.findOne({ _id: studentId });
            if (_student === null) {
                logs = [
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    }
                ];
                res.status(400).json({ logs });
                return { logs };
            }
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
        if (_student.studentPassword.startsWith("$argon")) {
            const valid = await argon2_1.default.verify(_student.studentPassword, studentPassword);
            if (valid) {
                collection = db.collection('it_cs_students');
                let _studentDetails = await collection.findOne({ _id: studentId });
                req.session.authenticationID = (_student._id).toString();
                logs =
                    {
                        field: "Normal Login",
                        _id: _studentDetails._id,
                        studentName: _studentDetails.studentName,
                        studentMailId: _studentDetails.studentMailId,
                        studentCollegeId: _studentDetails.studentCollegeId,
                        studentContactNumber: _studentDetails.studentContactNumber,
                        studentBalance: _student.studentBalance
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
        else {
            const valid = (_student.studentPassword === studentPassword);
            if (valid) {
                collection = db.collection('it_cs_students');
                let _studentDetails = await collection.findOne({ _id: studentId });
                req.session.authenticationID = (_student._id).toString();
                logs =
                    {
                        field: "First Login",
                        _id: _studentDetails._id,
                        studentName: _studentDetails.studentName,
                        studentMailId: _studentDetails.studentMailId,
                        studentCollegeId: _studentDetails.studentCollegeId,
                        studentContactNumber: _studentDetails.studentContactNumber,
                        studentBalance: _student.studentBalance
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
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const me = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs = [
            {
                field: "Not logged in",
                message: "Please log in",
            }
        ];
        res.status(400).json({ logs });
        return null;
    }
    logs = [
        {
            field: "Logged in",
            message: req.session.authenticationID,
        }
    ];
    res.status(200).json({ logs });
    return req.session.authenticationID;
};
const studentLogOut = async (req, res) => {
    let logs;
    try {
        req.session.destroy((err) => {
            res.clearCookie('vgcid');
            if (err) {
                console.log(err);
                logs = [
                    {
                        field: "Error in Clearing Cookie",
                        message: "Please contact the administrator",
                    }
                ];
                res.status(400).json({ logs });
                return;
            }
            logs = [
                {
                    field: "Successful Logout",
                    message: "Logged out",
                }
            ];
            res.status(200).json({ logs });
            return;
        });
    }
    catch (e) {
        console.log(e);
        logs = [
            {
                field: "Error in Clearing Cookie",
                message: "Please contact the administrator",
            }
        ];
        res.status(400).json({ logs });
        throw e;
    }
};
const studentChangePassword = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs = [
            {
                field: "Not logged in",
                message: "Please log in",
            }
        ];
        res.status(400).json({ logs });
        return null;
    }
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        const studentId = req.session.authenticationID;
        const studentPassword = req.body.studentPassword;
        collection = db.collection('student');
        let _student;
        try {
            _student = await collection.findOne({ _id: studentId });
            if (_student === null) {
                logs = [
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    }
                ];
                res.status(400).json({ logs });
                return { logs };
            }
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
        const hashedPassword = await argon2_1.default.hash(studentPassword);
        let updatedPassword = await collection.updateOne({ _id: studentId }, { $set: { studentPassword: hashedPassword, studentBalance: 0 } });
        if (updatedPassword.acknowledged) {
            logs = [
                {
                    field: "Successful Updation",
                    message: "Password changed of user " + studentId,
                }
            ];
            res.status(200).json({ logs });
            return { logs };
        }
        else {
            logs = [
                {
                    field: "Mongo Error",
                    message: "Password change failed",
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
module.exports = {
    studentSignUp, studentLogIn, studentLogOut, me, studentChangePassword
};
//# sourceMappingURL=StudentController.js.map