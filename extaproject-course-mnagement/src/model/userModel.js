
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
name:{
    type : String,
    required : true,
    trim : true,
    lowercase : true
},
email:{
    type : String,
    required:true,
    unique:true,
    trim : true
},
password:{
    type:String,
    required:true,
    minLength:8
},
role:{
    type:String,
    enum : ["admin","super admin","employee"],
    default: "employee"
},
isDeleted:{
    type:Boolean,
    default:false
},
rewards : Number
},{timestamps : true}
)

module.exports = mongoose.model('role',roleSchema)
