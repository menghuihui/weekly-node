var mongoose = require('mongoose');
//项目分类表结构
module.exports = new mongoose.Schema({
    //项目名称
    name:String,
    //项目路由
    url:String
})