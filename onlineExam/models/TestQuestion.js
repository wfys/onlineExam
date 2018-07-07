var mongoose = require('mongoose');
var testQuestionsSchemas=require("../schemas/testQuestions");

module.exports=mongoose.model("TestQuestion",testQuestionsSchemas);   //试卷选题模型类