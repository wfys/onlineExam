var mongoose = require('mongoose');


module.exports=new mongoose.Schema({
    exam:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam"
    },
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question"
    },
    index:{
        type:Number,
        default:0
    }
});