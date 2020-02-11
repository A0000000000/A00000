// 导入文件操作库
let fs = require('fs');
// 导入path库
let path = require('path');
// 导入自己封装http请求的工具
let httputils = require(path.join(__dirname, '../utils/httputils'));
// 导入操作Mongodb的库
let EssayUtils = require(path.join(__dirname, '../utils/mongodb')).EssayUtils;
let TypeUtils = require(path.join(__dirname, '../utils/mongodb')).TypeUtils;
let CommentUtils = require(path.join(__dirname, '../utils/mongodb')).CommentUtils;

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

router.get('/updateEssay', function(req, resp) {
    let params = req.query;
    new Promise(function(resolve, reject) {
        httputils.post(host, getURL('getEssayById'), port, params, function(err, res) {
            if (err) {
                reject('服务器错误!');
            } else {
                if (res.status === 'failed') {
                    reject(res.message);
                } else {
                    if (res.message !== 'success') {
                        reject(res.message);
                    } else {
                        resolve(res);
                    }
                }
            }
        });
    }).then(function(essay) {
        if (essay) {
            httputils.post(host, getURL('getAllType'), port, null, function(err, types) {
                if (err) {
                    resp.send('服务器错误');
                } else {
                    essay.password = params.password;
                    resp.render('update.html', {essay: essay, types: types});
                }
            });
        }
    }, function(msg) {
        resp.send(msg);
    });
});

router.post('/updateEssay', function(req, resp) {
    let params = req.body;
    if (!isValid(params.id)) {
        resp.json({
            status: 'failed',
            message: '页面出错, 请刷新重试.'
         });
        return;
    }
    if (!isValid(params.title)) {
        resp.json({
           status: 'failed',
           message: '标题不能为空!'
        });
        return;
    }
    if (!isValid(params.creator)) {
        resp.json({
           status: 'failed',
           message: '作者不能为空!'
        });
        return;
    }
    if (!isValid(params.key)) {
        resp.json({
           status: 'failed',
           message: '令牌Key不能为空!'
        });
        return;
    }
    if (!isValid(params.value)) {
        resp.json({
           status: 'failed',
           message: '令牌Value不能为空!'
        });
        return;
    }
    if (!isValid(params.content)) {
        resp.json({
           status: 'failed',
           message: '内容不能为空!'
        });
        return;
    }
    if (!isValid(params.typeid)) {
        resp.json({
           status: 'failed',
           message: '类别不能为空!'
        });
        return;
    }
    EssayUtils.deleteEssay({id: params.id}, function(err, res) {});
    let p1 = new Promise(function(resolve, reject) {
        httputils.post(host, getURL('updateEssay'), port, params, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
    p1.then(function(res) {
        if (res) {
            resp.json(res);
        }
    }, function(err) {
        if (err) {
            resp.json({
                status: 'failed',
                message: '服务器错误!'
            });
        }
    });
});

module.exports = router;

