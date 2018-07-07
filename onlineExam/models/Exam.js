var mongoose = require('mongoose');
var examsSchemas=require("../schemas/exams");

module.exports=mongoose.model("Exam",examsSchemas);   //试卷模型类