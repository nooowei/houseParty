let express = require('express');
let router = express.Router();
let Household = require('../models/household.model');
let User = require('../models/user.model');
// // propbably don't need this.
// router.get('/:id', function(req, res, next) {
//   res.send('respond with a resource');
// });


// route for add chorus
router.post('/add/:id', function(req, res, next){
  let id = req.params.id;
  let chorusArr = req.query.chorus;
  // this needs to be an array when send into DB
  chorusArr = chorusArr.split(",");// needs change when using front end
  console.log(chorusArr);

  Household.findById(id).then(house => {
    if(house){
      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      house.chorusTodo = [...house.chorusTodo, ...chorusArr];

      house.save().then(() => {
        console.log(`Added chorus to ${house.name} successfully!`);
        res.json(`Added Chorus to ${house.name} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "House not found"});
    }
  });
})

router.post('/delete/:id', function(req, res, next){
  let id = req.params.id;
  let chorus = req.query.chorus; // just a string
  // pre check to increase performance
  if(typeof chorus === "undefined"){
    res.json({msg: "Chorus not found."});
  }

  Household.findById(id).then(house => {
    if(house){
      let oldChorusArr = house.chorusTodo;
      let newChorusArr = [];
      for(let i=0; i<oldChorusArr.length; i++){
        if(oldChorusArr[i] !== chorus){
          newChorusArr.push(oldChorusArr[i]);
        }
      }
      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      house.chorusTodo = newChorusArr;

      house.save().then(() => {
        console.log(`Deleted 1 chorus from ${house.name} successfully!`);
        res.json(`Deleted 1 Chorus from ${house.name} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "Household not found"});
    }
  });
})

router.post('/assign/:id', function(req, res, next){
  let id = req.params.id;
  // get chorus and user name
  let {chorus, name} = req.query; // just a string
  // pre check to increase performance
  if(typeof chorus === "undefined"){
    res.json({msg: "Chorus not found."});
  }

  Household.findById(id).then(house => {
    if(house){
      let oldChorusArr = house.chorusTodo;
      let newChorusArr = [];
      for(let i=0; i<oldChorusArr.length; i++){
        if(oldChorusArr[i] !== chorus){
          newChorusArr.push(oldChorusArr[i]);
        }
      }
      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      house.chorusTodo = newChorusArr;
      house.chorusAssigned = [...house.chorusAssigned, chorus];

      house.save().then(() => {
        console.log(`Deleted 1 chorus from ${house.name} successfully!`);
        res.json(`Deleted 1 Chorus from ${house.name} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "Household not found"});
    }
  });

  User.findOne({name}).then(user => {

  })
})


module.exports = router;
