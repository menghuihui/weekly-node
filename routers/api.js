
var express = require('express');
var router = express.Router();
var User = require('../models/User');

var responseData;

router.use(function (req,res,next) {
    responseData={
        code: 0,
        message: '',
        data:''
    };
    next();
})
//登录借口
router.post('/user/login', function (req,res,next) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    if (username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if (password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库登录是否成功
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        console.log(userInfo);
        if(userInfo){
            //表示数据库中存在该用户
            responseData.code = 0;
            responseData.data = {
                id : userInfo.id,
                username : userInfo.username
            }
            req.cookies.set('userInfo',JSON.stringify({
                id : userInfo.id,
                username : userInfo.username
            }))
        }else{
            responseData.code = 3;
            responseData.message = '用户名密码输入错误';
        }
        res.json(responseData);
    });
})

//登录退出
router.get('/user/loginout', function (req,res,next) {
    responseData.code = 0;
    req.cookies.set('userInfo',null);
    res.json(responseData);
})
//注册借口
router.post('/user/register',function (req,res,next) {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var okpassword = req.body.okpassword;
    if (username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if (password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if (okpassword != password){
        responseData.code = 3;
        responseData.message = '两次密码不一致';
        res.json(responseData);
        return;
    }

    //用户是否已经被注册了，如果数据库中已经存在和我们要注册的用户名，表示该用户已经被注册了
    User.findOne({
        username:username
    }).then(function (userInfo) {
        console.log(userInfo);
        if(userInfo){
            //表示数据库中存在该用户
            responseData.code = 4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return;
        }

        //保存用户注册的信息到数据库中
        var user = new User({
            username :username,
            password : password
        });
        return user.save();
    }).then(function (newUserInfo) {
        console.log(newUserInfo);
        responseData.message = '注册成功';
        req.cookies.set('userInfo',JSON.stringify({
            id : newUserInfo.id,
            username : newUserInfo.username
        }))
        res.json(responseData);
    });
})

module.exports = router;
