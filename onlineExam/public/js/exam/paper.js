var startDate;  //开始时间
var endTime;   //结束时间
var data;    //题目
var answer=[]; //答案
var questionIndex=0; //现在的题目
$(function () {  //初始化
    var end=$(".endTime").html();
    var split=end.split(",");
    endTime=new Date(split[0],split[1]-1,split[2],split[3],split[4],split[5]);
    var start=$(".startTime").html();
    split=start.split(",");
    startDate=new Date(split[0],split[1]-1,split[2],split[3],split[4],split[5]);
    setInterval(function () {
        count();
    },1000);
    $.ajax({
        type:"post",
        url:"/api/getQuestion",
        data:{
            id:$(".examId").html()
        },
        dataType:"json",
        success:function (responseData) {
            data=responseData.data;
            setPaper(data);
            if(responseData.answer){
                for(var i=0;i<responseData.answer.length;i++){
                    answer[i]=responseData.answer[i].submit;
                }
            }
        }
    });
});

function count() {  //倒计时
    var nowDate=new Date();
    var interval=endTime-nowDate;
    var allInterval=endTime-startDate;
    if(interval>0){
        var h = Math.floor(interval / 1000 / 60 / 60);
        var i = Math.floor(interval / 1000 / 60 % 60);
        var s = Math.floor(interval / 1000 % 60);
        $(".hour").html(h);
        $(".minute").html(i);
        $(".second").html(s);
        var process=Math.floor((interval*100)/allInterval);
        $(".progress-bar").width(100-process+"%");
    }else if(interval<=0){
        saveAnswer();
        window.location.href="/handOver?exam="+data[0].exam;
    }
}

function setPaper(questions) {  //设置答题卡及默认问题
    for(var i=0;i<questions.length;i++){
        var html="<a class='option' onclick='checkScore("+i+")' id='card"+i+"'>"+(i+1)+"</a>";
        $(".answerCard").append(html);
    }
    selectQuestion(0);
    $(".last").hide();
}

function nextProblem() { //下一题
    saveAnswer();

    var index=questionIndex+1;
    if(index<data.length){
        questionIndex=index;
        selectQuestion(index);
        if(index==data.length-1){
            $(".next").hide();
        }else{
            $(".next").show();
            $(".last").show();
        }
    }
}

function lastProblem() {  //上一题
    saveAnswer();
    var index=questionIndex-1;
    if(index>=0){
        questionIndex=index;
        selectQuestion(index);
        if(index>=1){
            $(".next").show();
            $(".last").show();
        }
        else{
            $(".last").hide();
        }
    }
}
function selectQuestion(index) {  //选中当前的题目
    if(index<data.length&&index>=0){
        var html='';
        if(data[index].question.style=="single"){
            $(".title").html("["+"单选题"+"]"+(index+1)+"、"+data[index].question.title);
            html="<form class='form'>";
            var options=data[index].question.options;
            for(var i=0;i<options.length;i++){
                html+="<div class='inputGroup'>";
                html+="<input id='radio"+i+"' name='radio' type='radio'>" +
                    "<label for='radio"+i+"'>"+options[i].name+"、"+options[i].info+"</label>";
                html+="</div>";
            }
            html+="</form>";
        }else if(data[index].question.style=="multiple"){
            $(".title").html("["+"多选题"+"]"+(index+1)+"、"+data[index].question.title);
            html="<form class='form'>";
            var options=data[index].question.options;
            for(var i=0;i<options.length;i++){
                html+="<div class='inputGroup'>";
                html+="<input id='radio"+i+"' name='radio' type='checkbox'>" +
                    "<label for='radio"+i+"'>"+options[i].name+"、"+options[i].info+"</label>";
                html+="</div>";
            }
            html+="</form>";
        }else{
            $(".title").html("["+"问答题"+"]"+(index+1)+"、"+data[index].question.title);
            html="<div class='form-group'>" +
                "<label for='answers'>答:</label>" +
                "<textarea class='form-control' id='answers' placeholder='请输入答案描述'" +
                " name='answer' rows='5'></textarea>" +
                "</div>";
        }
        $(".answer").html(html);
        if(data[index].question.style=="single"){
            if(answer[index]){
                var top;
                var word=["A","B","C","D","E","F","G","H"];
                for(var j=0;j<word.length;j++){
                    if(word[j]==answer[index]){
                        top=j;
                        break;
                    }
                }
                $("#radio"+top).attr("checked", true);
            }
        }else if(data[index].question.style=="multiple"){
            if(answer[index]){
                var top=[];
                var num=0;
                var word=["A","B","C","D","E","F","G","H"];
                for(var j=0;j<word.length;j++){
                    for(var k=0;k<answer[index].length;k++){
                        if(word[j]==answer[index][k]){
                            top[num]=j;
                            num++;
                        }
                    }
                }
                for(j=0;j<num;j++){
                    $("#radio"+top[j]).attr("checked", true);
                }
            }
        }else{
            if(answer[index]){
                $("#answers").val(answer[index]);
            }
        }
    }
}

