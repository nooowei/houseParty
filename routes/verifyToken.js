let jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send('Access Denied');
    }else{
        try{
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            console.log(req.user);
            next();
        }catch(err){
            return res.status(400).send('Invalid Token');
        }
       
    }
}

