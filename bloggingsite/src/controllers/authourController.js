
const validator=require("validator")
const author=require("../modules/authorModel");
const createAuthor=async function(req,res){
  try {
    let data=req.body;

    if(!(validator.isAlpha(data.fname)||validator.isAlpha(data.lname)))  return res.status(400).send("invalid name")
     
    
    let fname=data.fname.trim().split(" ").join("");
     let lname=data.lname.trim().split(" ").join("");
    data.fname=fname
    data.lname=lname;

     if(!(validator.isEmail(req.body.email))) return res.status(400).send("please put a valid email")
     
     if (!validator.isStrongPassword(data.password)) {
      return res.status(400).send({ status: false, msg: "Kindly use atleast one uppercase alphabets, numbers and special characters for strong password." })
}
     
     
     let setData=await author.create(data);
      data.email
    res.status(201).send({status:true,msg:setData});
}catch(error){
    res.status(500).send({status:false,error:error.message})
}
    

}
module.exports={createAuthor};
