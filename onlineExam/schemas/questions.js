var mongoose = require('mongoose');


module.exports=new mongoose.Schema({

    index:{
        type:Number,
        default:0
    },
    title:{
        type:String,
        default:""
    },
    answer:{
        type:String,
        default:""
    },
    options:{
        type:Array,
        default:[]
    },
    score:{
        type:Number,
        default:0
    },
    center:{
        type:String,
        default:""
    },
    difficulty:{
        type:String,
        default:""
    },

    style:{
        type:String,
        default:""
    },

    catalog:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Catalog"
    },

    createTime:{
        type:Date,
        default:new Date()
    }
});