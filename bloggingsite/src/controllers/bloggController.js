const blogModel=require('../modules/bloggModel')
const authorModel=require('../modules/authorModel')
const createBlog=async (req,res)=>{
    try{
const authorID=await authorModel.findById(req.body.authorId)
if(!authorID) return res.status(404).send({error:"invalid author id"})
const create=await blogModel.create(req.body)
 res.status(201).send({status:true,msg:create})
    }
    catch(error)
    {
        return res.status(500).send({status:false,error:error.message})
    }

};
const getBlogs = async function(req,res){
    try {
        let id = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subc = req.query.subc
        if(id&&category&&tags&&subc){
            let author = await blogModel.findOne({authorId:id,tags:{$in:tags}})
            if(!author) return res.status(404).send({status:false, msg:"author not found"})
            // let cat = await blogModel.find({category:category})
            // if(cat.length==0) return res.status(404).send({status:false, msg:"no such category"}) 
            return res.status(200).send({status:true,msg:author})
        }
    // let data = await blogModel.find({isDeleted: false, isPublished: true});
    // if(data.length==0) return res.status(404).send("No such data");
    // return res.status(200).send({status:true, data:data})

} catch (error) {
    return res.status(500).send({status:false, error:error.message})

}};

module.exports={createBlog,getBlogs}
