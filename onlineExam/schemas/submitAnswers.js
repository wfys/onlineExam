var mongoose = require('mongoose');


module.exports=new mongoose.Schema({
    chooseTest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ChooseTest"
    },
    submit:{
        type:String,
        default:''
    },
    correct:{
        type:Boolean,
        default:false
    },
    index:{
        type:Number,
        default:0
    },
    score:{
        type:Number,
        default:0
    }
});