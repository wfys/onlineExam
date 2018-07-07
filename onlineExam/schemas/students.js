var mongoose = require('mongoose');


module.exports=new mongoose.Schema({
    no:String,
    name:String,
    password:String,
    school:String,
    email:String,
    phone:String,
    status:{
        type:String,
        default:"offline"
    },
    ipAddress:String
});