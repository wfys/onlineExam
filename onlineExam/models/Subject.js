var mongoose = require('mongoose');
var subjectSchemas=require("../schemas/subjects");

module.exports=mongoose.model("Subject",subjectSchemas);   //科目模型类