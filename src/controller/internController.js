const collegeModel = require('../Model/collegeModel');
const internModel = require('../Model/intern');
const validator = require('validator');
const createIntern = async function (req, res) {
    try {
        const newData = {};
        let { name, email, mobile } = req.body;
        if (!name || !email || !mobile) return res.status(400).send({ status: false, msg: "Please fill all the mandatory fields !!" });
        if (typeof name != "string" || typeof email != "string" ) {
            return res.status(400).send({ status: false, msg: "Enter valid information in String. Ex: name:'xyz' etc." })
        };
        if (name) {
            if (!validator.isAlpha(name, "en-US", { ignore: ' ' })) {
                return res.status(400).send({ status: false, msg: "Enter a valid name" });
            }
            newData.name = name.trim();
        };

        if (email) {
            if(!validator.isEmail(email))  return res.status(400).send({ status: false, msg: "Enter a valid email-id" })
            newData.email = email.trim();
            
        };
        if (mobile) {
            mobile=mobile.toString();
            if(mobile.length != 10)  return res.status(400).send({ status: false, msg: "Please Check Your Number.Number should be in 10 digits.." })
            if(!validator.isNumeric(mobile)) return res.status(400).send({ status: false, msg: "Please Check Your Number" })
            Number(mobile);
            newData.mobile = mobile;
          
        };
        const checkEmailAndNum=await internModel.find({$or:[{email:email},{mobile:mobile}]});
        if(checkEmailAndNum != 0) return res.status(400).send({ status: false, msg: "Email or mobile number is already exist" })
        
        const collegeName = req.body.collegeName;
        if(!validator.isAlphanumeric(collegeName, "en-US", { ignore: '-' }))  return res.status(400).send({ status: false, msg: "Invalid college name " })
        if(collegeName.trim() == "") return res.status(400).send({ status: false, msg: "College name can not be empty" })
        const CollegeId = await collegeModel.findOne({ name: collegeName }).select({ _id: 1 });
        if(!CollegeId) return res.status(400).send({ status: false, msg: "No college exist with this name " })
        newData.collegeId = CollegeId;
        const intern = await internModel.create(newData);
        return res.status(200).send(intern);
    } catch (err) {
        
        return res.status(500).send({ status: false, msg: err.message })
    }

}

const getCollegeDetails = async function (req, res) {
    
    const collegeName = req.query.collegeName;//name
   if(typeof collegeName == 'undefined' ) return res.status(400).send({ status: false, msg: "Input something " })
   if(collegeName.trim() == "") return res.status(400).send({ status: false, msg: "College name can not be empty" })
    if(!validator.isAlphanumeric(collegeName, "en-US", { ignore: '-' }))  return res.status(400).send({ status: false, msg: "Invalid college name " })
    const checkCollege = await collegeModel.findOne({ name: collegeName });
    if(!checkCollege) return res.status(200).send({status:false, msg: "No college exists with this college name " });
    const { name, fullName, logoLink } = checkCollege;
    const newData = { name: name, fullName: fullName, logoLink: logoLink };
    const collegeId = checkCollege._id;
    const intern = await internModel.find({ collegeId: collegeId });
    newData.interns = intern;

    return res.status(200).send({ data: newData });
    

}



module.exports = { createIntern, getCollegeDetails }

