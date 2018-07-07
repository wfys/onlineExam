var mongoose = require('mongoose');


module.exports=new mongoose.Schema({
    name:String,

    teacher:{
        type:mongoose.Schema.Types.ObjectId,

        ref:"Teacher"
    }
});