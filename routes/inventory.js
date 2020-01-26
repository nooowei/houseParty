let express = require('express');
let router = express.Router();
let Household = require('../models/household.model');
let User = require('../models/user.model');

// // return the house inventory
// router.get('/:id', function(req, res, next) {
//   res.send('respond with a resource');
// });


// route for add chores
router.post('/add/:id', function(req, res, next){
  let id = req.params.id;
  let chores = req.query.chores;
  // this needs to be an array when send into DB
  // choresArr = choresArr.split(",");// needs change when using front end
  // console.log(choresArr);

  Household.findById(id).then(house => {
    if(house){
      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      // no Duplicates
      if(!house.choresTodo.includes(chores)){
        house.choresTodo = [...house.choresTodo, chores];
        house.save().then(() => {
          console.log(`Added chores to ${house.name} successfully!`);
          res.json(`Added Chores to ${house.name} successfully!`);
        })
      }else{
        console.log("Duplicated todo item");
        res.json({msg: "Duplicated todo item"});
      }

      // house.save().then(() => {
      //   console.log(`Added chores to ${house.name} successfully!`);
      //   res.json(`Added Chores to ${house.name} successfully!`);
      // })
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
      let choresTodo = house.choresTodo;
      choresTodo = choresTodo.filter(c => {
        if(c !== chores){
          return c;
        }
      })

      // delete from assigned
      let choresAssigned = JSON.parse(house.choresAssigned);
      try{
        for(let i=0; i<house.members.length; i++){
          let m = house.members[i];
          let memberChoresAssigned = choresAssigned[m];
          memberChoresAssigned = memberChoresAssigned.filter(c =>{
            if(c !== chores){
              return c;
            }
          });
          choresAssigned[m] = memberChoresAssigned;
        }
        console.log(choresAssigned);
      }catch{
        console.log("Cannot remove chores from choresAssigned");
        res.json({msg: "Cannot remove chores from choresAssigned"});
      }
      choresAssigned = JSON.stringify(choresAssigned);


      //delete from done
      let choresDone = JSON.parse(house.choresDone);
      try{
        for(let i=0; i<house.members.length; i++){
          let m = house.members[i];
          let memberChoresDone = choresDone[m];
          memberChoresDone = memberChoresDone.filter(c =>{
            if(c !== chores){
              return c;
            }
          });
          choresDone[m] = memberChoresDone;
        }
        console.log(choresDone);
      }catch{
        console.log("Cannot remove chores from choresDone");
        res.json({msg: "Cannot remove chores from choresDone"});
      }
      choresDone = JSON.stringify(choresDone);

      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      house.choresTodo = choresTodo;
      house.choresAssigned = choresAssigned;
      house.choresDone = choresDone;


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
  let {chores, member} = req.query; // just a string
  // pre check to increase performance
  if(typeof chores === "undefined"){
    res.json({msg: "Chores not found."});
  }

  Household.findById(id).then(house => {
    if(house){
      // remove chores from choresTodo array
      let choresTodo = house.choresTodo;
      choresTodo = choresTodo.filter(c => {
        if(c !== chores){
          return c;
        }
      })

      //add chore to choresAssigned array
      let choresAssigned;
      // catch block for the when the object is empty
      choresAssigned = JSON.parse(house.choresAssigned);
      try{
        if(!choresAssigned[member].includes(chores)){
          choresAssigned[member].push(chores);
        }else{
          console.log(`${member} is already doing this!`);
          return res.json({msg:`${member} is already doing this!`})
        }
        // console.log("After adding chores to assigned");
        // console.log(choresAssigned);
      }catch{
        console.log("House Member Doesn't Exist")
        res.json({msg: "House Member Doesn't Exist"});
      }
      choresAssigned = JSON.stringify(choresAssigned);

      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      house.choresTodo = choresTodo;
      house.choresAssigned = choresAssigned;

      house.save().then(() => {
        console.log(`Assigned 1 chores to ${member} successfully!`);
        res.json(`Assigned 1 chores to ${member} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "Household not found"});
    }
  });

  // maybe add to the User document when creating profile

  // User.findOne({name}).then(user => {
  //
  // })
})

router.post('/completeChore/:id', function(req, res, next){
  let id = req.params.id;
  // get chores and user name
  let {chores, member} = req.query; // just a string
  // pre check to increase performance
  if(typeof chores === "undefined"){
    res.json({msg: "Chores not found."});
  }

  Household.findById(id).then(house => {
    if(house){

      //remove chore from choresAssigned object
      let choresAssigned = JSON.parse(house.choresAssigned);
      try{
        let memberChoresAssigned = choresAssigned[member];
        memberChoresAssigned = memberChoresAssigned.filter(c =>{
          if(c !== chores){
            return c;
          }
        });
        choresAssigned[member] = memberChoresAssigned;
        // console.log(choresAssigned);
      }catch{
        console.log("Cannot remove chores from choresAssigned")
        return res.json({msg: "Cannot remove chores from choresAssigned"});
      }
      choresAssigned = JSON.stringify(choresAssigned);


      // add chore to choresDone object
      let choresDone = JSON.parse(house.choresDone);
      // catch block for the when the object is empty
      try{
        // console.log("got to try");
        let memberChoresDone = choresDone[member];
        console.log(memberChoresDone);

        memberChoresDone.push(chores);
        console.log(memberChoresDone);

        choresDone[member] = memberChoresDone;
        console.log(choresDone);
        // console.log("try successfully")
      }catch{
        console.log("Cannot add chores to choresDone")
        return res.json({msg: "Cannot add chores to choresDone"});
        // console.log("catch successfully")
      }
      // console.log(choresAssigned);
      choresDone = JSON.stringify(choresDone);


      house.name = house.name;
      house.address = house.address;
      house.members = house.members;
      // house.choresTodo = choresTodo;
      house.choresAssigned = choresAssigned;
      house.choresDone = choresDone;
      house.markModified(choresAssigned);
      house.markModified(choresDone);


      house.save().then(() => {
        console.log(`${member} completed 1 chores successfully!`);
        res.json(`${member} completed 1 chores successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "Household not found"});
    }
  });

  // maybe add to the User document when creating profile

  // User.findOne({name}).then(user => {
  //
  // })
})


module.exports = router;
