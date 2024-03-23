const express = require('express');
const router = express.Router();
const userController = require('../Controller/User');
const authenticator = require('../Middleware/auth');

router.post('/signup',userController.postSignup);
router.post('/login',userController.postLogin);
router.get('/profile',authenticator,userController.getProfile);
router.post('/addPatient',authenticator,userController.postPatient);

module.exports = router;