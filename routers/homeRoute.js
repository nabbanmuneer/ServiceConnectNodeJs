const express = require("express");
const router = express.Router();
const homeControllers = require('../controllers/homeController');

router.post('/signUp',homeControllers.signUp);
router.post('/otpRegister',homeControllers.otpValidation);
router.get('/otpResent',homeControllers.otpResent)
router.post('/signIn',homeControllers.signIn)

module.exports = router;