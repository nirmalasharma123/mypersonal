const express = require('express');
const router = express.Router();


const adminController = require("../controller/adminController");
const superAdminController = require("../controller/speradminController");
const employeeController = require("../controller/employController");
const userController = require("../controller/userController");

const midware = require("../middleWare/middleware")

//user
router.post('/createUser', userController.createUser)
router.post('/logIn', userController.userLogin )

//admin
router.post('/createCourse',  midware.authenticate, adminController.createCourse);
router.put('/updateCourse',midware.authenticate, adminController.updateCourse);
router.delete('/deleteCourse',midware.authenticate, adminController.deleteCourse);

//super admin
router.get('/getCourses',midware.authenticate, superAdminController.courses);
router.put('/approveCourses',midware.authenticate, superAdminController.approval);

//employee
router.get('/activeCourses',midware.authenticate, employeeController.viweCourses)


module.exports = router
