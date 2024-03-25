require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoute = require('./Routes/User');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','https://mellow-zuccutto-8e1e18.netlify.app');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, OPTIONS,PUT');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Origin,X-Requested-With,Authorization,*');
    res.setHeader('Access-Control-Allow-Credentials','true');
    next();
})

app.use('/user',userRoute);

app.use((err,req,res,next) => {
    const message = err.message || "Server side error";
    const statusCode = err.statusCode || 500;
    res.json({
        message:message,
    })
})

mongoose.connect(process.env._MONGOURL)
.then(() => {
    app.listen(process.env.PORT || 8080, () => console.log('Server is running'));
})
.catch(err => {
    console.log(err);
})