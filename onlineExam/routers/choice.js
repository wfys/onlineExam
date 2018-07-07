var express=require("express");
var router=express.Router();
var Teacher=require("../models/Teacher");
var Catalog=require("../models/Catalog");
var Question=require("../models/Question");

//题库首页，展示所有题库列表
router.get("/",function (req,res,next) {
    var limit=20;
    var page=Number(req.query.page || 1);
    var pages;
    Catalog.count().then(function (count) {
        pages=Math.ceil(count/limit);//总页数
        //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(1,page);
        Catalog.find().limit(limit).skip((page-1)*limit).populate(['teacher'])
            .sort({createTime:-1}).then(function (contents) {
            res.render("teacher/choice_index",{
                userInfo:req.userInfo,
                contents:contents,
                pages:pages,
                count:count,
                limit:limit,
                page:page
            });
        });
    });
});
//所有题目，展示所有题目
router.get("/allQuestion",function (req,res,next) {
    var limit=20;
    var page=Number(req.query.page || 1);
    var pages;
    Question.count().then(function (count) {
        pages=Math.ceil(count/limit);//总页数
        //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(1,page);
        Question.find().limit(limit).skip((page-1)*limit).populate(['catalog'])
            .then(function (contents) {
                    res.render("teacher/choice_see",{
                        userInfo:req.userInfo,
                        contents:contents,
                        pages:pages,
                        count:count,
                        limit:limit,
                        page:page
                    });
            });
    });
});
//题库目录添加
router.get("/catalogAdd",function (req,res,next) {
    res.render("teacher/choice_catalogAdd",{
        userInfo:req.userInfo
    });
});
//题库目录添加的保存
router.post("/catalogAdd",function (req,res,next) {
    var name=req.body.name||"";
    if(name==""){
        res.render("teacher/error",{
            userInfo:req.userInfo,
            message:"目录名称不能为空",
            url:"/teacher/choice/catalogAdd"
        });
        return;
    }
    Catalog.findOne({name:name}).then(function (result) {
        //数据库已经存在相同的名字
        if(result){
            res.render("teacher/error",{
                userInfo:req.userInfo,
                message:"目录名称已经存在了",
                url:"/teacher/choice/catalogAdd"
            });
            return Promise.reject();
        }else{
            //数据库中不存在相同的名字
            return new Catalog({
                name:name,
                style:req.body.style,
                teacher:req.userInfo._id.toString(),
                createTime:new Date()
            }).save();
        }
    }).then(function (newCatalog) {
        res.render("teacher/success",{
            userInfo:req.userInfo,
            message:"添加目录成功",
            url:"/teacher/choice"
        });
    });
});

//题库题目添加
router.get("/questionAdd",function (req,res,next) {
    var where={}; //读取条件
    var catalog=req.query._id||"";
    if(catalog=="") return;
    Catalog.findOne({_id:catalog}).then(function (result) {
       if(result){
           if(result.style=="essay"){
               res.render("teacher/essay_questionAdd",{
                   userInfo:req.userInfo,
                   catalog:result
               });
           }else{
               res.render("teacher/choice_questionAdd",{
                   userInfo:req.userInfo,
                   catalog:result
               });
           }
       }else {
           res.render("teacher/error",{
               userInfo:req.userInfo,
               message:"目录名称不存在",
               url:"/teacher/choice"
           });
       }
    });
});
//题库题目添加保存
router.post("/questionAdd",function (req,res,next) {
    if(req.body.style=="essay"){
        Catalog.findOne({_id:req.body.catalog}).then(function (result) {
            result.number++;
            return result.save();
        }).then(function (newResult) {
            Question.count().then(function (count) {
               var question=new Question({
                   index:count+1,
                   catalog:req.body.catalog,
                   title:req.body.title,
                   answer:req.body.answer,
                   score:Number(req.body.score),
                   center:req.body.center,
                   difficulty:req.body.difficulty,
                   createTime:new Date(),
                   style:req.body.style
               });
               return question.save();
            });
        }).then(function (newQuestion) {
            console.log(newQuestion);
            res.render("teacher/success",{
                userInfo:req.userInfo,
                message:"添加题目成功",
                url:"/teacher/choice"
            });
        })
    }else{
        var options=[];
        var option=req.body.option;
        var word=["A","B","C","D","E","F","G","H"];
        for(var i=0;i<option.length;i++){
            var optionData={
                name:word[i],
                info:option[i]
            };
            options.push(optionData);
        }
        Catalog.findOne({_id:req.body.catalog}).then(function (result) {
            result.number++;
            return result.save();
        }).then(function (newResult) {
            Question.count().then(function (count) {
                var question=new Question({
                    index:count+1,
                    catalog:req.body.catalog,
                    title:req.body.title,
                    answer:req.body.answer,
                    options:options,
                    score:Number(req.body.score),
                    center:req.body.center,
                    difficulty:req.body.difficulty,
                    createTime:new Date(),
                    style:req.body.style
                });
                return question.save();
            });
        }).then(function (newQuestion) {
            res.render("teacher/success",{
                userInfo:req.userInfo,
                message:"添加题目成功",
                url:"/teacher/choice"
            });
        });
    }
});
//展示某个题库里面的所有题目
router.get("/see",function (req,res,next) {
    var limit=20;
    var page=Number(req.query.page || 1);
    var pages;
    var catalog=req.query.catalog||"";
    if(catalog=="") return;
    var where={
        catalog:catalog
    }; //读取条件
    Question.where(where).count().then(function (count) {
        pages=Math.ceil(count/limit);//总页数
        //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(1,page);
        Question.where(where).find().limit(limit).skip((page-1)*limit).populate(['catalog'])
            .then(function (contents) {
                Catalog.findOne({_id:catalog}).then(function (result) {
                    res.render("teacher/choice_see",{
                        userInfo:req.userInfo,
                        contents:contents,
                        pages:pages,
                        count:count,
                        limit:limit,
                        page:page,
                        topic:result,
                        num:1
                    });
                });
            });
    });
});

//展示某个题目的具体内容
router.get("/view",function (req,res,next) {
    var id=req.query.id||"";
    if(id=="") return;
    Question.findOne({_id:id}).then(function (result) {
        if(!result){
            res.render("teacher/error",{
                userInfo:req.userInfo,
                message:"不存在该题",
                url:"/teacher/single"
            });
        }else{
            if(result.style!="essay"){
                res.render("teacher/choice_view",{
                    userInfo:req.userInfo,
                    content:result
                });
            }else {
                res.render("teacher/essay_view",{
                    userInfo:req.userInfo,
                    content:result
                });
            }
        }
    });
});

module.exports=router;