"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PoliceSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: false
    },
    policeName: {
        type: String,
        required: true
    },
    policeNumber: {
        type: String,
        required: true
    },
    policePassword: {
        type: String,
        required: true
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Police", PoliceSchema);
//# sourceMappingURL=Police.js.map