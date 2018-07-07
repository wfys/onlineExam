var mongoose = require('mongoose');
var teachersSchemas=require("../schemas/teachers");

module.exports=mongoose.model("Teacher",teachersSchemas);   //老师模型类