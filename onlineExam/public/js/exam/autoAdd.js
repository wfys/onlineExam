var regScore=/^[0-9]*$/; //检测输入的是否是数字
var sumQuestion=1;
var data=[];
var singS=0;
var mulS=0;
var essS=0;
var singleIndex=[];
var multipleIndex=[];
var essayIndex=[];

$(function () {
    $.ajax({
        type:"post",
        url:"/api/getAllQuestion",
        data:{},
        dataType:"json",
        success:function (responseData) {
            data=responseData.data;
        }
    });
});

function sumScore() {
    $("#sumScore").val(singS+mulS+essS);
}
function singleChoose() {
    var canChoose=[];
    var canIndex=[];
    singleIndex.splice(0,singleIndex.length);
    var singleScore=Number($("#singleScore").val());
    var singleCatelog=$("#singleCategory option:selected").val();
    if(singleScore<=0){
        $("#singleIndex").html("没有题目产生")
        return;
    }
    for(var i=0;i<data.length;i++){
        if(data[i].catalog._id==singleCatelog){
            canChoose.push(data[i].score);
            canIndex.push(data[i].index);
        }
    }
    var get=[];
    for(var i=0;i<canChoose.length;i++){
        get[i]=0;
    }
    if(f(canChoose.length-1,singleScore)){
        for(var i=0;i<canChoose.length;i++){
            if(get[i]) singleIndex.push(canIndex[i]);
        }
        var html="产生的题目序号为：";
        for(var i=0;i<singleIndex.length;i++){
            if(i==0) html+=singleIndex[i];
            else html+="、"+singleIndex[i];
        }
        $("#singleIndex").html(html);
    }else{
        $("#singleIndex").html("不能产生相应的题目选择");
        return;
    }
    singS=singleScore;
    sumScore();
    function f(n,resV) {
        if(resV==0) return 1;
        if(resV<0||resV>singleScore||n==-1) return 0;
        get[n]=1;
        if(f(n-1,resV-canChoose[n])) return 1;
        else{
            get[n]=0;
            return f(n-1,resV);
        }
    }
}
function multipleChoose() {
    var canChoose=[];
    var canIndex=[];
    multipleIndex.splice(0,multipleIndex.length);
    var multipleScore=Number($("#multipleScore").val());
    var multipleCatelog=$("#multipleCategory option:selected").val();
    if(multipleScore<=0){
        $("#multipleIndex").html("没有题目产生")
        return;
    }
    for(var i=0;i<data.length;i++){
        if(data[i].catalog._id==multipleCatelog){
            canChoose.push(data[i].score);
            canIndex.push(data[i].index);
        }
    }
    var get=[];
    for(var i=0;i<canChoose.length;i++){
        get[i]=0;
    }
    if(f(canChoose.length-1,multipleScore)){
        for(var i=0;i<canChoose.length;i++){
            if(get[i]) multipleIndex.push(canIndex[i]);
        }
        var html="产生的题目序号为：";
        for(var i=0;i<multipleIndex.length;i++){
            if(i==0) html+=multipleIndex[i];
            else html+="、"+multipleIndex[i];
        }
        $("#multipleIndex").html(html);
    }else{
        $("#multipleIndex").html("不能产生相应的题目选择");
        return;
    }
    mulS=multipleScore;
    sumScore();
    function f(n,resV) {
        if(resV==0) return 1;
        if(resV<0||resV>multipleScore||n==-1) return 0;
        get[n]=1;
        if(f(n-1,resV-canChoose[n])) return 1;
        else{
            get[n]=0;
            return f(n-1,resV);
        }
    }
}
function essayChoose() {
    var canChoose=[];
    var canIndex=[];
    essayIndex.splice(0,essayIndex.length);
    var essayScore=Number($("#essayScore").val());
    var essayCatelog=$("#essayCategory option:selected").val();
    if(essayScore<=0){
        $("#essayIndex").html("没有题目产生")
        return;
    }
    for(var i=0;i<data.length;i++){
        if(data[i].catalog._id==essayCatelog){
            canChoose.push(data[i].score);
            canIndex.push(data[i].index);
        }
    }
    var get=[];
    for(var i=0;i<canChoose.length;i++){
        get[i]=0;
    }
    if(f(canChoose.length-1,essayScore)){
        for(var i=0;i<canChoose.length;i++){
            if(get[i]) essayIndex.push(canIndex[i]);
        }
        var html="产生的题目序号为：";
        for(var i=0;i<essayIndex.length;i++){
            if(i==0) html+=essayIndex[i];
            else html+="、"+essayIndex[i];
        }
        $("#essayIndex").html(html);
    }else{
        $("#essayIndex").html("不能产生相应的题目选择");
        return;
    }
    essS=essayScore;
    sumScore();
    function f(n,resV) {
        if(resV==0) return 1;
        if(resV<0||resV>essayScore||n==-1) return 0;
        get[n]=1;
        if(f(n-1,resV-canChoose[n])) return 1;
        else{
            get[n]=0;
            return f(n-1,resV);
        }
    }
}
$('#submit').click(function(e) {
    var hint="";
    if($('#title').val()==""){
        hint+="试卷名称";
    }
    if($('#description').val()==''){
        if(hint=="") hint+='试卷描述';
        else hint+="、"+'试卷描述';
    }
    if($('#startTime').val()==''){
        if(hint=="") hint+='开始考试时间';
        else hint+="、"+'开始考试时间';
    }
    if($('#endTime').val()==''){
        if(hint=="") hint+='结束考试时间';
        else hint+="、"+'结束考试时间';
    }
    var start=new Date($('#startTime').val());
    var end=new Date($('#endTime').val());
    if(start&&end){
        if(start-end>=0){
            if(hint=="") hint+='开始时间高于结束时间';
            else hint+="、"+'开始时间高于结束时间';
        }else if(start-new Date().getTime()<=0){
            if(hint=="") hint+='开始时间晚于现在时间';
            else hint+="、"+'开始时间晚于现在时间';
        }
    }
    if((singS+mulS+essS)==0){
        if(hint=="") hint+='分数构成';
        else hint+="、"+'分数构成';
    }
    if(hint!="") {
        $("#errorSum").html(hint+"内容有误");
    }else{
        var question=[];
        for(var i=0;i<singleIndex.length;i++){
            question.push(singleIndex[i]);
        }
        for(var i=0;i<multipleIndex.length;i++){
            question.push(multipleIndex[i]);
        }
        for(var i=0;i<essayIndex.length;i++){
            question.push(essayIndex[i]);
        }
        $.ajax({
            type:"post",
            url:"/teacher/exam/autoPaper",
            data:{
                title:$('#title').val(),
                startTime:$('#startTime').val(),
                endTime:$('#endTime').val(),
                sumScore:$('#sumScore').val(),
                question:question,
                description:$('#description').val(),
                subject:$("#subject option:selected").val()
            },
            dataType:"json",
            success:function (responseData) {
                ok=responseData.ok;
                if(data){
                    alert("添加成功");
                    window.location.href="/teacher/exam";
                }else{
                    alert(responseData.data);
                }

            }
        });
    }
});