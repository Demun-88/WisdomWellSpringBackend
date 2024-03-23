const express = require('express');
const router = express.Router();
const userController = require('../Controller/User');
const authenticator = require('../Middleware/auth');
const { body } = require('express-validator');

router.post('/signup',[
    body('signupEmail').isEmail(),
    body('signupPassword').isAlphanumeric().isLength({min:8}),
],userController.postSignup);
router.post('/login',[
    body('loginemail').isEmail(),
    body('loginpassword').isAlphanumeric().isLength({min:8}),
],userController.postLogin);
router.post('/logout',authenticator,userController.postLogout);
router.get('/profile',authenticator,userController.getProfile);
router.post('/addPatient',authenticator,userController.postPatient);
router.get('/getPatient',authenticator,userController.getPatient);
router.post('/addMedicine',authenticator,userController.postMedicine);



module.exports = router;