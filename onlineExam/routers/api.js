var express=require("express");
var router=express.Router();
var Student=require("../models/Student");
var Teacher=require("../models/Teacher");
var Question=require("../models/Question");
var Exam=require("../models/Exam");
var TestQuestion=require("../models/TestQuestion");
var SubmitAnswer=require("../models/SubmitAnswer");
var ChooseTest=require("../models/ChooseTest");
var sendMail=require("../public/js/email/mail");


router.get("/login",function (req,res,next) {
    res.render("student/login");
});

router.post("/login",function (req,res,next) {
    if(req.body.identity=='学生'){
        Student.findOne({
            no:req.body.noInput,
            password:req.body.passwordInput
        }).then(function (studentInfo) {
            if(!studentInfo){
                res.render("student/error",{
                    userInfo:req.userInfo,
                    message:"账号和密码不匹配",
                    url:"/api/login"
                });
                return Promise.reject();
            }else{
                var ipAddress;
                ipAddress=req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress; //获取ip地址
                studentInfo.ipAddress=ipAddress;
                studentInfo.status="landing";
                return studentInfo.save();
            }
        }).then(function (newStudent) {
            var info=JSON.stringify({
                _id:newStudent._id,
                no:newStudent.no,
                isStudent:true
            });
            req.cookies.set("userInfo",info);
            res.render("student/success",{
                userInfo:req.userInfo,
                message:"登录成功",
                url:"/"
            });
            return;
        });
    }else{
        Teacher.findOne({
            no:req.body.noInput,
            password:req.body.passwordInput
        }).then(function (teacherInfo) {
            if(!teacherInfo){
                res.render("student/error",{
                    userInfo:req.userInfo,
                    message:"账号和密码不匹配",
                    url:"/api/login"
                });
                return;
            }else{
                var info=JSON.stringify({
                    _id:teacherInfo._id,
                    no:teacherInfo.no,
                    isStudent:false
                });
                req.cookies.set("userInfo",info);
                res.render("student/success",{
                    userInfo:req.userInfo,
                    message:"登录成功",
                    url:"/"
                });
                return;
            }
        });
    }

});

router.get("/register",function (req,res,next) {
    res.render("student/register");
});

router.post("/register",function (req,res,next) {
    Student.findOne({
        no:req.body.noInput
    }).then(function (studentInfo) {
        if(studentInfo){
            res.render("student/error",{
                userInfo:req.userInfo,
                message:"学号已被注册，如有问题请联系自己的老师",
                url:"/api/register"
            });
        }else {
            var students=new Student({
                no:req.body.noInput,
                name:req.body.usernameInput,
                password:req.body.passwordInput,
                school:req.body.schoolInput,
                email:req.body.emailInput,
                phone:req.body.phoneInput
            });
            students.save();
            res.render("student/success",{
                userInfo:req.userInfo,
                message:"注册成功",
                url:"/"
            });
        }
    });
});


