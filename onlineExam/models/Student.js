var mongoose = require('mongoose');
var studentsSchemas=require("../schemas/students");

module.exports=mongoose.model("Student",studentsSchemas);   //学生模型类