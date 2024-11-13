const express = require("express");
const homeControllers = require('../controllers/homeController');
const authenticate = require('../middlewares/authMiddleware.js')
const router = express.Router();

router.get('/auth/google', homeControllers.passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', homeControllers.passport.authenticate('google', { failureRedirect: '/' }),
    homeControllers.googleCallback 
);
router.post('/auth/refresh',homeControllers.refreshToken); 
// router.post('/signUp',homeControllers.signUp);
// router.post('/otpRegister',homeControllers.otpValidation);
// router.get('/otpResent',homeControllers.otpResent)
// router.post('/signIn',homeControllers.signIn)



module.exports = router;