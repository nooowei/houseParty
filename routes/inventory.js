let express = require('express');
let router = express.Router();
let Household = require('../models/household.model');
let User = require('../models/user.model');

// return the house inventory
router.get('/:id', function(req, res, next) {
  let id = req.params.id;
  Household.findById(id).then(house => {
    if(house){
      let inventory = JSON.parse(house.inventory);
      return res.json({inventory});
    }else{
      console.log("House not found");
      returnres.json({msg: "House not found"});
    }
  })
});


// updates the inventory of the house
// passed around as an object
router.post('/update/:id', function(req, res, next){
  let id = req.params.id;
  let newInventory = req.body.inventory;

  Household.findById(id).then(house => {
    if(house){
      house.name = house.name;
      house.address = house.address;
      house.inventory = JSON.stringify(newInventory);

      house.save().then(() => {
        console.log(`Updated inventory of ${house.name} successfully!`);
        res.json(`Updated inventory of ${house.name} successfully!`);
      });
    }else{
      return res.json({msg: "House not found"});
    }
  })
})

module.exports = router;
