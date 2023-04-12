"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../multer");
const { uploadImageTrial, sendMessageTrial, checkDistance } = require('../controllers/AdminController');
const router = express_1.default.Router();
router.post('/sendMessage', sendMessageTrial);
router.post('/checkDistance', checkDistance);
router.post('/uploadimage', multer_1.uploadImage.single('file'), uploadImageTrial);
module.exports = router;
//# sourceMappingURL=AdminRoutes.js.map