router.post("/forgetPassword",function (req,res,next) {
    if(req.body.identity=='学生'){
        Student.findOne({
            no:req.body.no
        }).then(function (studentInfo) {
            if (!studentInfo) {
                var data = {};
                data.code = 1;
                data.message = "不存在此账户"
                res.json(data);
                return Promise.reject();
            } else {
                var message="Hi "+studentInfo.name+",你的密码为："+studentInfo.password;
                sendMail(studentInfo.email,'找回密码', message);
                var data = {};
                data.code = 0;
                data.message = "不存在此账户"
                res.json(data);
            }
        });
    }else if(req.body.identity=='老师'){
        Teacher.findOne({
            no:req.body.no
        }).then(function (studentInfo) {
            if (!studentInfo) {
                var data = {};
                data.code = 1;
                data.message = "不存在此账户"
                res.json(data);
                return Promise.reject();
            } else {
                var message="Hi "+studentInfo.name+",你的密码为："+studentInfo.password;
                sendMail(studentInfo.email,'找回密码', message);
                var data = {};
                data.code = 0;
                data.message = "不存在此账户"
                res.json(data);
            }
        });
    }
});
//退出
router.get("/logout",function (req,res,next) {
    if(req.userInfo.isStudent){
        Student.update({
            no:req.userInfo.no
        },{
            status:"offline"
        });
    }
    req.cookies.set("userInfo",null);
    var data={};
    data.code=0;
    res.json(data);
});
//个人信息
router.get("/userInfo",function (req,res,next) {
    if(req.userInfo.isStudent){
        Student.findOne({
            no:req.userInfo.no
        }).then(function (studentInfo) {
            if(studentInfo){
                res.render("student/userInfo",{
                    userInfo:req.userInfo,
                    info:studentInfo
                });
            }else{
                res.render("student/error",{
                    userInfo:req.userInfo,
                    message:"该用户不存在",
                    url:"/"
                });
            }
        });
    }else {
        Teacher.findOne({
            no:req.userInfo.no
        }).then(function (teacherInfo) {
            if(teacherInfo){
                res.render("student/userInfo",{
                    userInfo:req.userInfo,
                    info:teacherInfo
                });
            }else{
                res.render("student/error",{
                    userInfo:req.userInfo,
                    message:"该用户不存在",
                    url:"/"
                });
            }
        });
    }
});
//信息修改
router.get("/userEdit",function (req,res,next) {
    if(req.userInfo.isStudent){
        Student.findOne({
            no:req.userInfo.no
        }).then(function (studentInfo) {
            if(studentInfo){
                res.render("student/userEdit",{
                    userInfo:req.userInfo,
                    info:studentInfo
                });
            }else{
                res.render("student/error",{
                    userInfo:req.userInfo,
                    message:"该用户不存在",
                    url:"/"
                });
            }
        });
    }else {
        Teacher.findOne({
            no:req.userInfo.no
        }).then(function (teacherInfo) {
            if(teacherInfo){
                res.render("student/userEdit",{
                    userInfo:req.userInfo,
                    info:teacherInfo
                });
            }else{
                res.render("student/error",{
                    userInfo:req.userInfo,
                    message:"该用户不存在",
                    url:"/"
                });
            }
        });
    }
});
//保存信息修改
router.post("/userEdit",function (req,res,next) {
    if(req.userInfo.isStudent){
        Student.update({
            no:req.userInfo.no
        },{
            name:req.body.usernameInput,
            password:req.body.passwordInput,
            school:req.body.schoolInput,
            phone:req.body.phoneInput
        }).then(function (result) {
            res.render("student/success",{
                userInfo:req.userInfo,
                message:"修改成功",
                url:"/"
            });
        });
    }else{
        Teacher.update({
            no:req.userInfo.no
        },{
            name:req.body.usernameInput,
            password:req.body.passwordInput,
            school:req.body.schoolInput,
            phone:req.body.phoneInput
        }).then(function (result) {
            res.render("student/success", {
                userInfo: req.userInfo,
                message: "修改成功",
                url: "/"
            });
        });
    }
});
//获取所有的题目信息
router.post("/getAllQuestion",function (req,res,next) {
    Question.find().populate(['catalog']).then(function (result) {
        var response={};
        response.data=result;
        res.json(response);
    });
});
//获取某次考试的题目信息
router.post("/getQuestion",function (req,res,next) {
    var id=req.body.id||"";
    if(id=="") return;
    ChooseTest.findOne({student:req.userInfo._id,exam:id}).then(function (chooses) {
        if(chooses&&chooses.state==1){  //已经开始考试了，但离线了
            SubmitAnswer.find({chooseTest:chooses._id}).sort({index:1}).then(function (answer) {
                TestQuestion.find({exam:id}).populate(['question'])
                    .sort({index:1}).then(function (questions) {
                    var response={};
                    response.data=questions;
                    response.answer=answer;
                    res.json(response);
                });
            });
            return Promise.reject();

        }
        else if(!chooses){  //第一次进入考试
            return new ChooseTest({
                student:req.userInfo._id.toString(),
                exam:id
            }).save();
        }
    }).then(function (newChoose) {
        TestQuestion.find({exam:id}).populate(['question'])
            .sort({index:1}).then(function (questions) {
            for(var i=0;i<questions.length;i++){
                (function(i) {
                    var submitAnswer=new SubmitAnswer({
                        chooseTest:newChoose._id.toString(),
                        index:i+1
                    });
                    submitAnswer.save();
                })(i);
            }
            var response={};
            response.data=questions;
            res.json(response);
        });
    })
});
//提交答案
router.post("/submitAnswer",function (req,res,next) {
    var id=req.body.exam||"";
    if(id=="") return;
    ChooseTest.findOne({student:req.userInfo._id,exam:id}).then(function (chooses) {
        if(chooses){
            SubmitAnswer.findOne({chooseTest:chooses._id, index:req.body.index})
                .then(function (answers) {
                if(answers){
                    if(answers.submit!=req.body.answer){
                        SubmitAnswer.update({
                            _id:answers._id
                        },{
                           submit:req.body.answer,
                            score:req.body.score,
                            correct:req.body.correct
                        }).then(function () {
                            var response={};
                            response.data=true;
                            res.json(response);
                        });
                    }
                }
                });
        }
    });
});

//获得自己某次考试的所有答案
router.post("/getAnswer",function (req,res,next) {
    var id=req.body.id||"";
    SubmitAnswer.find({chooseTest:id}).sort({index:1})
        .then(function (answers) {
            var response={};
            response.answer=answers;
            res.json(response);
        });
});

//获得某次考试单个的答案
router.post("/singleAnswer",function (req,res,next) {
    var id=req.body.id||"";
    var nums=[];
    nums=req.body.data;
    SubmitAnswer.find({chooseTest:id}).sort({index:1})
        .then(function (answers) {
            var response={};
            var data=[];
            for(var i=0;i<nums.length;i++){
                for(var j=0;j<answers.length;j++){
                    if(nums[i]==answers[j].index){
                        data.push(answers[j]);
                        break;
                    }
                }
            }
            response.answer=data;
            res.json(response);
        });
});

//老师批改
router.post("/changeAnswer",function (req,res,next) {
    var id=req.body.id||"";
    var data=req.body.data||'';
    var index=req.body.index||'';
    if(id=="") return;
    var allScore=0;
    for(var i=0;i<data.length;i++){
        allScore+=Number(data[i]);
    }
    ChooseTest.findOne({_id:id}).then(function (chooses) {
        if(chooses){
            SubmitAnswer.find({chooseTest:chooses._id}).sort({index:1})
                .then(function (answers) {
                    if(answers){
                        var key=0;
                        for(var i=0;i<answers.length;i++) {
                            if(answers[i].index==index[key]) {
                                (function(i) {
                                    SubmitAnswer.update({
                                        _id:answers[i]._id
                                    },{
                                        score:data[key],
                                        correct:true
                                    }).then(function () {
                                        var df=0;
                                    });
                                    key++;
                                })(i);
                            }
                        }
                        ChooseTest.update({
                            _id:chooses._id
                        },{
                            score:chooses.score+allScore,
                            state:3
                        }).then(function () {
                            var response={};
                            response.data=true;
                            res.json(response);
                        });
                    }else{
                        var response={};
                        response.data=false;
                        res.json(response);
                    }
                });
        }else{
            var response={};
            response.data=false;
            res.json(response);
        }
    });
});

module.exports=router;