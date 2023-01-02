const author=require("../modules/authorModel");
const createAuthor=async function(req,res){
  try {let data=req.body;
    let setData=await author.create(data);
    res.status(201).send({status:true,msg:setData});
}catch(error){
    res.status(500).send({status:false,error:error.message})
}
    

}
module.exports={createAuthor};