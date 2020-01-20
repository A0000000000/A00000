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

router.post('/addType', function(req, resp) {
    var params = req.body;
    if (!isValid(params.name)) {
        resp.json({status: 'failed', message: '名称不能为空!'});
    }
    if (!(isValid(params.key) && isValid(params.value))) {
        resp.json({status: 'failed', message: '参数不合法!'});
    }
    httputils.post(host, getURL('addNewType'), port, params, function(err, data) {
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

// 处理/allTypes的请求
router.get('/allTypes', function(req, resp) {
    httputils.post(host, getURL('getAllType'), port, null, function(err, data) {
        if (err) {
            resp.status(500).send('Server Error !');
            return;
        } else {
            resp.render('alltypes.html', {
                types: data
            });
        }
    });
});

// 处理/deleteType请求
router.post('/deleteType', function(req, resp) {
    var params = req.body;
    if (!isValid(params.id)) {
        resp.json({
            status: 'failed',
            message: 'id不合法!'
        });
        return;
    }
    if (params.id === '0') {
        resp.json({
            status: 'failed',
            message: '不能删除默认随笔类型!'
        });
        return;
    }
    if (!(isValid(params.key) && params.value)) {
        resp.json({
            status: 'failed',
            message: '令牌不合法!'
        });
        return;
    }
    httputils.post(host, getURL('deleteTypeById'), port, params, function(err, data) {
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
