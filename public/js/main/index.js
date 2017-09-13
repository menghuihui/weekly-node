$(function() {
    var $registCon = $(".registCon");
    var $loginCon = $(".loginCon");
    //注册
    $registCon.find("button").on('click',function () {
        //ajax注册请求
        $.ajax({
            type:'post',
            url:'api/user/register',
            data:{
               username: $registCon.find('[name="username"]').val(),
               password: $registCon.find('[name="password"]').val(),
               okpassword: $registCon.find('[name="okpassword"]').val()
            },
            dataType:'json',
            success:function (result) {
                $registCon.find('.colWarning').html(result.message);
                if (!result.code){
                    setTimeout(function () {
                        window.location.reload();
                    },1000);
                }

            }
        })
    })

    //登录
    $loginCon.find("button").on('click',function () {
        //ajax注册请求
        $.ajax({
            type:'post',
            url:'api/user/login',
            data:{
                username: $loginCon.find('[name="username"]').val(),
                password: $loginCon.find('[name="password"]').val()
            },
            dataType:'json',
            success:function (result) {
                console.log(result);
                $loginCon.find('.colWarning').html(result.message);
                console.log(result.code);
                if (!result.code){
                    window.location.reload();
                }
            }
        })
    })
});
// 切换注册
function js_regist() {
    $(".loginCon").hide();
    $(".registCon").show();
}
// 切换登录
function js_login() {
    $(".registCon").hide();
    $(".loginCon").show();
}
// 退出登录并切换到登录
function js_pullOut() {
    $.ajax({
        url:'api/user/loginout',
        success: function (result) {
            if(!result.code){
                window.location.reload();
            }
        }
    })
}
//登录切换到个人信息
function js_pullIn() {
    $(".userinfoCon").show();
    $(".loginCon").hide();
}