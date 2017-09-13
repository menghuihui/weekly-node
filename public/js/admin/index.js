$(function () {

});
// 退出登录并切换到登录
function js_pullOut() {
    $.ajax({
        url:'api/user/loginout',
        success: function (result) {
            if(!result.code){
                window.location = "http://localhost:8081/";
            }
        }
    })
}