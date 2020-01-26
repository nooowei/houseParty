const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{type: String, required: true},
  nickname:{type: String},
  address:{type: String, required: true},
  choresAssigned:{type: [], default: []},
  choresTodo:{type:[], default:[]},
  password:{type:String, required: true},
  email:{type:String, required: true}
})

const User = mongoose.model('User', userSchema);

module.exports = User;
