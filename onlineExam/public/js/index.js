$(function () {
    var $logout=$("#logout");
    $logout.on("click",function () {
        $.ajax({
            url:"/api/logout",
            success:function (result) {
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    });
});