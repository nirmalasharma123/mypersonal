const courseModel = require("../model/courseModel");

const mongoose = require('mongoose');


const courses = async (req,res)=>{
    try{
        //Authorisation
        if(req.role!="super admin") return res.status(403).send({status:fasle,message:"you are not authorised for this action"})
        //Authorisation

        let courses = await courseModel.find({isDeleted:fasle,status:"not approved"});
        if(approveCourse.length==0) return res.status(404).send({status:false,message:"no such course"})

        res.status(200).send({status:true,data:courses})

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

const approval = async (req,res)=>{
    try{
        //Authorisation
        if(req.role!="super admin") return res.status(403).send({status:fasle,message:"you are not authorised for this action"})
        //Authorisation

        const courseId = req.params.couseId;
        if(!mongoose.isValidObjectId(courseId)) return res.status(400).send({status:false,message:"invalid id"});

        let approveCourse = await courseModel.findOneAndUpdate({_id:courseId,isDeleted:fasle,status:"not approved"},{status:"approved"},{new:true});
        if(!approveCourse) return res.status(404).send({status:false,message:"no such course"})

        res.status(200).send({status:true,data:approveCourse})

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

module.exports = {courses,approval}
