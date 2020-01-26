const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const householdSchema = new Schema({
  name:{type: String, required: true},
  address:{type: String, required: true},
  choresTodo:{type: [String], default: []},
  choresAssigned:{type: {}, default: {}},
  choresDone:{type:{}, default:{}},
  announcements:{type:[String], default:[]},
  members:{type:[String], default:[]},
  inventory:{type:{}, default:{}}
})

const Household = mongoose.model('Household', householdSchema);

module.exports = Household;
