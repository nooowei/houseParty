let express = require('express');
let router = express.Router();
let Household = require('../models/household.model');
let User = require('../models/user.model');

let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let auth = require('./verifyToken');

router.get('/', function(req, res, next){
    let id = req.body.id;
    User.findById(id).then(user => {
        if(user){
            return res.json(user);
        }else{
            console.log("Couldn't find user with that id.");
            return res.json({msg:"Couldn't find user with that id."});
        }
    })
});



router.post('/register', function(req, res, next){
    let { email, username, password } = req.body;
    // console.log(email, username, password);

    // check if email has already been used
    User.findOne({email}).then(user => {
        if(user){
            console.log("Email already registered.");
            return res.json({msg:"Email already registered."});
        }
    })

    // check if username has been taken
    User.findOne({username}).then(user => {
        if(user){
            console.log("Username already registered.");
            return res.json({msg:"Username already taken."});
        }else{
            // encrypting password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    let password = hash;
                    console.log(password);

                    let newUser = new User({
                        username,
                        email,
                        password
                    });

                    //save to db
                    newUser.save().then(() => {
                        console.log(`New user ${username} registered successfully.`);
                        // jwt send token
                        let token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET, { expiresIn: 100000});
                        res.header('auth-token', token).send(token);




                        return res.json({msg:`New user ${username} registered successfully.`});
                    }).catch(err => console.log(err));

                });
            });
        }
    })
    
})



router.post('/login', function(req, res, next){
    let { email, password } = req.body;

    User.findOne({email}).then(user => {
        if(user){
            // sub for bcrypt when using it
            bcrypt.compare(password, user.password, function(err, success){
                if(err) throw err;
                if(success){
                    // send header
                    let token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET, { expiresIn: 100000});
                    return res.header('auth-token', token).send(token);

                    // console.log(`User ${user.username} Log in successfully`);
                    // return res.json({msg:`User ${user.username} Log in successfully`});
                }else{
                    console.log(`Wrong password for ${user.username}`);
                    return res.json({msg:`Wrong password for ${user.username}`});
                }
            });
        }else{
            console.log("Email does not exist");
            return res.json({msg:"Email does not exist"});
        }
    }).catch(err => console.log(err));
});


router.post('/testToken', auth, function(req, res, next){
    console.log(`token is`);
    return res.json({msg:`Token validated, user is ${req.user._id}`})
})

module.exports = router;