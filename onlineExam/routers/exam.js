var express=require("express");
var router=express.Router();
var Teacher=require("../models/Teacher");
var Catalog=require("../models/Catalog");
var Question=require("../models/Question");
var Subject=require("../models/Subject");
var Exam=require("../models/Exam");
var TestQuestion=require("../models/TestQuestion");

//试卷首页，显示所有的试卷信息
router.get("/",function (req,res,next) {
    var limit=20;
    var page=Number(req.query.page || 1);
    var pages;
    Exam.count().then(function (count) {
        pages=Math.ceil(count/limit);//总页数
        //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(1,page);
        Exam.find().limit(limit).skip((page-1)*limit).populate(['teacher','subject'])
            .sort({_id:-1}).then(function (contents) {
            res.render("teacher/exam/index",{
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
//手动组卷入口
router.get("/handPaper",function (req,res,next) {
    Subject.find().then(function (contents) {
        res.render("teacher/exam/handAdd",{
            userInfo:req.userInfo,
            contents:contents
        });
    });
});
//手动组卷内容保存
router.post("/handPaper",function (req,res,next) {
   Exam.findOne({title:req.body.title}).then(function (result) {
       //数据库中存在相同名字的考试
       if(result){
           res.render("teacher/error",{
               userInfo:req.userInfo,
               message:"考试名称已经存在了",
               url:"/teacher/exam"
           });
           return Promise.reject();
       }else{
           return new Exam({
               title:req.body.title,
               startTime:new Date(req.body.startTime),
               endTime:new Date(req.body.endTime),
               sumScore:Number(req.body.sumScore),
               numOfQuestions:Number(req.body.question.length),
               description:req.body.description,
               subject:req.body.subject,
               teacher:req.userInfo._id.toString(),
           }).save();
       }
   }).then(function (newExam) {
       var questions=req.body.question;
       for(var i=0;i<questions.length;i++){
           (function(i) {
               Question.findOne({index:Number(questions[i])}).then(function (nowQuestion) {
                   if(nowQuestion){
                       var testQuestion=new TestQuestion({
                           exam:newExam._id.toString(),
                           question:nowQuestion._id.toString(),
                           index:i+1
                       });
                       testQuestion.save();
                   }
               });
           })(i);
       }
       res.render("teacher/success",{
           userInfo:req.userInfo,
           message:"添加成功",
           url:"/teacher/exam"
       });
   });
});

//自动组卷入口
router.get("/autoPaper",function (req,res,next) {
    Subject.find().then(function (contents) {
        Catalog.find().then(function (catelogs) {
            res.render("teacher/exam/autoAdd",{
                userInfo:req.userInfo,
                contents:contents,
                catelogs:catelogs
            });
        });
    });
});

//自动组卷内容保存
router.post("/autoPaper",function (req,res,next) {
    Exam.findOne({title:req.body.title}).then(function (result) {
        //数据库中存在相同名字的考试
        if(result){
            var response={};
            response.ok=false;
            response.data="已存在相同名字的考试";
            res.json(response);
            return Promise.reject();
        }else{
            return new Exam({
                title:req.body.title,
                startTime:new Date(req.body.startTime),
                endTime:new Date(req.body.endTime),
                sumScore:Number(req.body.sumScore),
                numOfQuestions:Number(req.body.question.length),
                description:req.body.description,
                subject:req.body.subject,
                teacher:req.userInfo._id.toString(),
                handPaper:false
            }).save();
        }
    }).then(function (newExam) {
        var questions=req.body.question;
        for(var i=0;i<questions.length;i++){
            (function(i) {
                Question.findOne({index:Number(questions[i])}).then(function (nowQuestion) {
                    if(nowQuestion){
                        var testQuestion=new TestQuestion({
                            exam:newExam._id.toString(),
                            question:nowQuestion._id.toString(),
                            index:i+1
                        });
                        testQuestion.save();
                    }
                });
            })(i);
        }
        var response={};
        response.ok=true;
        res.json(response);
    });
});
//展示试卷里面的题目信息
router.get("/view",function (req,res,next) {
   var id=req.query._id||"";
   if(id=="") return;
   Exam.findOne({_id:id}).populate(['teacher','subject']).then(function (result) {
       if(!result){
           res.render("teacher/error",{
               userInfo:req.userInfo,
               message:"不存在本次考试",
               url:"/teacher/exam"
           });
       }else{
               TestQuestion.find({exam:result._id}).populate(['question']).sort({index:1})
                   .then(function (questions) {
                  if(questions){
                      res.render("teacher/exam/view",{
                          userInfo:req.userInfo,
                          exam:result,
                          questions:questions
                      });
                  }
               });
       }
   });
});
//删除试卷
router.get("/delete",function (req,res,next) {
    var id=req.query._id||"";
    if(id=="") return;
    TestQuestion.find({exam:id}).then(function (results) {
        if(results){
            Exam.remove({_id:id}).then(function () {
            });
            for(var i=0;i<results.length;i++){
                TestQuestion.remove({_id:results[i]._id.toString()}).then(
                    function () {
                    });
            }
            var data={};
            data.code=0;
            data.message="删除成功";
            res.json(data);
        }else{
            var data={};
            data.code=1;
            data.message="不存在本次考试";
            res.json(data);
        }
    });
});
module.exports=router;