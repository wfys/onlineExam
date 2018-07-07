var express=require("express");
var router=express.Router();
var Subject=require("../models/Subject");
var Exam=require("../models/Exam");
var ChooseTest=require("../models/ChooseTest");
var SubmitAnswer=require("../models/SubmitAnswer");
var TestQuestion=require("../models/TestQuestion");

var data;
//处理通用数据
router.use(function (req,res,next) {
    data={
        userInfo:req.userInfo,
        subjects:[]
    };
    Subject.find().then(function (subjects) {
        data.subjects=subjects;
        next();
    });
});
//首页
router.get("/",function (req,res,next) {
    data.subject=req.query.subject||"";
    data.contents=[];
    data.limit=20;
    data.count=0;
    data.page=Number(req.query.page || 1);
    data.pages=0;
    var where={}; //读取条件
    if(data.subject){
        where.subject=data.subject
    }
    //读取所有分科考试
    Exam.where(where).count().then(function(count){
        data.count=count;
        data.pages=Math.ceil(data.count/data.limit);//总页数
        //取值不能超过pages
        data.page=Math.min(data.page,data.pages);
        //取值不能小于1
        data.page=Math.max(1,data.page);
        return Exam.where(where).find().limit(data.limit).skip((data.page-1)*data.limit)
            .populate(['teacher','subject']).sort({addTime:-1});
    }).then(function (contents) {
        data.contents=contents;
        res.render("student/index",data);
    });
});
//考试界面
router.get("/paper",function (req,res,next) {
    if(!req.userInfo.no){
        res.render("teacher/error",{
            userInfo:req.userInfo,
            message:"请点击右上角或点击下面链接进行登录，登录后才能考试",
            url:"/api/login"
        });
        return;
    }
    var id=req.query._id||"";
    if(id=="") return;
    Exam.findOne({_id:id}).populate(['teacher','subject']).then(function (content) {
        if(content){
            ChooseTest.findOne({student:req.userInfo._id,exam:id}).then(function (chooses) {
                if(chooses&&chooses.state!=1){
                    data.message="你已经交卷";
                    data.url="/";
                    res.render("student/error",data);
                }else{
                    data.exam=content;
                    res.render("student/exam/paper",data);
                }
            });
        }else{
            data.message="该考试不存在";
            data.url="/";
            res.render("student/error",data);
        }
    });
});
//等待考试
router.get("/paper/wait",function (req,res,next) {
    if(!req.userInfo.no){
        res.render("teacher/error",{
            userInfo:req.userInfo,
            message:"请点击右上角或点击下面链接进行登录,登录后才能考试",
            url:"/api/login"
        });
        return;
    }
    var id=req.query._id||"";
    if(id=="") return;
    Exam.findOne({_id:id}).populate(['teacher','subject']).then(function (content) {
        if(content){
            data.content=content;
            res.render("student/exam/waitExam",data);
        }else{
            data.message="该考试不存在";
            data.url="/";
            res.render("student/error",data);
        }
    });
});

//交卷
router.get("/handOver",function (req,res,next) {
    var id=req.query.exam||"";
    if(id=="") return;
    ChooseTest.findOne({student:req.userInfo._id,exam:id}).then(function (chooses) {
        if(chooses){
            var state=3;
            var allScore=0;
            SubmitAnswer.find({chooseTest:chooses._id})
                .then(function (answers) {
                    for(var i=0;i<answers.length;i++){
                        if(!answers[i].correct) state=2;
                        allScore+=answers[i].score;
                    }
                     return ChooseTest.update({
                        _id:chooses._id
                    },{
                        score:allScore,
                        state:state
                    }).then(function (newChooseText) {
                        data.state=state;
                        data.score=allScore;
                        Exam.findOne({_id:id}).then(function (content) {
                            data.content=content;
                            res.render("student/exam/endExam",data);
                        });
                    });
                });
        }
    });
});

//查看成绩
router.get("/score",function (req,res,next) {
    data.contents=[];
    data.limit=20;
    data.count=0;
    data.page=Number(req.query.page || 1);
    data.pages=0;
    ChooseTest.where({student:req.userInfo._id}).count().then(function (count) {
        data.pages=Math.ceil(count/data.limit);//总页数
        //取值不能超过pages
        data.page=Math.min(data.page,data.pages);
        //取值不能小于1
        data.page=Math.max(1,data.page);
        data.count=count;
        ChooseTest.where({student:req.userInfo._id}).find().limit(data.limit).
        skip((data.page-1)*data.limit).populate(['exam'])
            .sort({createTime:-1}).then(function (contents) {
                data.contents=contents;
            res.render("student/score/score_index",data);
        });
    });
});

//试卷详情
router.get("/score/view",function (req,res,next) {
    var id=req.query.ea||"";
    var ct=req.query.ct||"";
    if(id=="") return;
    Exam.findOne({_id:id}).populate(['teacher','subject']).then(function (result) {
        if(!result){
            data.message="该考试不存在";
            data.url="/";
            res.render("student/error",data);
        }else{
            TestQuestion.find({exam:result._id}).populate(['question']).sort({index:1})
                .then(function (questions) {
                    if(questions){
                        data.exam=result;
                        data.questions=questions;
                        data.ct=ct;
                        res.render("student/score/view",data);
                    }});
        }
    });
});


module.exports=router;

//cd /data/home/server/mongodb-linux-x86_64-3.0.7/
// --dbpath=/data/home/www/onlineExam/dbb  --port=27019   &
/*
#set for mongodb
export MONGODB_HOME=/data/home/server/mongodb-linux-x86_64-3.0.7/
export PATH=/data/home/server/mongodb-linux-x86_64-3.0.7/bin:$PATH
 */
