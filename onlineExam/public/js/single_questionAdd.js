var word=["A","B","C","D","E","F","G","H"];
var index=2;
var regScore=/^[0-9]*$/; //检测输入的是否是数字

//增加选项
function addOption(type) {
    if(index>=7) {
        $("#error").html("选择选项最多为7个");
    }else{
        $("#error").html("");
        var html="<div class='input-group' id='"+word[index]+"'>\n" +
            "<span class='input-group-addon'>"+word[index]+"</span>\n" +
            "<input type='text' class='form-control' placeholder='请输入选项内容'" +
            "name='option' >" +
            "</div>";
        var answerHtml;
        if(type==0){
            answerHtml="<span id='"+word[index]+"s'>"+"&nbsp;&nbsp;"+"<input type='radio' " +
                "name='answer' value='"+ word[index]+"' " + " class='radioL'/>"+word[index]+"</span>";
        }else{
            answerHtml="<span id='"+word[index]+"s'>"+"&nbsp;&nbsp;"+"<input type='checkbox' " +
                "name='answer' value='"+ word[index]+"' " + " class='radioL'/>"+word[index]+"</span>";
        }
       //var answerHtml="<option value='"+word[index]+"' id='"+word[index]+"s'>"+word[index]+"</option>";
        index++;
        $("#options").append(html);
        $("#answer").append(answerHtml);
    }
}
function deleteOption() {
    if(index<=2){
        $("#error").html("选择选项最少为2个");

    }else{
        $("#"+word[index-1]).remove();
        $("#"+word[index-1]+"s").remove();
        index--;
    }
}
$('#submit').click(function(e) {
    var i;
    var hint="";
    for (i=0;i<index+1;i++){
        if(i==0){
            if($("#title").val()==""){
                hint+="题目描述";
            }
        }else{
            if($("#"+word[i-1]+" input").val()==""){
                if(hint=="") hint+=word[i-1]+"选项";
                else hint+="、"+word[i-1]+"选项";
            }
        }
    }
    if(!regScore.test($("#score").val())){
        if(hint=="") hint+="分值";
        else hint+="、"+"分值";
    }
    if($("#center").val()==""){
        if(hint=="") hint+="考点";
        else hint+="、"+"考点";
    }
    var optiones=false;
    for(var i=0;i<index;i++){
        var answers=$("input").is(':checked');
        if(answers){
            optiones=true;
            break;
        }
    }
    if(!optiones){
        if(hint=="") hint+="答案选择";
        else hint+="、"+"答案选择";
    }
    if(hint!="") {
        $("#errorSum").html(hint+"内容有误");
        e.preventDefault();
    }
});
