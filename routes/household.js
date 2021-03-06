let express = require('express');
let router = express.Router();
let Household = require('../models/household.model');


// router for getting household information
router.get('/:id', function(req, res, next) {
  let id = req.params.id;
  Household.findById(id).then(house => {
    if(house){
      res.json({
        name: house.name,
        address: house.address,
        choresTodo: house.choresTodo,
        choresAssigned: house.choresAssigned,
        choresDone: house.choresDone,
        inventory: house.inventory,
        announcements: house.announcements,
        members: house.members
      })
    }else{
      res.json({msg: "Household not found"});
    }
  }).catch(err => console.log(err));

  // res.send('respond with a resource');
});

//route for creating a new household
router.post('/create', function(req,res,next){
  let{ name, address } = req.query;
  // console.log(name);
  // console.log(address);
  // console.log(member);

  // let members = [member]; //propbably will just be one
  // console.log(members);

  // check for name uniqueness
  Household.findOne({name}).then(house => {
    if(house){
      return res.json({msg: "House name taken, be more clever!"});
    }
  });

  // check for whether it already exists
  Household.findOne({address}).then(house => {
    if(house){
      return res.json({msg: "Houseold already exist, want to join?"});
    }
  });

  // save household to database
  const newHousehold = new Household({
    name,
    address
  })

  newHousehold.save().then(() =>{
      console.log("Household created");
      return res.json({msg: "Household created"});
  }).catch(err => {
    console.log(err);
  })

});

router.post('/join/:id', function(req,res,next){
  let{ memberName } = req.query;
  console.log(memberName);
  let id = req.params.id;
  // console.log(id, houseName, memberName);


  // check for name uniqueness
  Household.findById(id).then(house => {
    if(house){
      // creating a new choresAssigned array for each new housemember
      let choresAssigned;
      // catch block for the when the object is empty
      try{
        choresAssigned = JSON.parse(house.choresAssigned);
        // console.log("try successfully")
      }catch{
        choresAssigned = house.choresAssigned;
        // console.log("catch successfully")
      }

      // console.log(choresAssigned);
      choresAssigned[memberName] = [];
      // console.log(choresAssigned);
      choresAssigned = JSON.stringify(choresAssigned);
      // console.log(choresAssigned);


      // creating a new choresDone array for each new housemember
      let choresDone;
      // catch block for the when the object is empty
      try{
        choresDone = JSON.parse(house.choresDone);
        // console.log("try successfully")
      }catch{
        choresDone = house.choresDone;
        // console.log("catch successfully")
      }

      // console.log(choresAssigned);
      choresDone[memberName] = [];
      // console.log(choresAssigned);
      choresDone = JSON.stringify(choresDone);



      house.name = house.name;
      house.address = house.address;
      house.members = [...house.members, memberName];
      house.choresAssigned = choresAssigned;
      house.choresDone = choresDone;
      house.markModified(choresAssigned);
      house.markModified(choresDone);


      house.save().then(() => {
        console.log(`Joined ${house.name} successfully!`);
        res.json(`Joined ${house.name} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      console.log("House not found");
      res.json({msg: "House not found"});
    }
  });
});

// remove a housemember from household
router.post('/removeMember/:id', function(req,res,next){
  let{ memberName } = req.query;
  console.log(memberName);
  let id = req.params.id;
  // console.log(id, houseName, memberName);


  // check for name uniqueness
  Household.findById(id).then(house => {
    if(house){

      // removing member from chores assigned object
      let choresAssigned;
      // catch block for the when the object is empty
      try{
        choresAssigned = JSON.parse(house.choresAssigned);
      }catch{
        choresAssigned = house.choresAssigned;
      }
      delete choresAssigned[memberName];
      choresAssigned = JSON.stringify(choresAssigned);

      // removing member from chores done object
      let choresDone;
      try{
        choresDone = JSON.parse(house.choresDone);
        delete choresDone[memberName];
        choresDone = JSON.stringify(choresDone);
      }catch{
        choresDone = house.choresDone;
      }

      //removing member from members
      let members = house.members;
      members = members.filter(m =>{
        if(m !== memberName){
          return m;
        }
      })
      console.log(members);


      house.name = house.name;
      house.address = house.address;
      house.members = members;
      house.choresAssigned = choresAssigned;
      house.choresDone = choresDone;
      house.markModified(members);
      house.markModified(choresAssigned);
      house.markModified(choresDone);

      house.save().then(() => {
        console.log(`Removed ${memberName} from ${house.name} successfully!`);
        res.json(`Removed ${memberName} from ${house.name} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      console.log("House not found");
      res.json({msg: "House not found"});
    }
  });
});


module.exports = router;
