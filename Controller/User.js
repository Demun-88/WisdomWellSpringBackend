const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId, BSON } = require('mongodb');

exports.postSignup = (req,res,next) => {
    const userName = req.body.signupName;
    const email = req.body.signupEmail;
    const password = req.body.signupPassword;
    const userId = req.body.signupId;
    const userCentre = req.body.signupCentre;
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
    res.json({
        message:"working"
    })
}