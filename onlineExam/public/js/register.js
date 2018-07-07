var regUsername = /^[1-9][0-9]{9,15}$/;
var regPasswordSpecial = /[~!@#%&=;':",./<>_\}\]\-\$\(\)\*\+\.\[\?\\\^\{\|]/;
var regPasswordAlpha = /[a-zA-Z]/;
var regPasswordNum = /[0-9]/;
var regPhoneNum = /^[1-9][0-9]{10}$/;
var regEmail=/^[0-9A-z]{4,}@[A-z]+\.(com|cn|org)$/;
var password;
var check = [false, false, false, false, false, false];
$(function () {
    if($('#save')){
        check=[true, true, true, true, true, true];
    }else{
    }
});
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
//姓名匹配
$('.container').find('input').eq(1).change(function() {
    if ($(this).val().length < 2) {
        fail($(this), 1, '姓名太短，不能少于2个字符');
    } else {
        success($(this), 1);
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
$('.container').find('input').eq(2).change(function() {
    password=$(this).val();
    if ($(this).val().length < 8) {
        fail($(this), 2, '密码太短，不能少于8个字符');
    } else {
        if (atLeastTwo($(this).val()) < 2) {
            fail($(this), 2, '密码中至少包含字母、数字、特殊字符的两种')
        } else {
            success($(this), 2);
        }
    }
});
// 再次输入密码校验
$('.container').find('input').eq(3).change(function() {
    if ($(this).val() == password) {
        success($(this), 3);
    } else {
        fail($(this), 3, '两次输入的密码不一致');
    }
});
//邮箱
$('.container').find('input').eq(4).change(function() {
    if (regEmail.test($(this).val())) {
        success($(this), 4);
    } else {
        fail($(this), 4, '邮箱需要含有@字符，且时正确的邮箱号码');
    }
});
// 手机号码
$('.container').find('input').eq(5).change(function() {
    if (regPhoneNum.test($(this).val())) {
        success($(this), 5);
    } else {
        fail($(this), 5, '手机号码只能为11位数字,且开头不能为0');
    }
});
//注册
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