
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send('对不起，只有管理员才可以进入后台管理 ');
        return;
    }
    next();
})
/**
 * 首页
 * */
router.get('/',function (req,res,next) {
    res.render('admin/index',{
        userInfo : req.userInfo
    });
})
/**
 * 用户管理
 * */
router.get('/user',function (req,res,next) {
    /**
     * 查询用户列表
     *
     * limit(Number):限制获取的数据条数  一页几条数据
     *
     * skip(Number):忽略数据的条数
     *
     * 每页显示2条
     * 1：1-2 skip:0
     * 2：3-4 skip:2 => (当前页-1)*limit
     * 3：5-6 skip:4
     *
     * */

    var page = Number(req.query.page || 1);
    var limit = 2;
    var skip = (page - 1)*limit;
    var pages = 0;
    User.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo : req.userInfo,
                users: users,

                page:page,//当前页数
                pages: pages//总页数

            });
        })
    })
})
/**
 * 分类管理
 * */
router.get('/category',function (req,res,next) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var skip = (page - 1)*limit;
    var pages = 0;
    Category.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categorys) {
            res.render('admin/category',{
                userInfo : req.userInfo,
                categorys: categorys,

                page:page,//当前页数
                pages: pages//总页数

            });
        })
    })
})
/**
 * 添加分类
 * */
router.get('/category/add',function (req,res,next) {
    res.render('admin/category_add',{
        userInfo : req.userInfo
    });
})
/**
 * 分类添加
 * */
router.post('/category/add',function (req,res,next) {
    var name =  req.body.name;
    var nameurl = req.body.url;
    if( !name || !nameurl){
        res.render('admin/error',{
            error:1,
            message:'输入不能为空'
        })
    }else{
        //保存分类列表的信息到数据库中
        var category = new Category({
            name :name,
            url : nameurl
        });
        return category.save().then(function () {
            res.render('admin/error',{
                error:0,
                message:'保存成功'
            })
        });
    }
})

/**
 * 分类修改
 * */
router.get('/category/edit',function (req,res,next) {
    var _id = req.query.id;
    Category.findById(_id,function (err,categorys) {
        if(!err){
            console.log(categorys)
            res.render('admin/category_add',{
                userInfo : req.userInfo,
                categorys:  categorys
            });
        }
    })

})
/**
 * 分类修改
 * */
router.post('/category/edit',function (req,res,next) {
    var _id = req.query.id;
    var name =  req.body.name;
    var nameurl = req.body.url;
    if( !name || !nameurl){
        res.render('admin/error',{
            error:1,
            message:'输入不能为空'
        })
    }else{
        //保存分类列表的信息到数据库中
        var category = {
            name :name,
            url : nameurl
        };
        Category.update({_id:_id},category,function (err) {
            if (!err){
                res.render('admin/error',{
                    error:0,
                    message:'保存成功',
                    hrefurl:'../category'
                })
            }
        })
    }

})
/**
 * 分类删除
 * */
router.get('/category/del',function (req,res,next) {
    var _id = req.query.id;
    Category.findOneAndRemove({ _id: _id }, function (err) {
        if (!err){
            res.render('admin/error',{
                error:0,
                message:'删除成功',
                hrefurl:'../category'
            })
        }
    })
})


/**
 * 内容管理
 * */
router.get('/content',function (req,res,next) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var skip = (page - 1)*limit;
    var pages = 0;
    Content.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate('category').then(function (contents) {
            console.log(contents)
            res.render('admin/content',{
                userInfo : req.userInfo,
                contents: contents,

                page:page,//当前页数
                pages: pages//总页数

            });
        })
    })
})
/**
 * 添加内容
 * */
router.get('/content/add',function (req,res,next) {
    Category.find().sort({_id:-1}).then(function (categories) {
        res.render('admin/content_add',{
            userInfo : req.userInfo,
            categories : categories
        });
    })
})
/**
 * 分类添加
 * */
router.post('/content/add',function (req,res,next) {
    var profile =  req.body.profile;
    var title =  req.body.title;
    var con =  req.body.con;
    if( !profile || !title || !con){
        res.render('admin/error',{
            error:1,
            message:'输入不能为空'
        })
    }else{
        //保存分类列表的信息到数据库中
        new Content({
            category:req.body.category,
            profile : profile,
            title : title,
            con : con
        }).save().then(function () {
            res.render('admin/error',{
                error:0,
                message:'保存成功'
            })
        });
    }
})

/**
 * 内容修改
 * */
router.get('/content/edit',function (req,res,next) {
    var _id = req.query.id;
    Content.findById(_id,function (err,contents) {
        Category.find().sort({_id:-1}).then(function (categories) {
            console.log(contents);
            if (!err) {
                console.log(contents)
                res.render('admin/content_add', {
                    userInfo: req.userInfo,
                    contents: contents,
                    categories:categories
                });
            }
        })
    })

})
/**
 * 内容修改保存
 * */
router.post('/content/edit',function (req,res,next) {
    var _id = req.query.id;
    var profile =  req.body.profile;
    var title =  req.body.title;
    var con =  req.body.con;
    if( !profile || !title || !con){
        res.render('admin/error',{
            error:1,
            message:'输入不能为空'
        })
    }else{
        //保存分类列表的信息到数据库中
        var content = {
            category:req.body.category,
            profile : profile,
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
router.get('/content/del',function (req,res,next) {
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
