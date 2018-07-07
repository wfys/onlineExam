var mongoose = require('mongoose');


module.exports=new mongoose.Schema({
    no:String,
    name:String,
    password:String,
    school:String,
    email:String,
    phone:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});