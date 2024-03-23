const express = require('express');
const router = express.Router();
const userController = require('../Controller/User')

router.post('/signup',userController.postSignup);
router.post('/login',userController.postLogin);

module.exports = router;