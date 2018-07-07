$(function () {  //循环倒计时
    setInterval(function () {
        count();
    },1000);
});
function count() {
    var nowDate=new Date();
    var start=$(".startTime").html();
    var split=start.split(",");
    var startDate=new Date(split[0],split[1]-1,split[2],split[3],split[4],split[5]);
    var end=$(".endTime").html();
    split=end.split(",");
    var endTime=new Date(split[0],split[1]-1,split[2],split[3],split[4],split[5]);
    var interval=startDate-nowDate;
    if(interval<=0){
        $(".hint").show();
        $(".countDown").hide();
        $(".enter").show();
        var endInt=endTime-nowDate;
        if(endInt<=0){
            $(".enter").hide();
            $(".hint").html("考试已结束。。。。。。");
        }else{
            $(".enter a").attr('href', $(".urlInfo").html());
            $(".hint").html("正在考试中。。。。。。");
        }
    }else{
        $(".countDown").show();
        var d = Math.floor(interval / 1000 / 60 / 60 / 24);
        var h = Math.floor(interval / 1000 / 60 / 60 % 24);
        var i = Math.floor(interval / 1000 / 60 % 60);
        var s = Math.floor(interval / 1000 % 60);
        $(".day").html(d);
        $(".hour").html(h);
        $(".minute").html(i);
        $(".second").html(s);

    }
}