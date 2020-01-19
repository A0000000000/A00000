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

// 处理/friend的get请求
router.get('/friend', function(req, resp) {
    resp.render('friend.html');
});

// 处理/addFriend的post请求
router.post('/addFriend', function(req, resp) {
    var params = req.body;
    if (!isValid(params.username)) {
        resp.json({
            status: 'failed',
            message: '请输入如何称呼您!'
        });
        return;
    }
    if (!(isValid(params.qqid) || isValid(params.wechatid) || isValid(params.phone) || isValid(params.email))) {
        resp.json({
            status: 'failed',
            message: '请至少输入一项联系方式!'
        });
        return;
    }
    httputils.post(host, getURL('addNewFriend'), port, params, function(err, data) {
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