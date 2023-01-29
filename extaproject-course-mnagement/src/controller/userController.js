const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken');
const encryption  = require('encryptjs');

const createUser = async (req,res)=>{
    try{
        let {name,email,password,role} = req.body;

        if(!name||name.trim()=="") return res.status(400).send({status:false,message:"name is required"});
        if(typeof(name)!='string'||!name.match(/^([a-z A-Z 0-9 -]){2,50}$/)) res.status(400).send({status:false,message:"wrong name format"}); 

        if(!email||email=="") return res.status(400).send({status:false,message:"email is required"});
        if(typeof(email)!='string'||!email.match(/^[a-zA-z0-9]{6,15}.+\@.+\..+/)) res.status(400).send({status:false,message:"wrong email format"});

        if(!password) return res.status(400).send({status:false,message:"password is required"});
        if (typeof (password) !== "string") return res.status(400).send({ status: false, message: "wrong format of password" })
        if (!password.match(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/)) return res.status(400).send({ status: false, message: "length of password should be 8 to 15 characters rejecting edge spaces" })
        password = encryption.encrypt(password,"secret string",256)

        if(!role||role=="employee"){
             req.body.role = "employee"
            req.body.rewards = 0
            }
            if(req.body.role!="employee"){
                if(req.body.rewards) delete(req.body['rewards'])
            }
        if(!["admin","super admin","employee"].includes(req.body.role)) return res.status(400).send({status:false,message:"no such role"});

        let unique = await userModel.findOne({email:email});
        if(unique) return res.status(400).send({status:false,message:"email already in use"});

        let user = await userModel.create(req.body);
        return res.status(201).send({status:true,data:user});

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

const userLogin = async (req,res)=>{
    try{
        let {email,password} = req.body

        if(!email) return res.status(400).send({status:false,message:"email is mandetory"})
        if(typeof(email) !== "string") return res.status(400).send({status:false,message:"wrong format of email"})
        if(!email.match(/^[a-zA-z0-9]{6,15}.+\@.+\..+/)) return res.status(400).send({status:false,message:"invalid email address"})
        
        if(!password) return res.status(400).send({status:false,message:"password is mandetory"})

        if(Object.keys(req.body).length!=2) return res.status(400).send({status:false,message:"only email and password is required"})

        const user = await userModel.findOne({email:email})
        if(!user) return res.status(401).send({status:false,message:"wrong email or password"})

        if(password != encryption.decrypt(user.password,"secret string",256)) return res.status(401).send({status:false,message:"wrong email or password"})

        let token = jwt.sign({role:user.role,userId:user._id},"very secret string",{expiresIn:"2m"})

        res.status(200).send({status:true,message:"success",data:token})

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}


module.exports = {createUser,userLogin}
