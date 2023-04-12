"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { policeRegister, policeLogIn, policeLogOut, me } = require('../controllers/PoliceController');
const router = express_1.default.Router();
router.post('/police/register', policeRegister);
router.post('/police/login', policeLogIn);
router.get('/police/me', me);
router.get('/police/logout', policeLogOut);
module.exports = router;
//# sourceMappingURL=PoliceRoutes.js.map