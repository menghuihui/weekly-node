/**
 *应用程序的启动（入口）文件
 *
 */

//加载express模块
var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser')
//加载数据库模块
var mongoose = require('mongoose');
//加载cookies 模块
var Cookies = require('cookies');
//创建APP应用=> NodeJS Http.createServer();
var app = express();

var User = require('./models/user');
//静态文件处理，通过/public来截取
app.use('/public',express.static(__dirname + '/public'));

//cookies设置
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);
    //解析cooies记录的登录信息
    req.userInfo = {};
    if (req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前登录用户信息
            User.findById(req.userInfo.id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch (e){}
    }else{
        next();
    }
})

app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

//bodyparser设置
app.use(bodyParser.urlencoded({extended:true}));

app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));


mongoose.connect('mongodb://localhost:27019/weekly-node',function (err) {
    if (err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        //监听http请求;
        app.listen(8088);
    }
});

