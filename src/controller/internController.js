const collegeModel = require('../Model/collegeModel');
const internModel = require('../Model/intern');
const validator = require('validator');
const createIntern = async function (req, res) {
    try {
        const newData = {};
        let { name, email, mobile, collegeName } = req.body;
        if (!name || !email || !mobile || !collegeName) return res.status(400).send({ status: false, message: "Please fill all the mandatory fields !!" });
        if (typeof name != "string" || typeof email != "string") {
            return res.status(400).send({ status: false, message: "Enter valid information in String. Ex: name:'xyz' etc." })
        };
        if (name) {
            if (!validator.isAlpha(name, "en-US", { ignore: ' ' })) {
                return res.status(400).send({ status: false, message: "Enter a valid name" });
            }
            newData.name = name.trim();
        };

        if (email) {
            if (!validator.isEmail(email)) return res.status(400).send({ status: false, message: "Enter a valid email-id" })
            newData.email = email.trim().toLowerCase();

        };
        if (mobile) {
            mobile = mobile.toString();
            console.log(mobile.charAt(0));
            let flag=false;
           if(mobile.charAt(0) == '6' || mobile.charAt(0) == '7'|| mobile.charAt(0) == '8' || mobile.charAt(0) == '9'  ){
           // return res.status(400).send({ status: false, message: "invalid mobile number."});
           flag=true;

           }
           if(!flag ){
             return res.status(400).send({ status: false, message: "invalid mobile number."});
           }

           
            if (mobile.length != 10) return res.status(400).send({ status: false, message: "Please Check Your Number.Number should be in 10 digits.." })
            if (!validator.isNumeric(mobile)) return res.status(400).send({ status: false, message: "Please Check Your Number" })
            Number(mobile);
            newData.mobile = mobile;

        };
        const checkEmailAndNum = await internModel.find({ $or: [{ email: email }, { mobile: mobile }] });
        if (checkEmailAndNum.length != 0) return res.status(400).send({ status: false, message: "Email or mobile number is already exist" })

       // const collegeName = req.body.collegeName;
        if (!validator.isAlphanumeric(collegeName, "en-US", { ignore: '-' })) return res.status(400).send({ status: false, message: "Invalid college name " })
        if (collegeName.trim() == "") return res.status(400).send({ status: false, message: "College name can not be empty" })
        const CollegeId = await collegeModel.findOne({ name: collegeName }).select({ _id: 1 });
        if (!CollegeId) return res.status(400).send({ status: false, message: "No college exist with this name " })
        newData.collegeId = CollegeId;
        const intern = await internModel.create(newData);
        let intern1= {name:intern.name , email:intern.email , mobile:intern.mobile , collegeId:intern.collegeId._id,isDeleted:intern.isDeleted}
        return res.status(201).send({status: true ,data :intern1});
    } catch (err) {

        return res.status(500).send({ status: false, message: err.message })
    }

}




module.exports = { createIntern }

