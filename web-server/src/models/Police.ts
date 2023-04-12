import { PoliceInfo } from "../types/PoliceInfo";
import { model, Schema } from "mongoose";

const PoliceSchema: Schema = new Schema({
    _id: {
        type: String,
        required: false
    },

    policeName: {
        type: String,
        required: true
    },

    policeNumber:  {
        type: String,
        required: true
    },

    policePassword:  {
        type: String,
        required: true
    },

}, {timestamps: true})

export default model<PoliceInfo>("Police", PoliceSchema);