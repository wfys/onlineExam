var mongoose = require('mongoose');
var catalogsSchemas=require("../schemas/catalogs");

module.exports=mongoose.model("Catalog",catalogsSchemas);   //目录模型类