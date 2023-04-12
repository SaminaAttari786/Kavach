import express from 'express';
import { uploadImage } from '../multer'

const { uploadImageTrial, sendMessageTrial, checkDistance } = require('../controllers/AdminController')

const router = express.Router();

router.post('/sendMessage', sendMessageTrial)
router.post('/checkDistance', checkDistance)
router.post('/uploadimage', uploadImage.single('file'), uploadImageTrial);

module.exports = router;