var regUsername = /^[1-9][0-9]{9,15}$/;
var regPasswordSpecial = /[~!@#%&=;':",./<>_\}\]\-\$\(\)\*\+\.\[\?\\\^\{\|]/;
var regPasswordAlpha = /[a-zA-Z]/;
var regPasswordNum = /[0-9]/;
var check = [false, false, false];
var code;
$(function () {
    createCode();
});
function createCode()
{
    code = "";
    var codeLength = 4; //验证码的长度
    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u',
        'v','w','x','y','z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    //所有候选组成验证码的字符
    for(var i = 0; i < codeLength; i++)
    {
        var charNum = Math.floor(Math.random() * 52);
        code += codeChars[charNum];
    }
    $("#idcode span").eq(0).html(code);
}

//校验成功函数
function success(Obj, counter) {
    Obj.parent().parent().removeClass('has-error').addClass('has-success');
    $('.tips').eq(counter).hide();
    $('.glyphicon-ok').eq(counter).show();
    $('.glyphicon-remove').eq(counter).hide();
    check[counter] = true;

}

// 校验失败函数
function fail(Obj, counter, msg) {
    Obj.parent().parent().removeClass('has-success').addClass('has-error');
    $('.glyphicon-remove').eq(counter).show();
    $('.glyphicon-ok').eq(counter).hide();
    $('.tips').eq(counter).text(msg).show();
    check[counter] = false;
}
// 学号匹配
$('.container').find('input').eq(0).change(function() {
    if (regUsername.test($(this).val())) {
        success($(this), 0);
    } else if ($(this).val().length < 10) {
        fail($(this), 0, '学号太短，不能少于10个字符');
    } else {
        fail($(this), 0, '用户名只能以数字组成,且不能以0开头')
    }
});
// 密码匹配

// 匹配字母、数字、特殊字符至少两种的函数
function atLeastTwo(password) {
    var a = regPasswordSpecial.test(password) ? 1 : 0;
    var b = regPasswordAlpha.test(password) ? 1 : 0;
    var c = regPasswordNum.test(password) ? 1 : 0;
    return a + b + c;

}
$('.container').find('input').eq(1).change(function() {
    if ($(this).val().length < 8) {
        fail($(this), 1, '密码太短，不能少于8个字符');
    } else {
        if (atLeastTwo($(this).val()) < 2) {
            fail($(this), 1, '密码中至少包含字母、数字、特殊字符的两种')
        } else {
            success($(this), 1);
        }
    }
});
// 验证码
$('.container').find('input').eq(2).change(function() {
    if($(this).val().length!=4){
        fail($(this),2,'验证码长度为4个字符');
    }else if($(this).val().toLowerCase()!=code.toLowerCase()){
        fail($(this),2,'验证码输入错误');
    }else {
        success($(this),2);
    }
});
//登录
$('#submit').click(function(e) {
    if (!check.every(function(value) {
            return value == true
        })) {
        e.preventDefault();
        for (key in check) {
            if (!check[key]) {
                $('.container').find('input').eq(key).parent().parent().
                removeClass('has-success').addClass('has-error');
            }
        }
    }
});