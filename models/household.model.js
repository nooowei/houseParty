const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const householdSchema = new Schema({
  name:{type: String, required: true},
  address:{type: String, required: true},
  chorusTodo:{type: [String], default: []},
  chorusAssigned:{type: {}, default: {}},
  chorusDone:{type: [String], default: []},
  announcements:{type:[String], default:[]},
  members:{type:[String], default:[]}
})

const Household = mongoose.model('Household', householdSchema);

module.exports = Household;
