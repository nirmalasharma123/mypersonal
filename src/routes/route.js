const express=require('express');
const router =express.Router();
const collegeController=require('../controller/collegeController');
const internController=require('../controller/internController');


router.post('/functionup/colleges',collegeController.createCollege);
router.post('/functionup/interns',internController.createIntern);
router.get('/functionup/collegeDetails',collegeController.getCollegeDetails)
router.all('/*',function (res ,res){
    res.status(400).send({status :false ,msg:"Please send correct url"})
})

module.exports=router;