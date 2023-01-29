const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
title:{
    type : String,
    required : true,
    trim : true,
    lowercase : true,
    unique:true
},
description:{
    type : String,
    required:true,
    trim : true
},
videoUrl:{
    type:String,
    required:true
},
topics:{
    type:[String],
   required:true
},
duration: {
    type:String,
    required:true
},
category:{
    type:String,
    required:true
},
isDeleted:{
    type:Boolean,
    default:false
},
status:{
    type:String,
    enum : ["approved", "not approved"],
    default : "not approved"
}
},{timestamps : true}
)

module.exports = mongoose.model('course',courseSchema)