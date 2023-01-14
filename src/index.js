const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser = require('body-parser')
const route=require("./routes/route")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect('mongodb+srv://Vishanksingh:7997@cluster0.ga4iiwd.mongodb.net/Ankush1234-DB?retryWrites=true&w=majority',{
    useNewUrlParser:true
}).then(()=>{
    console.log("mongo is connected")
}).catch((error)=>{
    console.log(error)
})



app.use('/',route)
app.listen(3002,()=>{
    console.log("express is running on port 3002")
})