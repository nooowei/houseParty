let express = require('express');
let router = express.Router();
let Household = require('../models/household.model');
let User = require('../models/user.model');
// // propbably don't need this.
// router.get('/:id', function(req, res, next) {
//   res.send('respond with a resource');
// });


// route for add chores
router.post('/add/:id', function(req, res, next){
  let id = req.params.id;
  let choresArr = req.query.chores;
  // this needs to be an array when send into DB
  choresArr = choresArr.split(",");// needs change when using front end
  console.log(choresArr);

  Household.findById(id).then(house => {
    if(house){
      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      house.choresTodo = [...house.choresTodo, ...choresArr];

      house.save().then(() => {
        console.log(`Added chores to ${house.name} successfully!`);
        res.json(`Added Chores to ${house.name} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "House not found"});
    }
  });
})

router.post('/delete/:id', function(req, res, next){
  let id = req.params.id;
  let chores = req.query.chores; // just a string
  // pre check to increase performance
  if(typeof chores === "undefined"){
    res.json({msg: "Chores not found."});
  }

  Household.findById(id).then(house => {
    if(house){
      let oldChoresArr = house.choresTodo;
      let newChoresArr = [];
      for(let i=0; i<oldChoresArr.length; i++){
        if(oldChoresArr[i] !== chores){
          newChoresArr.push(oldChoresArr[i]);
        }
      }
      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      house.choresTodo = newChoresArr;

      house.save().then(() => {
        console.log(`Deleted 1 chores from ${house.name} successfully!`);
        res.json(`Deleted 1 Chores from ${house.name} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "Household not found"});
    }
  });
})

router.post('/assign/:id', function(req, res, next){
  let id = req.params.id;
  // get chores and user name
  let {chores, name} = req.query; // just a string
  // pre check to increase performance
  if(typeof chores === "undefined"){
    res.json({msg: "Chores not found."});
  }

  Household.findById(id).then(house => {
    if(house){
      let oldChoresArr = house.choresTodo;
      let newChoresArr = [];
      for(let i=0; i<oldChoresArr.length; i++){
        if(oldChoresArr[i] !== chores){
          newChoresArr.push(oldChoresArr[i]);
        }
      }
      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      house.choresTodo = newChoresArr;
      house.choresAssigned = [...house.choresAssigned, chores];

      house.save().then(() => {
        console.log(`Deleted 1 chores from ${house.name} successfully!`);
        res.json(`Deleted 1 Chores from ${house.name} successfully!`);
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
