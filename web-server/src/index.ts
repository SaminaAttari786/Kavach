import "reflect-metadata";
import express from "express";
import session from "express-session";
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import cors from "cors";
import { connection } from "./connection";
const fileUpload = require('express-fileupload');
require('dotenv').config()

declare module 'express-session' {
    interface SessionData {
            authenticationID: string
    }
}

const main = async () => {
    const PORT= process.env.PORT || 5000;


    await connection.connectToServer(async function( err:any, client:any ) {
        if (err) console.log(err);
        console.log("Database Connected");
    });
    
    
    const MongoDBStore = connectMongoDBSession(session);
    const sessionStore = new MongoDBStore({
        uri: process.env.DATABASE_URL || 'mongodb+srv://kavach:kavach@cluster0.bbsjscs.mongodb.net/kavach-database?retryWrites=true&w=majority',
        collection: 'session'
    });

    sessionStore.on('error', function(error){
        console.log(error);
    })

    const app = express();
    app.set("trust proxy", true); // Enabling trust proxy for last / rightmost value

    app.use(
        cors({
            origin: '*',
            credentials: true,
            methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
        })
    );

    app.use(session(
        {
            name: 'kavachid',
            secret: 'VVSAM',
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: 'lax',
                // secure: false,
                // domain: "http://localhost:3000/",
            },
            store: sessionStore,
            unset: 'destroy',
            saveUninitialized: false,
            resave: false,
        }
    ));

    app.use(express.json());
    app.use(require('./routes/PoliceRoutes'));
    app.use(require('./routes/QRRoutes'));
    app.use(require('./routes/AdminRoutes'));
    app.use(fileUpload());

    app.get("/healthz", (_, res) => {
        res.send("Health Checkup");
    })


    app.listen(PORT, () => {
        console.log("Server started on localhost:", PORT)
    });

};

main().catch((err) => {
    console.error(err);
});