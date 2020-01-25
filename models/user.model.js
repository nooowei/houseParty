const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{type: String, required: true},
  nickname:{type: String},
  address:{type: String, required: true},
  chorus:{type: {}, default: {}},
  password:{type:String, required: true},
  email:{type:String, required: true}
})

const User = mongoose.model('User', userSchema);

export default User;
