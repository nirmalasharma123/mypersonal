const express=require('express');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const app= express();
const route=require('./routes/route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));//http data in packets => for wrapping it we use urlleancoded
mongoose.connect('mongodb+srv://Pal25:Pallavi2552@cluster0.hihf8kq.mongodb.net/group22Database',{useNewUrlParser :true})
.then(function(){
    console.log("Database Connected...")
})
.catch(err => console.log(err))
app.use('/',route);

app.listen(3001,function() {
    console.log("express is running on port 3001")
}
)
