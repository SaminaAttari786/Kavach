import { Request, Response } from 'express';
import { PoliceInfo } from '../types/PoliceInfo';
import { LoginInfo } from '../types/LoginInfo';
import Police from '../models/Police';
import { ResponseFormat } from "../resolvers/Format";
import argon2 from "argon2";
import {connection} from "../connection";
import {MongoServerError} from 'mongodb'
import { uploadOnImgur } from '../imgur';
import * as nodemailer from 'nodemailer' 
require('dotenv').config()


const policeRegister = async(req: Request, res: Response) => {

    const db = await connection.getDb();
    let logs;
    const collection = db.collection( 'police' );
    // console.log(req.body)
    try {
        const policeData = req.body as Pick<PoliceInfo, "_id" | "policeName" | "policeNumber" | "policePassword" >

        const hashedPassword = await argon2.hash(policeData.policePassword);
        const _police: PoliceInfo = new Police({
            _id: policeData._id,
            policeName: policeData.policeName,
            policePassword: hashedPassword,
            policeNumber: policeData.policeNumber
        })

        let result;
        try {
            result = await collection.insertOne(_police);
        } catch (err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = [{ 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }]
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }

        console.log(result);
        if(result.acknowledged){
            req.session.authenticationID = (result.insertedId).toString();
            
            logs =  {
                        field: "Successful Sign Up",
                        policeId: result.insertedId,
                        policeName: _police.policeName
                    }

            res.status(200).json(logs);
            return logs;
        } else {
            logs =
                {
                    field: "Mongo Unknown Error Occurred",
                    message: "Better check with administrator",
                }
            
            res.status(400).json({ logs });
            return {logs};
        }
        

    } catch (e) {
        res.status(400).json({ e });
        throw e;
    }
}


const policeLogIn = async(req:Request, res:Response) => {
    
    const db = await connection.getDb();

    // const collection = db.collection( 'test' );
    // console.log(req.body)
    try {
        let result;
        let logs;
        let collection;
        // let emailAttribute;
        const loginEntity = req.body as Pick<LoginInfo, "policeId" | "policePassword">
        collection = db.collection('police');
        
            try {
                result = await collection.findOne({
                    _id: loginEntity.policeId
                });
                console.log(result);
            } catch (err) {
                if (err instanceof MongoServerError && err.code === 11000) {
                    console.error("# Duplicate Data Found:\n", err)
                    logs = [{
                        field: "Entity Missing",
                        message: "That entity doesn't exist",
                    }]
                    res.status(400).json({ logs });
                    return { logs };

                }
                else {
                    res.status(400).json({ err });

                    throw new Error(err)
                }
            }
            const valid = await argon2.verify(result.policePassword, loginEntity.policePassword);
            if (valid) {
                console.log(result);
                req.session.authenticationID = (result._id).toString();
                console.log(req.session.authenticationID)
                logs = 
                    {
                        field: "Successful Log In",
                        policeId: result._id,
                        policeName: result.policeName
                    }
                

                res.status(200).json(logs);
                return { logs };
            } else {
                logs = [
                    {
                        field: "Password",
                        message: "Incorrect password",
                    }
                ]

                res.status(400).json({ logs });
                return { logs };
            }
    } catch (e) {
        res.status(400).json({ e });
        throw e;
    }
}

const me = async (req: Request, res: Response) => {
    // Not logged in
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            }
        
        res.status(400).json({ logs });
        return null;
    }
    logs = 
        {
            field: "Logged in",
            message: req.session.authenticationID,
        }
    
    res.status(200).json({ logs });
    return req.session.authenticationID;
}

const policeLogOut = async (req: Request, res: Response) => {
    let logs;
    try {
        req.session.destroy((err) => {
            res.clearCookie('kavachid');
            // req.session = null;   
            if (err) {
                console.log(err);
                logs =
                    {
                        field: "Error in Clearing Cookie",
                        message: "Please contact the administrator",
                    }
                
                res.status(400).json(logs);
                return;
            }

            logs = 
                {
                    field: "Successful Logout",
                    message: "Logged out",
                }
            
            res.status(200).json(logs);
            return;

        })
    } catch (e) {
        console.log(e);
        logs =
            {
                field: "Error in Clearing Cookie",
                message: "Please contact the administrator",
            }
        
        res.status(400).json(logs);
        throw e;
    }
}

// const policeChangePassword = async(req:Request, res:Response) => {
//     let logs;
//     if (!req.session.authenticationID) {
//         logs = [
//             {
//                 field: "Not logged in",
//                 message: "Please log in",
//             }
//         ]
//         res.status(400).json({ logs });
//         return null;
//     }
//     const db = await connection.getDb();
//     let collection;
//         try {
    
//             const studentId = req.session.authenticationID;
//             const studentPassword = req.body.studentPassword
//             collection = db.collection( 'student' );
    
//             let _student;
//             try {
//                 _student = await collection.findOne({ _id: studentId })
//                 if (_student === null){
//                     logs = [
//                         {
//                             field: "Student Not Found",
//                             message: "Student never signed up before",
//                         }
//                     ]
                
//                     res.status(400).json({ logs });
//                     return {logs}; 
//                 }
//             } catch (err) {
//                 if (err instanceof MongoServerError && err.code === 11000) {
//                     console.error("# Duplicate Data Found:\n", err)
//                     logs = [{ 
//                         field: "Unexpected Mongo Error",
//                         message: "Default Message"
//                     }]
//                     res.status(400).json({ logs });
//                     return {logs};
                    
//                 }
//                 else {
//                     res.status(400).json({ err });
                    
//                     throw new Error(err)
//                 }
//             }
//             const hashedPassword = await argon2.hash(studentPassword);
//             let updatedPassword = await collection.updateOne(
//                 { _id:  studentId },
//                 { $set: { studentPassword: hashedPassword, studentBalance: 0 }}
//             )
//             if(updatedPassword.acknowledged){
//                 logs = [
//                     {
//                         field: "Successful Updation",
//                         message: "Password changed of user " + studentId,
//                     }
//                 ]

//                 res.status(200).json({ logs });
//                 return { logs };
//             } else {
//                 logs = [
//                     {
//                         field: "Mongo Error",
//                         message: "Password change failed",
//                     }
//                 ]

//                 res.status(400).json({ logs });
//                 return { logs };
//             }

//         } catch (e) {
//             res.status(400).json({ e });
//             throw e;
//         }
// }

module.exports = {
    policeRegister, policeLogIn, policeLogOut, me
}