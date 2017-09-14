
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.get('/',function (req,res,next) {
        Content.find().sort({_id:-1}).then(function (contents) {
            res.render('main/index',{
                contents: contents,
                userInfo : req.userInfo,
            });
        })

})

/**
 * 添加内容
 * */
router.get('/weekly/add',function (req,res,next) {
    res.render('main/weekly_add',{
        userInfo : req.userInfo
    });
})
/**
 * 分类添加
 * */
router.post('/weekly/add',function (req,res,next) {
    var userId =  req.userInfo.id;
    var title =  req.body.title;
    var workweek =  req.body.workweek;
    var worknweek =  req.body.worknweek;
    if( !title || !workweek || !worknweek){
    }else{
        //保存分类列表的信息到数据库中
        new Content({
            title : title,
            user : userId,
            workweek : workweek,
            worknweek : worknweek
        }).save().then(function () {
            res.redirect(req.headers.origin + "/admin");
        });
    }
})

/**
 * 内容修改
 * */
router.get('/weekly/edit',function (req,res,next) {
    var _id = req.query.id;
    Content.findById(_id,function (err,contents) {
        Category.find().sort({_id:-1}).then(function (categories) {
            console.log(contents);
            if (!err) {
                console.log(contents)
                res.render('main/weekly_add', {
                    userInfo: req.userInfo,
                    contents: contents
                });
            }
        })
    })

})
/**
 * 内容修改保存
 * */
router.post('/weekly/edit',function (req,res,next) {
    var _id = req.query.id;
    var title =  req.body.title;
    var con =  req.body.con;
    if( !title || !con){
        res.render('admin/error',{
            error:1,
            message:'输入不能为空'
        })
    }else{
        //保存分类列表的信息到数据库中
        var content = {
            title : title,
            con : con
        };
        Content.update({_id:_id},content,function (err) {
            if (!err){
                res.render('admin/error',{
                    error:0,
                    message:'保存成功',
                    hrefurl:'../content'
                })
            }
        })
    }

})
/**
 * 内容删除
 * */
router.get('/weekly/del',function (req,res,next) {
    var _id = req.query.id;
    Content.findOneAndRemove({ _id: _id }, function (err) {
        if (!err){
            res.render('admin/error',{
                error:0,
                message:'删除成功',
                hrefurl:'../content'
            })
        }
    })
})
module.exports = router;
