const User = require('../Models/User');
const Patient = require('../Models/Patient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId, BSON } = require('mongodb');
const { validationResult } = require('express-validator');

exports.postSignup = (req,res,next) => {
    const validationError = validationResult(req);
    if(!validationError.isEmpty()){
        const error = new Error("Validation error");
        error.statusCode = 403;
        throw error;
    }
    console.log(req.body);
    const userName = req.body.signupName;
    const email = req.body.signupEmail;
    const password = req.body.signupPassword;
    const userId = req.body.signupId;
    const userCentre = req.body.signupCentre;
    const confirmPass = req.body.signupCpassword;
    if(confirmPass !== password){
        const error = new Error("Validation error");
        error.statusCode = 403;
        throw error;
    }
    User.findOne({email: email})
    .then(user => {
        if(user) {
            const error = new Error('User already exists') ;
            error.statusCode = 401;
            throw error;
        }
        return bcrypt.hash(password,12);
    })
    .then(hashedPassword => {
        const newUser = new User({
            name:userName,
            email:email,
            password:hashedPassword,
            userId:userId,
            userCentre:userCentre
        })
        return newUser.save();
    })
    .then(sUser => {
        const token = jwt.sign({
            email:sUser.email,
            id:sUser._id.toString()
        },process.env._SECRET,{
            expiresIn:'1h'
        });
        res.cookie('jwtToken',token,{
            secure:true,
            httpOnly:true,
            maxAge:60*60*1000,
            sameSite:true
        });
        res.status(200).json({
            isLoggedIn:true,
            email:sUser.email,
            name:sUser.name,
            userId:sUser.userId,
            userCentre:sUser.userCentre
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
    
}

exports.postLogin = (req,res,next) => {
    const validationError = validationResult(req);
    if(!validationError.isEmpty()){
        const error = new Error("Validation error");
        error.statusCode = 403;
        throw error;
    }
    const email = req.body.loginemail;
    const password = req.body.loginpassword;
    let currUser;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            const error = new Error('User does not exists') ;
            error.statusCode = 401;
            throw error;
        }
        currUser = user;
        return bcrypt.compare(password,user.password);
    })
    .then(isEqual => {
        if(!isEqual) {
            const error = new Error('Authorization failed') ;
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email:currUser.email,
            id:currUser._id.toString()
        },process.env._SECRET,{
            expiresIn:'1h'
        });
        res.cookie('jwtToken',token,{
            secure:true,
            httpOnly:true,
            maxAge:60*60*1000,
            sameSite:true
        });
        res.status(200).json({
            isLoggedIn:true,
            email:currUser.email,
            name:currUser.name,
            userId:currUser.userId,
            userCentre:currUser.userCentre
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.getLogout = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authorization Failed");
        error.statusCode = 401;
        throw error;
    }
    res.clearCookie("jwtToken");
    res.status(200).json({
        message:"Logout successfully"
    })
}

exports.getProfile = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authorization Failed");
        error.statusCode = 401;
        throw error;
    }
    const userId = new ObjectId(req.id);
    User.findById(userId)
    .then(currUser => {
        if(!currUser){
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({
            email:currUser.email,
            name:currUser.name,
            userId:currUser.userId,
            userCentre:currUser.userCentre
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    })
}

exports.postPatient = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authorization Failed");
        error.statusCode = 401;
        throw error;
    }
    const name = req.body.patientName;
    const gender = req.body.patientGender;
    const age = req.body.patientAge;
    const phoneNo = req.body.patientNumber;
    const patient = new Patient({
        name: name,
        gender: gender,
        age: age,
        phoneNo: phoneNo
    });
    patient.save()
    .then(savedPatient => {
        if(!savedPatient) {
            const error = new Error('Error saving patient');
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({
            patientId:savedPatient._id.toString(),
            patientName: savedPatient.name,
            patientGender: savedPatient.gender,
            patientAge: savedPatient.age,
            patientNumber: savedPatient.phoneNo
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    })
}

exports.getPatient = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authorization Failed");
        error.statusCode = 401;
        throw error;
    }
    Patient.find()
    .then(patients => {
        res.status(200).json({
            patients:patients
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    })
}

exports.postMedicine = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authorization Failed");
        error.statusCode = 401;
        throw error;
    }
    console.log(req.body);
    res.json({
        message:"working"
    })
}