function saveAnswer() {  //保存答案
    if(data[questionIndex].question.style=="essay") {
        answer[questionIndex]=$("#answers").val();
        if(answer[questionIndex]){
            $.ajax({
                type:"post",
                url:"/api/submitAnswer",
                data:{
                    index:questionIndex+1,
                    answer:answer[questionIndex],
                    exam:data[0].exam,
                    score:0,
                    correct:false
                },
                dataType:"json",
                success:function (responseData) {
                }
            });
        }
    }else{
        var options=data[questionIndex].question.options;
        var indexChoose=[];
        var num=0;
        var word=["A","B","C","D","E","F","G","H"];
        for(var i=0;i<options.length;i++){
            var answers=$("#radio"+i).is(':checked');
            if(answers){
                indexChoose[num]=word[i];
                num++;
            }
        }
        if(num>=1){
            answer[questionIndex]=indexChoose;
            var score=0,answerSubmit='';
            for(var i=0;i<indexChoose.length;i++){
                if(i<indexChoose.length-1){
                    answerSubmit+=indexChoose[i]+",";
                }else{
                    answerSubmit+=indexChoose[i];
                }
            }
            if(data[questionIndex].question.style=='single'){
                if(data[questionIndex].question.answer==answerSubmit){
                    score=data[questionIndex].question.score;
                }
            }else{
                if(data[questionIndex].question.answer==answerSubmit){
                    score=data[questionIndex].question.score;
                }else{
                    if(data[questionIndex].question.answer.indexOf(answerSubmit) != -1){
                        score=data[questionIndex].question.score/2;
                    }
                }
            }
            $.ajax({
                type:"post",
                url:"/api/submitAnswer",
                data:{
                    index:questionIndex+1,
                    answer:answerSubmit,
                    exam:data[0].exam,
                    score:score,
                    correct:true
                },
                dataType:"json",
                success:function (responseData) {
                }
            });
        }
    }
    if(answer[questionIndex]){
    }
    RefreshCard();
}
function checkScore(index) {  //跳转到某一题
    saveAnswer();
    if(index<data.length){
        questionIndex=index;
        selectQuestion(index);
        if(index==data.length-1){
            $(".last").show();
            $(".next").hide();
        }else if(index==0){
            $(".next").show();
            $(".last").hide();
        }else{
            $(".next").show();
            $(".last").show();
        }
    }
}
function RefreshCard() { //刷新答题卡
    for(var i=0;i<data.length;i++){
        if(answer[i]){
            $("#card"+i).css("background-color", "#1feb38");
        }
    }
}

//提交答案
function submit() {
    saveAnswer();
    layer.confirm('你真的要交卷吗？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        window.location.href="/handOver?exam="+data[0].exam;
    }, function(){
    });
}
