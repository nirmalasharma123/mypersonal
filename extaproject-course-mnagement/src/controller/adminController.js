const { default: mongoose } = require('mongoose');
const courseModel = require("../model/courseModel");
const axios = require("axios");
const isValidUrl = require('url-validation')


const createCourse = async (req,res)=>{
    try{
        //Authorisation
        if(req.role!="admin") return res.status(403).send({status:fasle,message:"you are not authorised for this action"})
       //Authorisation

        let {title,description,videoUrl,topics,duration,category,...a} = req.body;
       if(Object.keys(a).length!=0) return res.status(400).send({status:false,message:"extra key not allowed"});

      if(!title||title=="") return res.status(400).send({status:false,message:"title is required"})
       if(typeof(title)!='string'||title.match(/^([a-z A-Z 0-9 -]){2,50}$/)) return res.status(400).send({status:false,message:"invalid title"})
       
       if(!description||description=="") return res.status(400).send({status:false,message:"description is required"});
       if(typeof(description)!='string') return res.status(400).send({status:false,message:"invalid description"});
       
       if(!videoUrl||videoUrl=="") return res.status(400).send({status:false,message:"videoUrl is required"});
       if(isValidUrl(videoUrl)) return res.status(400).send({status:false,message:"invalid url"})
       let genuineUrl = await axios.get(videoUrl)
            .then(() => videoUrl)
            .catch((err) => null) 
            if (!genuineUrl) return res.status(404).send({ status: false, message: "Page not found" })
       
       if(!duration||duration=="") return res.status(400).send({status:false,message:"duration is required"}); 
       if(typeof(duration)!='string'||duration!=moment(duration).format('hh:mm:ss')) return res.status(400).send({status:false,message:"invalid duration"});
       
       if(!category||category=="") return res.status(400).send({status:false,message:"category is required"}); 
       if(typeof(category)!='string'||category.match(/^([a-z A-Z]){2,50}$/)) return res.status(400).send({status:false,message:"invalid category"});

       if(typeof(topics)=='object'){
       let string = topics.filter(x=>typeof(x)!='string')
       if(string.lenth!=0) return res.status(400).send({status:false,message:"invalid topic format"})
       }
       if(typeof(topics)=='string'){
        topics = topics.trim().split(",");
       }

       let unique = await courseModel.findOne({title:title,isDeleted:false})
       if(unique) return res.status(400).send({status:false,message:"title already in use"});
       
       let course = await courseModel.create(req.body);
       res.status(201).send({status:true,data:course});


    }catch(err){
        res.status(500).send({status:false,mssage:err.message});
    }
}


const updateCourse = async (req,res)=>{
    try{
        //Authorisation
        if(req.role!="admin") return res.status(403).send({status:fasle,message:"you are not authorised for this action"})
        //Authorisation

        const courseId = req.params.couseId;
        if(!mongoose.isValidObjectId(courseId)) return res.status(400).send({status:false,message:"invalid id"});

        let data = req.body;
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"please provide some data"});

        if(data.title){
            if(typeof(title)!='string'||title.match(/^([a-z A-Z 0-9 -]){2,50}$/)) return res.status(400).send({status:false,message:"invalid title"})
            //DB
        }
        if(data.description){
            if(typeof(description)!='string') return res.status(400).send({status:false,message:"invalid description"});
        }
        if(data.videoUrl){
            if(isValidUrl(videoUrl)) return res.status(400).send({status:false,message:"invalid url"})
            let genuineUrl = await axios.get(videoUrl)
                 .then(() => videoUrl)
                 .catch((err) => null) 
                 if (!genuineUrl) return res.status(404).send({ status: false, message: "Page not found" })
        }
        if(data.duration){
            if(typeof(duration)!='string'||duration!=moment(duration).format('hh:mm:ss')) return res.status(400).send({status:false,message:"invalid duration"});
        }
        if(data.category){
            if(typeof(category)!='string'||category.match(/^([a-z A-Z]){2,50}$/)) return res.status(400).send({status:false,message:"invalid category"});
        }
        if(data.topics){
            if(typeof(data.topics)=='object'){
                let string = data.topics.filter(x=>typeof(x)!='string')
                if(string.lenth!=0) return res.status(400).send({status:false,message:"invalid topic format"})
                }
                if(typeof(data.topics)=='string'){
                 data.topics = data.topics.trim().split(",");
                }
        }

        let update = await courseModel.findOneAndUpdate({_id:courseId,isDeleted:false},data,{new:true});
        if(!update) return res.status(404).send({status:fasle,message:"no such course"})

        res.status(200).send({status:true,message:"successfully updated",data:update})

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}


const deleteCourse = async (req,res)=>{
    try{
        const courseId = req.params.couseId;
        if(!mongoose.isValidObjectId(courseId)) return res.status(400).send({status:false,message:"invalid id"});

        //Authorisation
        if(req.role!="admin") return res.status(403).send({status:fasle,message:"you are not authorised for this action"})
        //Authorisation

        let deletedCourse = await courseModel.findOneAndUpdate({_id:courseId,isDeleted:fasle},{isDeleted:true},{new:true});
        if(!deletedCourse) return res.status(404).send({status:false,message:"no such course"})

        res.status(200).send({status:true,message:"sucessfully deleted"})

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}


module.exports = {createCourse,updateCourse,deleteCourse}
