const jwt = require('jsonwebtoken');
const authenticator = (req,res,next) => {
    const token = req.cookies.jwtToken;
    if(!token) {
        req.isAuth = false;
        next();
    }
    
    let decodedToken;
    try {
        decodedToken = jwt.verify(token,process.env._SECRET);
    }
    catch(err) {
        next(err);
    }
    if(!decodedToken) {
        req.isAuth = false;
        next();
    }
    req.isAuth = true;
    req.id = decodedToken.id;
    next();
}

module.exports = authenticator;