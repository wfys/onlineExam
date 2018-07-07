var mongoose = require('mongoose');
var submitAnswersSchemas=require("../schemas/submitAnswers");

module.exports=mongoose.model("SubmitAnswer",submitAnswersSchemas);   //答题模型类