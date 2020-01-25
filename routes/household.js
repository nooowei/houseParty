let express = require('express');
let router = express.Router();
let Household = require('../models/household.model');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', function(req,res,next){
  let{ name, address, member } = req.query;
  // console.log(name);
  // console.log(address);
  // console.log(member);

  let members = [member];
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
    address,
    members
  })

  newHousehold.save().then(()=>{
    console.log("household added")
    res.json({msg:'Household Added'})
  }).catch(err => {
    console.log(err);
  })

  // res.json({msg:"/create route"});
});

router.post('/join', function(req,res,next){
  let{ houseName, memberName } = req.query;
  // let houseName = req.params.houseName;
  // console.log(houseName);
  console.log(houseName, memberName);

  // check for name uniqueness
  Household.findOne({houseName}).then(house => {
    if(house){
      house.name = house.name;
      house.address = house.address;
      house.members = [...house.members, memberName]

      house.save().then(() => {
        res.json(`Joined ${houseName} successfully!`)
      })
      res.json({msg: "House name taken, be more clever!"});
    }else{
      res.json({msg: "House not found"});
    }
  });

  // // save household to database
  // const newHousehold = new Household({
  //   name,
  //   address,
  //   members
  // })
  //
  // newHousehold.save().then(()=>{
  //   console.log("household added")
  //   res.json({msg:'Household Added'})
  // }).catch(err => {
  //   console.log(err);
  // })

  // res.json({msg:"/create route"});
});



//

module.exports = router;
