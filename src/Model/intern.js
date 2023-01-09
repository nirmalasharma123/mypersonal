const mongoose = require('mongoose')

const internSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:Number,
        unique:true,
        required:true
    },
    collegeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'collegeData'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})


module.exports =mongoose.model('internData',internSchema);