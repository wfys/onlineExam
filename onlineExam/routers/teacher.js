var express=require("express");
var router=express.Router();
var Student=require("../models/Student");
var Teacher=require("../models/Teacher");
var Catalog=require("../models/Catalog");
var Question=require("../models/Question");
var Exam=require("../models/Exam");
var ChooseTest=require("../models/ChooseTest");
var SubmitAnswer=require("../models/SubmitAnswer");
var TestQuestion=require("../models/TestQuestion");

router.use(function (req,res,next) {
    if(!req.userInfo.no){
        res.render("teacher/error",{
            userInfo:req.userInfo,
            message:"请点击右上角或点击下面链接进行登录",
            url:"/api/login"
        });
        return;
    }
    else if(req.userInfo.isStudent){
        //如果当前用户是非老师
        res.send("<h1>对不起，只有老师才能进入后台管理!</h1>");
        return;
    }
    next();
});

//根据不同的功能划分模块
router.use("/subject",require("./course"));  //科目模块
router.use("/choice",require("./choice"));  //题目模块
router.use("/exam",require("./exam"));  //试卷模块

//后台管理首页
router.get("/",function (req,res,next) {
    res.render("teacher/index",{
        userInfo:req.userInfo
    });
});
//用户管理，显示所有的用户
router.get("/student",function (req,res,next) {
    //从数据库中读取所有数据
    //limit()限制数据的条数 ,skip()跳过（忽略）的条数
    var limit=20;
    var page=Number(req.query.page || 1);
    var pages;
    Student.count().then(function (count) {
        pages=Math.ceil(count/limit);//总页数
        //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(1,page);
        Student.find().limit(limit).skip((page-1)*limit).sort({no:1}).then(function (users) {
            res.render("teacher/student_index",{
                userInfo:req.userInfo,
                users:users,
                pages:pages,
                count:count,
                limit:limit,
                page:page
            });
        });
    });
});
//删除用户
router.get("/admin/student/delete",function (req,res,next) {
    if(!req.userInfo.isAdmin){
        return;
    }
    var id=req.query._id||"";
    if(id=="") return;
    Student.find({_id:id}).then(function (results) {
        if(results){
            Student.remove({_id:id}).then(function () {
                var data={};
                data.code=0;
                data.message="删除成功";
                res.json(data);
            });
        }else{
            var data={};
            data.code=1;
            data.message="不存在该学生";
            res.json(data);
        }
    });
});
//老师管理，显示所有的老师
router.get("/admin/teacher",function (req,res,next) {
    //从数据库中读取所有数据
    //limit()限制数据的条数 ,skip()跳过（忽略）的条数
    if(!req.userInfo.isAdmin){
        return;
    }
    var limit=20;
    var page=Number(req.query.page || 1);
    var pages;
    Teacher.count().then(function (count) {
        pages=Math.ceil(count/limit);//总页数
        //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(1,page);
        Teacher.find().limit(limit).skip((page-1)*limit).sort({no:1}).then(function (users) {
            res.render("teacher/teacher_index",{
                userInfo:req.userInfo,
                users:users,
                pages:pages,
                count:count,
                limit:limit,
                page:page
            });
        });
    });
});
//删除老师
router.get("/admin/teacher/delete",function (req,res,next) {
    if(!req.userInfo.isAdmin){
        return;
    }
    var id=req.query._id||"";
    if(id=="") return;
    Teacher.find({_id:id}).then(function (results) {
        if(results){
            Teacher.remove({_id:id}).then(function () {
                var data={};
                data.code=0;
                data.message="删除成功";
                res.json(data);
            });
        }else{
            var data={};
            data.code=1;
            data.message="不存在该老师";
            res.json(data);
        }
    });
});
//添加老师
router.get("/admin/teacher/add",function (req,res,next) {
    if(!req.userInfo.isAdmin){
        return;
    }
    res.render("teacher/teacher_register",{
        userInfo:req.userInfo
    });
});
//添加老师保存
router.post("/admin/teacher/add",function (req,res,next) {
    Teacher.findOne({
        no:req.body.noInput
    }).then(function (teacherInfo) {
        if(teacherInfo){
            res.render("student/error",{
                userInfo:req.userInfo,
                message:"工号已被注册，如有问题请联系管理员",
                url:"/teacher/admin/teacher"
            });
        }else {
            var teachers=new Teacher({
                no:req.body.noInput,
                name:req.body.usernameInput,
                password:req.body.passwordInput,
                school:req.body.schoolInput,
                email:req.body.emailInput,
                phone:req.body.phoneInput,
            });
            teachers.save();
            res.render("student/success",{
                userInfo:req.userInfo,
                message:"注册成功",
                url:"/teacher/admin/teacher"
            });
        }
    });
});
//查看试卷
router.get("/score",function (req,res,next) {
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
            res.render("teacher/score/index",{
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
//展示某次考试里面的所有学生排名
router.get("/score/see",function (req,res,next) {
    var limit=20;
    var page=Number(req.query.page || 1);
    var pages;
    var id=req.query._id||"";
    if(id=="") return;
    var where={
        exam:id
    }; //读取条件
    ChooseTest.where(where).count().then(function (count) {
        pages=Math.ceil(count/limit);//总页数
        //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(1,page);
        ChooseTest.where(where).find().limit(limit).skip((page-1)*limit).populate(['student'])
            .sort({score:-1}).then(function (contents) {
                Exam.findOne({_id:id}).then(function (result) {
                    res.render("teacher/score/see",{
                        userInfo:req.userInfo,
                        contents:contents,
                        pages:pages,
                        count:count,
                        limit:limit,
                        page:page,
                        topic:result
                    });
                });
            });
    });
});

//展示需要批改的试卷
router.get("/score/correct",function (req,res,next) {
    var limit=20;
    var page=Number(req.query.page || 1);
    var pages;
    var where={
        state:2
    }; //读取条件
    ChooseTest.where(where).count().then(function (count) {
        pages=Math.ceil(count/limit);//总页数
        //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(1,page);
        ChooseTest.where(where).find().limit(limit).skip((page-1)*limit)
            .populate(['student','exam']).sort({id:-1}).then(function (contents) {
                res.render("teacher/score/correct",{
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

//批改试卷
router.get("/score/edit",function (req,res,next) {
    var id=req.query.ea||"";
    var ct=req.query.ct||"";
    if(id=="") return;
    Exam.findOne({_id:id}).populate(['teacher','subject']).then(function (result) {
        if(!result){
            res.render("teacher/error",{
                userInfo:req.userInfo,
                message:"考试不存在",
                url:"/teacher/score/correct"
            });
        }else{
            SubmitAnswer.find({chooseTest:ct,correct:false}).sort({index:1})
                .then(function (knows) {
                    TestQuestion.find({exam:result._id}).sort({index:1})
                        .populate(['question']).then(function (questions) {
                        var contents=[];
                        for(var i=0;i<knows.length;i++){
                            for(var j=0;j<questions.length;j++){
                                if(knows[i].index==questions[j].index){
                                    contents.push(questions[j]);
                                    break;
                                }
                            }
                        }
                        res.render("teacher/score/edit",{
                            userInfo:req.userInfo,
                            questions:contents,
                            exam:result,
                            ct:ct
                        });
                    });

            });
        }
    });
});
module.exports=router;