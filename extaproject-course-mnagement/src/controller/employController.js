const courseModel = require("../model/courseModel");
const roleModel = require("../model/userModel");


const viweCourses =  async (req,res)=>{
    try{
        //Authorisation
        if(req.role!="employee") return res.status(403).send({status:fasle,message:"you are not authorised for this action"})
        //Authorisation

        let data = req.query
        data.isDeleted = false;
        data.status = "approved"
        
        let {category, isDeleted, status, ...a} = data;
        if(Object.keys(a).length!=0) return res.status(400).send({status:false,message:"can search using category only"}) 
       
        let employee = await roleModel.findOneAndUpdate({_id:req.userId,isDeleted:false},{$inc:{rewards:1}},{new:true})
        if(!employee) return res.status(404).send({status:false,message:"no such employee"})

        let courses = await courseModel.find(data);
        if(approveCourse.length==0) return res.status(404).send({status:false,message:"no such course"})

        res.status(200).send({status:true,data:courses})

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

module.exports={viweCourses}
