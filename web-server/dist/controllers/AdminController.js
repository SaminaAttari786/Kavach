"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const mongodb_1 = require("mongodb");
const imgur_1 = require("../imgur");
const DateFormat_1 = require("../utils/DateFormat");
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const uploadImageTrial = async (req, res) => {
    console.log(req.file, req.body);
    let logs = {
        field: "Image Uploaded",
        message: req.file
    };
    res.status(200).json({ logs });
};
const adminSetEvent = async (req, res) => {
    let logs;
    console.log(req.body);
    const eventData = req.body;
    const _filename = req.file.filename;
    try {
        let _link = await (0, imgur_1.uploadOnImgur)(_filename);
        eventData.eventFile = _link;
        eventData.eventDate = (0, DateFormat_1.formatDate)((new Date()).toISOString());
    }
    catch (err) {
        logs = {
            field: "Imgur Error",
            message: "Better check with administrator"
        };
        res.status(400).json(logs);
        return;
    }
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('event');
        let _admin_post;
        try {
            _admin_post = await collection.insertOne(eventData);
            logs = {
                field: "Event Posted",
                eventName: eventData.eventName,
                eventDescription: eventData.eventDescription,
                eventVenue: eventData.eventVenue,
                eventDate: eventData.eventDate,
                eventStartTime: eventData.eventStartTime,
                eventEndTime: eventData.eventEndTime,
                eventCommittee: eventData.eventCommittee,
                eventContact: eventData.eventContact,
                eventFile: eventData.eventFile,
            };
            return res.status(200).json({ logs });
        }
        catch (e) {
            logs = {
                field: "Insertion Error",
                message: e
            };
            return res.status(400).json({ logs });
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const adminGetEvent = async (req, res) => {
    console.log(req);
    console.log("Inside Admin GET controller");
    let allevents;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allevents = await db.collection('event').find({}).toArray();
            res.status(200).json({ allevents });
            console.log(allevents);
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {
        console.log(e);
    }
};
const adminSetAdvertisement = async (req, res) => {
    let logs;
    console.log(req.body);
    const advertisementData = req.body;
    const _filename = req.file.filename;
    try {
        let _link = await (0, imgur_1.uploadOnImgur)(_filename);
        advertisementData.advertisementImageLink = _link;
        advertisementData.advertisementExpires = (0, DateFormat_1.formatDate)((0, DateFormat_1.addWeeksToDate)(new Date(), 2).toISOString());
    }
    catch (err) {
        logs = {
            field: "Imgur Error",
            message: "Better check with administrator"
        };
        res.status(400).json(logs);
        return;
    }
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('global');
        await collection.updateOne({ _id: 'total_money_left' }, { $inc: { value: parseFloat(advertisementData.advertisementAmount) } });
        await collection.updateOne({ _id: 'total_investment' }, { $inc: { value: parseFloat(advertisementData.advertisementAmount) } });
        collection = db.collection('advertisement');
        let _admin_post;
        try {
            _admin_post = await collection.insertOne(advertisementData);
            logs = {
                field: "Advertisement Posted on Database",
                advertisementName: advertisementData.advertisementName,
                advertisementDescription: advertisementData.advertisementDescription,
                advertisementExpires: advertisementData.advertisementExpires,
                advertisementImageLink: advertisementData.advertisementImageLink,
            };
            return res.status(200).json({ logs });
        }
        catch (e) {
            logs = {
                field: "Advertisement Insertion Error",
                message: e
            };
            return res.status(400).json({ logs });
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const adminGetStudentApplications = async (req, res) => {
    console.log(req);
    let allStudentApplications;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allStudentApplications = await db.collection('student_application').find({}).toArray();
            res.status(200).json(allStudentApplications);
            console.log(allStudentApplications);
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {
        console.log(e);
    }
};
const updateStudentApplication = async (req, res) => {
    let logs;
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        console.log(req.body);
        const studentApplicationId = req.body.id;
        const studentApplicationStatus = req.body.studentApplicationStatus;
        const studentApplicationIssuedCoins = +req.body.studentApplicationIssuedCoins;
        collection = db.collection('student_application');
        let _student_application;
        try {
            _student_application = await collection.findOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) });
            console.log(_student_application);
            if (_student_application === null) {
                logs = {
                    field: "Student Application Not Found",
                    message: "Student Application Not Found ",
                };
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
                return;
            }
        }
        let result = await collection.updateOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) }, { $set: { studentApplicationStatus: studentApplicationStatus, studentApplicationIssuedCoins: studentApplicationIssuedCoins } });
        if (result.acknowledged) {
            logs = {
                field: "Student Application Updated",
                message: studentApplicationId
            };
            let studentCollegeId = _student_application.studentApplicationCollegeId;
            collection = db.collection('student');
            let _student = await collection.updateOne({ _id: studentCollegeId }, { $inc: { studentBalance: studentApplicationIssuedCoins } });
            collection = db.collection('transaction');
            let _transaction = new Transaction({
                to: studentCollegeId,
                from: "admin",
                amount: studentApplicationIssuedCoins,
                timestamp: (new Date()).toISOString()
            });
            let _transactionAdded = await collection.insertOne(_transaction);
            if (_student.acknowledged && _transactionAdded.acknowledged) {
                logs = {
                    field: "Successful Admin Transaction",
                    message: _transactionAdded.insertedId
                };
                collection = db.collection('global');
                await collection.updateOne({ _id: 'total_supply' }, { $inc: { value: studentApplicationIssuedCoins } });
                await collection.updateOne({ _id: 'total_in_circulation' }, { $inc: { value: studentApplicationIssuedCoins } });
                res.status(200).json(logs);
                return;
            }
            else if (_student.acknowledged && !_transactionAdded.acknowledged) {
                logs = {
                    field: "Failed Admin Transaction",
                    message: _student.insertedId
                };
                collection = db.collection('student');
                await collection.updateOne({ _id: studentCollegeId }, { $inc: { studentBalance: (-1 * studentApplicationIssuedCoins) } });
                collection = db.collection('student_application');
                await collection.updateOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) }, { $set: { studentApplicationStatus: 'Pending', studentApplicationIssuedCoins: 0 } });
                res.status(400).json(logs);
                return;
            }
            else if (!_student.acknowledged && _transactionAdded.acknowledged) {
                logs = {
                    field: "Failed Admin Transaction",
                    message: _transactionAdded.insertedId
                };
                collection = db.collection('transaction');
                await collection.deleteOne({ _id: _transactionAdded.insertedId });
                collection = db.collection('student_application');
                await collection.updateOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) }, { $set: { studentApplicationStatus: 'Pending', studentApplicationIssuedCoins: 0 } });
                res.status(400).json(logs);
                return;
            }
            else {
                logs = {
                    field: "Failed Admin Transaction",
                    message: result.insertedId
                };
                await collection.updateOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) }, { $set: { studentApplicationStatus: 'Pending', studentApplicationIssuedCoins: 0 } });
                res.status(400).json(logs);
                return;
            }
        }
        else {
            logs = {
                field: "Student Updation Error",
                message: "Error while Updating Student Application"
            };
            res.status(400).json(logs);
        }
    }
    catch (e) {
        res.status(400).json({ message: e });
        throw e;
    }
};
const getStudents = async (req, res) => {
    let students;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            students = await db.collection('student').find({}).toArray();
            res.status(200).json({ students });
            console.log(students);
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {
        console.log(e);
    }
};
const getSupplyRedeemed = async (req, res) => {
    console.log(req);
    console.log("Inside Admin GetSupplyRedeemed ");
    let supply;
    let redeemed;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            supply = await db.collection('global').findOne({ _id: "total_supply" });
        }
        catch (e) {
            console.log(e);
        }
        try {
            redeemed = await db.collection('global').findOne({ _id: "total_redeemed" });
        }
        catch (e) {
            console.log(e);
        }
        res.status(200).json({ supply, redeemed });
    }
    catch (e) {
        console.log(e);
    }
};
const flushCanteen = async (req, res) => {
    console.log(req);
    let logs;
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('rewarder');
        let _canteen = await collection.findOne({ _id: 'canteen' });
        let _flushed = await collection.updateOne({ _id: 'canteen' }, { $set: { balance: 0 } });
        collection = db.collection('global');
        let conversion_rate = await collection.findOne({ _id: 'conversion_rate' });
        let _expenditure = await collection.updateOne({ _id: 'total_expenditure' }, { $inc: { value: (parseFloat(conversion_rate.value) * parseFloat(_canteen.balance)) } });
        if (_flushed.acknowledged && _expenditure.acknowledged) {
            logs = {
                field: "Successful Canteen Flush",
                message: "Canteen Balance FLushed and INR deducted"
            };
            await collection.updateOne({ _id: 'total_money_left' }, { $inc: { value: (-1 * parseFloat(conversion_rate.value) * parseFloat(_canteen.balance)) } });
            res.status(200).json({ logs });
            return;
        }
        else if (!_flushed.acknowledged && _expenditure.acknowledged) {
            collection = db.collection('global');
            await collection.updateOne({ _id: 'total_expenditure' }, { $inc: { value: (-1 * parseFloat(conversion_rate.value) * parseFloat(_canteen.balance)) } });
            logs = {
                field: "Failed Canteen Flush",
                message: "Could not flush canteen balance"
            };
            res.status(400).json(logs);
        }
        else if (_flushed.acknowledged && !_expenditure.acknowledged) {
            collection = db.collection('rewarder');
            await collection.updateOne({ _id: 'canteen' }, { $set: { value: _canteen.balance } });
            logs = {
                field: "Failed Canteen Flush",
                message: "Could not modify expenditure INR"
            };
            res.status(400).json(logs);
        }
        else {
            logs = {
                field: "Failed Canteen Flush",
                message: "Could not flush canteen balance & Could not modify expenditure INR"
            };
            res.status(400).json(logs);
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const flushStationery = async (req, res) => {
    console.log(req);
    let logs;
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('rewarder');
        let _stationery = await collection.findOne({ _id: 'stationery' });
        let _flushed = await collection.updateOne({ _id: 'stationery' }, { $set: { balance: 0 } });
        collection = db.collection('global');
        let conversion_rate = await collection.findOne({ _id: 'conversion_rate' });
        let _expenditure = await collection.updateOne({ _id: 'total_expenditure' }, { $inc: { value: (parseFloat(conversion_rate.value) * parseFloat(_stationery.balance)) } });
        if (_flushed.acknowledged && _expenditure.acknowledged) {
            logs = {
                field: "Successful stationery Flush",
                message: "stationery Balance FLushed and INR deducted"
            };
            await collection.updateOne({ _id: 'total_money_left' }, { $inc: { value: (-1 * parseFloat(conversion_rate.value) * parseFloat(_stationery.balance)) } });
            res.status(200).json({ logs });
            return;
        }
        else if (!_flushed.acknowledged && _expenditure.acknowledged) {
            collection = db.collection('global');
            await collection.updateOne({ _id: 'total_expenditure' }, { $inc: { value: (-1 * parseFloat(conversion_rate.value) * parseFloat(_stationery.balance)) } });
            logs = {
                field: "Failed stationery Flush",
                message: "Could not flush stationery balance"
            };
            res.status(400).json(logs);
        }
        else if (_flushed.acknowledged && !_expenditure.acknowledged) {
            collection = db.collection('rewarder');
            await collection.updateOne({ _id: 'stationery' }, { $set: { value: _stationery.balance } });
            logs = {
                field: "Failed stationery Flush",
                message: "Could not modify expenditure INR"
            };
            res.status(400).json(logs);
        }
        else {
            logs = {
                field: "Failed stationery Flush",
                message: "Could not flush stationery balance & Could not modify expenditure INR"
            };
            res.status(400).json(logs);
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const getRewarderBalance = async (req, res) => {
    console.log(req);
    let logs;
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('rewarder');
        let _canteen = await collection.findOne({ _id: 'canteen' });
        let _canteenBalance = _canteen.balance;
        let _stationery = await collection.findOne({ _id: 'stationery' });
        let _stationeryBalance = _stationery.balance;
        res.status(200).json({ _canteenBalance, _stationeryBalance });
        return;
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
module.exports = {
    adminSetEvent, adminGetEvent, uploadImageTrial, adminSetAdvertisement, adminGetStudentApplications, updateStudentApplication, getStudents, getSupplyRedeemed, flushCanteen, flushStationery, getRewarderBalance
};
//# sourceMappingURL=AdminController.js.map