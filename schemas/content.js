var mongoose = require('mongoose');
//分类表结构
module.exports = new mongoose.Schema({
    //用户
    user:{
        // 类型
        type:mongoose.Schema.Types.ObjectId,
        // 引用
        ref:'User'
    },
    //周报标题
    title:String,
    //本周工作
    workweek:String,
    //下周工作
    worknweek:String
})