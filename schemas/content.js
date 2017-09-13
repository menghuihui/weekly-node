var mongoose = require('mongoose');
//分类表结构
module.exports = new mongoose.Schema({
    //内容标题
    title:String,
    //内容
    con:String,
})