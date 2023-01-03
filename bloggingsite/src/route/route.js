const express=require("express");
const router=express.Router();
const authorController=require("../controllers/authourController");
const blogController=require('../controllers/bloggController')

router.post("/authors",authorController.createAuthor);
router.post('/blogs',blogController.createBlog);
router.get("/blogs",blogController.getBlogs);
router.put("/blogs/:blogId",blogController.updateBlog);
router.delete("/blogs/:blogId",blogController.deletById)




module.exports=router
