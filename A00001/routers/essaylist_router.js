// 导入文件操作库
let fs = require('fs');
// 导入path库
let path = require('path');
// 导入自己封装http请求的工具
let httputils = require(path.join(__dirname, '../utils/httputils'));
// 导入操作Mongodb的库
let runInfo = require(path.join(__dirname, '../utils/mongodb')).RunInfo;
// 导入静态数据
let static_data = require(path.join(__dirname, '../utils/static_data'));
// 导入express框架
let express = require('express');

// 创建express路由
let router = express.Router();

// 导入showdown的库
let showdown = require('showdown');

// 创建解析器
let converter = new showdown.Converter();

// 请求主机地址
let host = static_data.host;

// 请求主机的端口
let port = static_data.port;

// 获取请求URL的地址
let getURL = function(str) {
   return static_data.before + str + static_data.after;
}

// 判断是否具有某个参数
let isValid = function(str) {
   if (str === undefined || str === null || str === "") {
      return false;
   }
   return true;
}

router.get('/essaylist', function(req, resp) {
    let params = req.query;
    if (!isValid(params.page)) {
        params.page = 1;
    }
    if (!isValid(params.size)) {
        params.size = 10;
    }
    httputils.post(host, getURL('getAllEssayTitle'), port, params, function(err, res) {
        if (err) {
            resp.send('服务器错误, 请稍后再试!');
        } else {
            resp.render('essaylist.html', {list: res});
        }
    });
});

router.post('/getPages', function(req, resp) {
    let params = req.body;
    httputils.post(host, getURL('getPagesCount'), port, params, function(err, res) {
        if (err) {
            resp.json({
                status: 'failed',
                msg: '服务器错误, 请稍后再试!'
            });
        } else {
            resp.json(res);
        }
    });
});


module.exports = router;