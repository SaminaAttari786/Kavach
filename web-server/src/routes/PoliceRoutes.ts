import express from 'express';
import { uploadCertificate } from '../multer'
const { policeRegister, policeLogIn, policeLogOut, me } = require('../controllers/PoliceController')

const router = express.Router();

router.post('/police/register', policeRegister)
router.post('/police/login', policeLogIn)
router.get('/police/me', me)
router.get('/police/logout', policeLogOut)


module.exports = router;