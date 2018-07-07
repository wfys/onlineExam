var mongoose = require('mongoose');


module.exports=new mongoose.Schema({
    name:{
        type:String,
        default:""
    },

    style:{
        type:String,
        default:""
    },

    teacher:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Teacher"
    },

    createTime:{
        type:Date,
        default:new Date()
    },

    views:{
        type:Number,
        default:0
    },

    number:{
        type:Number,
        default:0
    }
});