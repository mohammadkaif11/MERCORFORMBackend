const jwt = require('jsonwebtoken');
//Secret Key
const JWT_SECRET = "gfg_jwt_secret_key";

//verfiy UserMiddleware
function VerfifyFetchUser(req,res,next){
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({error: "please authenticate using valid token" });
        return;
    }
    try {
        const verifyuser = jwt.verify(token, JWT_SECRET);
        req.userId = verifyuser.userId;
        next();
    } catch (error) {
        console.log('VerifyFetchUser error: ' + error.message);
        res.status(401).send({ error: "server error while validating user" });
        return;
    }
}

module.exports = VerfifyFetchUser;