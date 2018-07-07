var mongoose = require('mongoose');
var chooseTestsSchemas=require("../schemas/chooseTests");

module.exports=mongoose.model("ChooseTest",chooseTestsSchemas);   //试卷选题模型类