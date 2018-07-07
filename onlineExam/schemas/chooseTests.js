var mongoose = require('mongoose');


module.exports=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    exam:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam"
    },
    score:{
        type:Number,
        default:0
    },
    state:{
        type:Number,
        default:1
    }
});