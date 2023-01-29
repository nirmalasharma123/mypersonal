const jwt = require('jsonwebtoken');


const authenticate = function(req,res,next){
    try{
        let token = req.headers['x-api-key']
        if(!token) return res.status(400).send({status:false,message:"missing mandatory header"});

        const varify = jwt.varify(token,"very secret string",(err,decodedToken)=>{
            if(decodedToken){
                req.role = varify.role;
                req.userId = varify.userId;
                next()
            }else{
                res.status(401).send({status:false,message:err.message})
            }
        })

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}



module.exports ={authenticate}
