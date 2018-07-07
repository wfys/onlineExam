var mongoose = require('mongoose');


module.exports=new mongoose.Schema({
    title:{
        type:String,
        default:""
    },
    startTime:{
        type:Date,
        default:new Date()
    },
    endTime:{
        type:Date,
        default:new Date()
    },
    sumScore:{
        type:Number,
        default:""
    },
    numOfQuestions:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        default:""
    },
    handPaper:{
        type:Boolean,
        default:true
    },
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject"
    },

    teacher:{
        type:mongoose.Schema.Types.ObjectId,

        ref:"Teacher"
    }
});