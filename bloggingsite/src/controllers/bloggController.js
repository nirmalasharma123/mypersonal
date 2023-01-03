const blogModel=require('../modules/bloggModel')
const authorModel=require('../modules/authorModel');


const createBlog=async (req,res)=>{
 try{
  const authorID=await authorModel.findById(req.body.authorId);

if(!authorID) return res.status(404).send({error:"invalid author id"});
req.body.title=req.body.title.trim();
req.body.body=req.body.body.trim();
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
        let subcategory = req.query.subc
        if(id||category||tags||subcategory){
            
            let author = await blogModel.find({$or:[{authorId:id},{category:category},{tags:{$in:[tags]}},{subcategory:{$in:[subcategory]}}],isDeleted:false});

            if(author.length==0) return res.status(404).send({status:false, msg:"author not found"}) 

            return res.status(200).send({status:true,msg:author});

        }else{
            let data = await blogModel.find({isDeleted: false, isPublished: true});
            if(data.length==0) return res.status(404).send("No such data");
            return res.status(200).send({status:true, data:data})
        }

} catch (error) {
    return res.status(500).send({status:false, error:error.message})

}};
const updateBlog = async function(req, res) {

    try {

        let final = { isPublished: true, publishedAt: Date.now() }
        const data = req.params.blogId
        
        const { title, body, tags, subcategory } = req.body
        

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, msg: "Please enter details" })
        }

        let b = await blogModel.findOne({ _id: data});
        if(!b) return res.status(404).send({ status:false, msg:"Blog not found"})
        if (b.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "Blog is deleted" })
        }
        if (title) {
            final.title = title
        }
        if (body) {
            final.body = body
        }
        if(tags){
            let result=[]
           if(typeof tags==="string")
             {result.push(tags)}
            if(Array.isArray(tags))
                {
              result=[...tags]
                           }

       let updatedTag=[...b.tags,...result]
         final.tags=updatedTag;
}
if(subcategory){
    let result=[]
    if(typeof subcategory==="string")
    {result.push(subcategory)}
    if(Array.isArray(subcategory))
    {
        result=[...subcategory]
    }
let updatedSubcategory=[...b.subcategory,...result]
final.subcategory=updatedSubcategory;
}
            
let result = await blogModel.findOneAndUpdate({ _id: data }, final, { new: true })

        return res.status(200).send({ status: true, data: result })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message})
}
};
const deletById=async function(req,res){
    try{    
    let blogid=req.params.blogId;
    let id= await blogModel.findById(blogid);
    if(!id) return res.status(404).send("Blogg not found")
    if(id.isDeleted==false){
    let blogDeleted=await blogModel.findOneAndUpdate({_id:id},{isDeleted:true,deletedAt:Date.now()},{new:true})
    return res.status(200).send("blogg is deleted")
}
     res.status(404).send("no such id")
} catch(error){
    res.status(500).send({satus:false,msg:error.message})

}};
const deleteQuery = async function(req, res) {
    const { category, authorId, isPublished, tags, subCategory } = req.query

    if (!(category || authorId || isPublished || tags || subCategory)) {
        return res.status(400).send({ status: false, msg: "Kindly enter any value" })
    }

    let blog = await blogModel.find({ authorId: authorId,isDeleted: false})

    if (blog.length == 0) {
        return res.status(404).send({ status: false, msg: "Blog document doesn't exists." })
    }
 
    const update = await blogModel.updateMany({
        $or: [{ category: category },{ authorId: authorId },{ tags: { $in: [tags] } },
            { subCategory: { $in: [subCategory] } }]}, { isDeleted: true, deletedAt: Date.now(), new: true })

    return res.status(200).send({ status: true, data:update})
}


module.exports={createBlog,getBlogs,updateBlog,deletById,deleteQuery}
