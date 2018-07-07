//应用程序启动入口文件
var express=require("express");   //加载express模块
var swig=require("swig"); //加载swig模块
var bodyPaser=require("body-parser"); //加载body-parser用于处理post请求
var mongoose = require('mongoose');
var cookies=require("cookies");  //加载cookies模块
var Teacher=require("./models/Teacher");
var Student=require("./models/Student");

var app=express();  //创建app应用

//第一个参数模板引擎的名称以及文件的后缀，第二个参数解析模板的方法
app.engine("html",swig.renderFile);
app.set("views","./views/"); //设置模板目录，第一个必须是views，第二个是目录
app.set("view engine","html"); //注册引擎，第一个必须，第二个是模板引擎的名称
swig.setDefaults({cache : false}); //开发过程中取消缓存

//设置静态文件托管，当用户访问的url以public开始，那么直接返回对应下的文件
app.use("/public",express.static(__dirname+"/public")); //__dirname获取当前文件的目录
//设置bodyParser，用于后台获得post请求数据
app.use(bodyPaser.urlencoded({extended:true}));
//设置cookies
app.use(function (req,res,next) {
    req.cookies=new cookies(req,res);
    req.userInfo={};
    //解析req得到的cookies信息
    if(req.cookies.get("userInfo")){
        try {
            req.userInfo=JSON.parse(req.cookies.get("userInfo"));
            //获取用户的类型，是否是学生
            if(!req.userInfo.isStudent){
                Teacher.findOne({
                    no:req.userInfo.no
                }).then(function (userInfo) {
                    if(userInfo){
                        req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                        req.userInfo.name=userInfo.name;
                    }
                    next();
                });
            }
            else {
                Student.findOne({
                    no:req.userInfo.no
                }).then(function (userInfo) {
                    if(userInfo){
                        req.userInfo.name=userInfo.name;
                    }
                    next();
                });
            }
        }catch (e){
            next();
        }
    }else{
        next();
    }
});


//根据不同的功能划分模块
app.use("/teacher",require("./routers/teacher"));
app.use("/api",require("./routers/api"));
app.use("/",require("./routers/student"));

//连接数据库
mongoose.connect("mongodb://127.0.0.1:27019/onlineExam",function (err) {
    if(err){
        console.log("数据库连接失败");
    }else{
        console.log("数据库连接成功");
        app.listen(8081,'0.0.0.0');  //app监听http请求
    }
});
//E:\Android\mogobd\bin>mongod --dbpath=E:\Android\onlineExam\db --port=27019
/*
cd  /data/home/server/mongodb-linux-x86_64-3.0.7/bin
mongod --dbpath=/data/home/www/onlineExam/dbb  --port=27019
 */