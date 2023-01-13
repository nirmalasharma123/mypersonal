const collegeModel = require('../Model/collegeModel');
const internModel = require('../Model/intern');
const validator = require('validator');

const createCollege = async function (req, res) {
    try {

        const body = req.body;
        if (Object.keys(body).length != 0) {
           
            if(typeof req.body.fullName != "string" || typeof req.body.name != "string" ||typeof req.body.logoLink != "string" ){
                return res.status(400).send({status:false,message:"Enter valid information in String " })
            }
            if (!req.body.name.trim() || !req.body.fullName.trim() || !req.body.logoLink.trim()) {
                return res.status(400).send({ status: false, message: "Please fill all the mandatory fields..eg: name,fullName,logoLink" });
            };
            req.body.name = req.body.name.trim();
            req.body.fullName = req.body.fullName.trim().toLowerCase();
            req.body.logoLink = req.body.logoLink.trim();// 
            if (!validator.isAlphanumeric(req.body.name, "en-US", { ignore: '-' })) return res.status(400).send({ status: false, message: "Please give valid  name" });
            
            if(validator.isNumeric(req.body.name)) return res.status(400).send({ status: false, message: "Please give valid  name eg: 'xyz-35' " });

            if (!validator.isAlpha(req.body.fullName.split(' ').join(''))) return res.status(400).send({ status: false, message: "Please give valid college name" });

            let link = req.body.logoLink.substring(0, 8);//https://
            let link1 = req.body.logoLink.substring(0, 7);//"http://
            let url = "https://";
            let url1 = "http://";
            let png = req.body.logoLink.substring(req.body.logoLink.length - 4);
            let jpeg = req.body.logoLink.substring(req.body.logoLink.length - 5);
            let png1 = ".png";
            let png2 = ".jpg";
            let jpeg1 = ".jpeg";
            
            if ((link == url || link1 == url1) && (png == png1 || png == png2 || jpeg == jpeg1)) {

                const dublicate = await collegeModel.find({ $or: [{ name: req.body.name }, { fullName: req.body.fullName }] })
                if (dublicate.length != 0) return res.status(400).send({ status: false, message: "College Id or college is already in use !! Please use different name." })
                const college = await collegeModel.create(body);
                let collegeDetail={name:college.name , fullName:college.fullName, logoLink:college.logoLink ,isDeleted:college.isDeleted}
                return res.status(201).send({ status: true, Data: collegeDetail});
            } else {
                return res.status(400).send({ status: false, message: "Invalid LogoLink.." });
            }
        } else {
            return res.status(400).send({ status: false, message: "Please input something ..." });
        }


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
const getCollegeDetails = async function (req, res) {

    try{ 
     const collegeName = req.query.collegeName;
     if (typeof collegeName == 'undefined') return res.status(400).send({ status: false, message: "Input something " })
     if (collegeName.trim() == "") return res.status(400).send({ status: false, message: "College name can not be empty" })
     if (!validator.isAlphanumeric(collegeName, "en-US", { ignore: '-' })) return res.status(400).send({ status: false, message: "Invalid college name " })
     const checkCollege = await collegeModel.findOne({ name: collegeName ,isDeleted:false });
     if (!checkCollege) return res.status(400).send({ status: false, message: "No college exists with this college name or deleted !! " });
     const { name, fullName, logoLink } = checkCollege;
     const newData = { name: name, fullName: fullName, logoLink: logoLink };
     const collegeId = checkCollege._id;
     const intern = await internModel.find({ collegeId: collegeId ,isDeleted:false }).select({name:1,email:1,mobile:1,isDeleted:1,_id:1});
     newData.interns = intern;
     // if(intern.length ==0)  newData.interns="No intern from this college";
 
     return res.status(200).send({ data: newData });
 }catch(err){
     res.status(500).send({status:false , message: err.message});
 }
 
 
 }


module.exports = { createCollege ,getCollegeDetails}

