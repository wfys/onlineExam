var regScore=/^[0-9]*$/;
var sumQuestion=1;
var data=[];
var score=[];

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
function addQuestion() {
    if(sumQuestion>=100){
        $("#error").html("问题最多为100个");
    }else{
        $("#error").html("");
        sumQuestion++;
        var addHtml="<div class='input-group' id='"+sumQuestion+"'>\n" +
            "<span class='input-group-addon'>"+sumQuestion+"、"+"</span>\n" +
            "<input type='text' class='form-control' placeholder='请输入题库里面的题号'\n" +
            "name='question' style='width: 400px;' onchange='checkScore("+sumQuestion+")'>"+
            "<span class='hint' style='background-color: #d6d6d6;font-size: 12px'></span>\n" +
            "</div>";
        $("#questions").append(addHtml);
    }
}
function deleteQuestion() {
    if (sumQuestion<=1){
        $("#error").html("问题最少为1个");
    }else{
        $("#"+sumQuestion).remove();
        sumQuestion--;
    }
}
function checkScore(id) {
    var getValue= $("#"+id+" input").val();
    if(!regScore.test(getValue)||Number(getValue)>data.length||Number(getValue)<=0){
        $("#"+id+" .hint").html('请输入正确且存在的题号');
        score[id-1]=0;
    }else{
        var content=data[Number(getValue)-1];
        var showHtml="本题考点:"+content.center+"  分值:"+content.score
            +"  难度:"+content.difficulty+"  题型:"+content.style +
            "   来源题库:"+content.catalog.name;
        score[id-1]=content.score;
        $("#"+id+" .hint").html(showHtml);
    }
    sumScore();
}
function sumScore() {
    var sums=0;
    for(var i=0;i<sumQuestion;i++){
        if(score[i]){
            sums+=score[i];
        }
    }
    $("#sumScore").val(sums);
}
$('#submit').click(function(e) {
    var i;
    var hint="";
    for (i=0;i<=sumQuestion;i++){
        if(i==0){
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
        }else{
            var getValue= $("#"+i+" input").val();
            if(!regScore.test(getValue)||Number(getValue)>data.length||Number(getValue)<=0){
                if(hint=="") hint+="第"+i+"题";
                else hint+="、"+"第"+i+"题";
            }
        }
    }
    if(hint!="") {
        $("#errorSum").html(hint+"内容有误");
        e.preventDefault();
    }
});