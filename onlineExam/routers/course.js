var express=require("express");
var router=express.Router();
var Subject=require("../models/Subject");


//科目管理首页，展示所有的科目
router.get("/",function (req,res,next) {
    Subject.find().populate(['teacher']).then(function (contents) {
        res.render("teacher/subject/index",{
            userInfo:req.userInfo,
            contents:contents
        });
    });
});
//科目添加
router.get("/add",function (req,res,next) {
    Subject.count().then(function (count) {
       if(count<10){
           res.render("teacher/subject/add",{
               userInfo:req.userInfo
           });
       }else{
           res.render("teacher/error",{
               userInfo:req.userInfo,
               message:"科目上限为10，不能再添加了，如有需要，请联系管理员",
               url:"/teacher/subject"
           });
       }
    });
});
//科目添加保存
router.post("/add",function(req,res,next){
    var name=req.body.name||"";
    if(name==""){
        res.render("teacher/error",{
            userInfo:req.userInfo,
            message:"目录名称不能为空",
            url:"/teacher/subject"
        });
        return;
    }
    Subject.findOne({name:name}).then(function (result) {
        //数据库已经存在相同的名字
        if(result){
            res.render("teacher/error",{
                userInfo:req.userInfo,
                message:"目录名称已经存在了",
                url:"/teacher/subject"
            });
            return Promise.reject();
        }else{
            //数据库中不存在相同的名字
            return new Subject({
                name:name,
                teacher:req.userInfo._id.toString()
            }).save();
        }
    }).then(function (newCatalog) {
        res.render("teacher/success",{
            userInfo:req.userInfo,
            message:"添加目录成功",
            url:"/teacher/subject"
        });
    });
});
//科目名称修改
router.get("/edit",function (req,res,next) {
    //获取要修改的分类信息，并用表单表示出来
    var id=req.query.id||"";
    //获取要修改的分类信息
    Subject.findOne({
        _id:id
    }).then(function (subject) {
        if(!subject){
            res.render("teacher/error",{
                userInfo:req.userInfo,
                message:"分类信息不存在",
                url:"/teacher/subject"
            });
            return ;
        }else{
            res.render("teacher/subject/edit",{
                userInfo:req.userInfo,
                subject:subject
            });
        }
    });
});
//科目名称修改保存
router.post("/edit",function (req,res,next) {
    //获取要修改的分类信息，并用表单表示出来
    var id=req.query.id||"";
    var name=req.body.name||"";
    if(name==""){
        res.render("teacher/error",{
            userInfo:req.userInfo,
            message:"目录名称不能为空",
            url:"/teacher/subject"
        });
        return;
    }
    //获取要修改的分类信息
    Subject.findOne({
        _id:id
    }).then(function (subject) {
        if(!subject){
            res.render("teacher/error",{
                userInfo:req.userInfo,
                message:"分类信息不存在",
                url:"/teacher/subject"
            });
            return Promise.reject();
        }else{
            //当用户没有做任何修改的时候
            if(name==subject.name){
                res.render("teacher/success",{
                    userInfo:req.userInfo,
                    message:"修改成功",
                    url:"/teacher/subject"
                });
                return Promise.reject();
            }else{
                return Subject.findOne({
                    _id:{$ne:id},
                    name:name
                });
            }
        }
    }).then(function (sameCategory) {
        if(sameCategory){
            res.render("teacher/error",{
                userInfo:req.userInfo,
                message:"已存在同名分类"
            });
            return Promise.reject();
        }else{
            return Subject.update({
                _id:id
            },{
                name:name
            });
        }
    }).then(function () {
        res.render("teacher/success",{
            userInfo:req.userInfo,
            message:"修改成功",
            url:"/teacher/subject"
        });
    });
});
//科目删除
router.get("/delete",function (req,res,next) {
    var id=req.query.id||"";
    Subject.remove({_id:id}).then(function () {
        var data={};
        data.code=0;
        data.message="删除成功";
        res.json(data);
    });
});
module.exports=router;