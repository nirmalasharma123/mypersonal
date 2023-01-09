const collegeModel = require('../Model/collegeModel');
const internModel = require('../Model/intern');
const createIntern = async function (req, res) {
    const newData = {};
    const { name, email, mobile } = req.body;
    if (name) {
        newData.name = name;
    };
    if (email) {
        newData.email = email;
    };
    if (mobile) {
        newData.mobile = mobile;
    };
    const collegeName = req.body.collegeName;
    const CollegeId = await collegeModel.findOne({ name: collegeName }).select({ _id: 1 });
    newData.collegeId = CollegeId;
    const intern = await internModel.create(newData);
    return res.status(200).send(intern);

}

const getCollegeDetails = async function (req, res) {
    const collegeName = req.query.collegeName;//college name

    const checkCollege = await collegeModel.findOne({ name: collegeName });
    const { name, fullName, logoLink } = checkCollege;
    const newData = { name: name, fullName: fullName, logoLink: logoLink };
    const collegeId = checkCollege._id;
    const intern = await internModel.find({ collegeId: collegeId });

    newData.interns = intern;

    console.log(newData)

    return res.status(200).send({ data: newData });

}



module.exports = { createIntern, getCollegeDetails }

