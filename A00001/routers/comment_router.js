// 导入文件操作库
var fs = require('fs');
// 导入path库
var path = require('path');
// 导入自己封装http请求的工具
var httputils = require(path.join(__dirname, '../utils/httputils'));
// 导入静态数据
var static_data = require(path.join(__dirname, '../utils/static_data'));
// 导入express框架
var express = require('express');

// 创建express路由
var router = express.Router();

// 导入showdown的库
var showdown = require('showdown');

// 创建解析器
var converter = new showdown.Converter();

// 请求主机地址
var host = static_data.host;

// 请求主机的端口
var port = static_data.port;

// 获取请求URL的地址
var getURL = function(str) {
    return static_data.before + str + static_data.after;
}

// 判断是否具有某个参数
var isValid = function(str) {
   if (str === undefined || str === null || str === "") {
      return false;
   }
   return true;
}

// 处理/comments的get请求
router.get('/comments', function(req, resp) {
    var params = {};
    params.essayId = req.query.id;
    if (!isValid(params.essayId)) {
        resp.status(500).send('请求参数出错!');
    }
    httputils.post(host, getURL('getCommentsByEssayId'), port, params, function(err, data) {
        if (err) {
            resp.status(500).send('Server Error !');
        } else {
            resp.render('comments.html', {
                comments: data,
                id: params.essayId
            });
        }
    });
});

// 处理/deleteComment的post请求
router.post('/deleteComment', function(req, resp) {
    var params = req.body;
    if (!isValid(params.id)) {
        resp.json({
            status: 'failed',
            message: '页面出错, 请刷新后重试!'
        });
        return;
    }
    if(!(isValid(params.key) && isValid(params.value))) {
        resp.json({
            status: 'failed',
            message: '令牌无效!'
        });
        return;
    }
    httputils.post(host, getURL('deleteCommentById'), port, params, function(err, data) {
        if (err) {
            resp.json({
                status: 'failed',
                message: 'Server Error !'
            });
            return;
        } else {
            resp.json(data);
        }
    });
});

// 处理/addComment的post请求
router.post('/addComment', function(req, resp) {
    var params = req.body;
    if (!isValid(params.essayId)) {
        resp.json({
            status: 'failed',
            message: '页面出错, 请刷新后重试!'
        });
        return;
    }
    if (!(isValid(params.username) && isValid(params.content))) {
        resp.json({
            status: 'failed',
            message: '称呼或评论不能为空!'
        });
        return;
    }
    httputils.post(host, getURL('addNewComment'), port, params, function(err, data) {
        if (err) {
            resp.json({
                status: 'failed',
                message: 'Server Error !'
            });
            return;
        } else {
            resp.json(data);
        }
    });
});

module.exports = router;