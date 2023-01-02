const blogModel=require('../modules/bloggModel')
const authorModel=require('../modules/authorModel');
const { bulkSave } = require('../modules/bloggModel');
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
        let subcategory = req.query.subc
        if(id||category||tags||subcategory){
            
            let author = await blogModel.find({$or:[{authorId:id},{category:category},{tags:{$in:[tags]}},{subcategory:{$in:[subcategory]}}],isDeleted:false,isPublished:true})
            if(!author) return res.status(404).send({status:false, msg:"author not found"}) 
            return res.status(200).send({status:true,msg:author})
        }
        else{
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
        const { title, body, tags, subCategory } = req.body

        if (Object.keys(req.body) === 0) {
            return res.status(400).send({ status: false, msg: "Please enter details" })
        }

        let b = await blogModel.findOne({ _id: data});
        if (b.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "Blog is deleted" })
        }
        if (title) {
            final.title = title
        }
        if (body) {
            final.body = body
        }
        if (tags) {
            b.tags.push(tags)
            final.tags = b.tags
        }
        if (subCategory) {
            b.subCategory.push(subCategory)
            final.subCategory = b.subCategory
        }

        let result = await blogModel.findOneAndUpdate({ _id: data }, final, { new: true })

        return res.status(200).send({ status: true, data: result })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message})
}
}


module.exports={createBlog,getBlogs,updateBlog}
