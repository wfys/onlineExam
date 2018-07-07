var word=["A","B","C","D","E","F","G","H"];
var index=2;
var regScore=/^[0-9]+/;

//核对输入
$('#submit').click(function(e) {
    var i;
    var hint="";
    if($("#title").val()==""){
        hint+="题目描述";
    }
    if($("#answer").val()==""){
        if(hint=="") hint+="答案描述";
        else hint+="、"+"答案描述";
    }
    if(!regScore.test($("#score").val())){
        if(hint=="") hint+="分值";
        else hint+="、"+"分值";
    }
    if($("#center").val()==""){
        if(hint=="") hint+="考点";
        else hint+="、"+"考点";
    }
    if(hint!="") {
        $("#errorSum").html(hint+"内容有误");
        e.preventDefault();
    }
});
