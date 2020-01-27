let express = require('express');
let router = express.Router();
let Household = require('../models/household.model');
let User = require('../models/user.model');

let bcrypt = require('bcryptjs');

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
    console.log(email);

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
        }
    })

    // encrypting password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            console.log(password);
        });
    });


    let newUser = new User({
        username,
        email,
        password
    });


    //save to db
    newUser.save().then(() => {
        console.log(`New user ${username} registered successfully.`);
        // jwt send token
        return res.json({msg:`New user ${username} registered successfully.`});
    }).catch(err => console.log(err));

    // // encrypting password then save to db
    // bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash(password, salt, (err, hash) => {
    //         if (err) throw err;
    //         newUser.password = hash;
    //         console.log(newUser.password);
    //         newUser.save().then(() => {
    //             console.log(`New user ${username} registered successfully.`);

    //             // jwt send token
    //             return res.json({msg:`New user ${username} registered successfully.`});
    //         }).catch(err => console.log(err));

    //     });
    // });

    
})



router.post('/login', function(req, res, next){
    let { email, password } = req.body;

    User.findOne({email}).then(user => {
        if(user){
            
            // sub for bcrypt when using it
            if(user.password === password){
                // send header
            }

        }else{
            console.log("Email does not exist");
            return res.json({msg:"Email does not exist"});
        }
    }).catch(err => console.log(err));
});

module.exports = router;