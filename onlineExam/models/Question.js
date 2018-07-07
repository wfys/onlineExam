var mongoose = require('mongoose');
var questionsSchemas=require("../schemas/questions");

module.exports=mongoose.model("Question",questionsSchemas);   //问题模型类