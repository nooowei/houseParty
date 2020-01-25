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
        chorus: house.chorus,
        announcements: house.announcements,
        members: house.members
      })
    }else{
      res.json({msg: "Household not found"});
    }
  }).catch(err => console.log(err));

  res.send('respond with a resource');
});

//route for creating a new household
router.post('/create', function(req,res,next){
  let{ name, address, member } = req.query;
  // console.log(name);
  // console.log(address);
  // console.log(member);

  let members = [member]; //propbably will just be one
  console.log(members);

  // check for name uniqueness
  Household.findOne({name}).then(house => {
    if(house){
      res.json({msg: "House name taken, be more clever!"});
    }
  });

  // check for whether it already exists
  Household.findOne({address}).then(house => {
    if(house){
      res.json({msg: "Houseold already exist, want to join?"});
    }
  });

  // save household to database
  const newHousehold = new Household({
    name,
    address
    // members
    // chorusAssigned: {`${member}`:[]}
  })

  newHousehold.save().then(() =>{
      console.log("Household created");
      res.json({msg: "Household created"});
  }).catch(err => {
    console.log(err);
  })


  // newHousehold.save().then(() =>{
  //   // need to add the first person's name into the chorusAssigned object
  //   Household.findOne({name}).then(house =>{
  //     let chorusAssigned = house.chorusAssigned;
  //     // let newChorusAssigned = {};
  //     chorusAssigned[member] = [];
  //
  //     house.name = house.name;
  //     house.address = house.address;
  //     house.chorusAssigned = chorusAssigned;
  //
  //     house.save().then(() => {
  //       console.log("Household created");
  //       res.json({msg: "Household created"});
  //     })
  //   }).catch(err => console.log(err));
  // }).catch(err => {
  //   console.log(err);
  // })

  // res.json({msg:"/create route"});
});

router.post('/join/:id', function(req,res,next){
  let{ memberName } = req.query;
  let id = req.params.id;
  // console.log(id, houseName, memberName);


  // check for name uniqueness
  Household.findById(id).then(house => {
    if(house){
      // creating a new chorusAssigned array for each new housemember
      let chorusAssigned = house.chorusAssigned;
      console.log(chorusAssigned);
      chorusAssigned[memberName] = [];
      console.log(chorusAssigned);


      house.name = house.name;
      house.address = house.address;
      house.members = [...house.members, memberName];
      house.chorusAssigned = chorusAssigned;

      house.save().then(() => {
        console.log(`Joined ${house.name} successfully!`);
        res.json(`Joined ${house.name} successfully!`);
      })
      // res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "House not found"});
    }
  });
});


module.exports = router;
