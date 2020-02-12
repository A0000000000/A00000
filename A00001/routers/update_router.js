let path = require('path');
let httputils = require(path.join(__dirname, '../utils/httputils'));
let EssayUtils = require(path.join(__dirname, '../utils/mongodb')).EssayUtils;
let LogUtils = require(path.join(__dirname, '../utils/logutils'));
let static_data = require(path.join(__dirname, '../utils/static_data'));
let express = require('express');
let router = express.Router();
let host = static_data.host;
let port = static_data.port;
let getURL = function(str) {
   return static_data.before + str + static_data.after;
}
let isValid = function(str) {
   if (str === undefined || str === null || str === "") {
      return false;
   }
   return true;
}

router.get('/updateEssay', function(req, resp) {
    LogUtils.logInfo('Get /updateEssay', __filename, '处理/updateEssay的Get请求.', new Date());
    let params = req.query;
    new Promise(function(resolve, reject) {
        LogUtils.logInfo('Request Post getEssayById', __filename, '向后端/getEssayById发起Post请求.', new Date());
        httputils.post(host, getURL('getEssayById'), port, params, function(err, res) {
            if (err) {
                LogUtils.logError(err, __filename, '向后端getEssayById请求时, 服务器出错.', new Date());
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
            LogUtils.logInfo('Request Post getAllType', __filename, '向后端getAllType发起Post请求时.', new Date());
            httputils.post(host, getURL('getAllType'), port, null, function(err, types) {
                if (err) {
                    LogUtils.logError(err, __filename, '向后端发起getAllType请求时, 服务器出错.', new Date());
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
    LogUtils.logInfo('Post /updateEssay', __filename, '处理/updateEssay的Post请求.', new Date());
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
    try {
        LogUtils.logInfo('Delete Essay From MongoDB', __filename, '从MongoDB中删除修改的Essay记录.', new Date());
        EssayUtils.deleteEssay({id: params.id}, function(err, res) {
            LogUtils.logWarning(err, __filename, '从MongoDB中删除修改的Essay时, 出错.', new Date());
        });
    } catch (err) {
        LogUtils.logWarning(err, __filename, '从MongoDB中删除修改的Essay时, 访问数据库出错.', new Date());
    }
    let p1 = new Promise(function(resolve, reject) {
        LogUtils.logInfo('Request Post updateEssay', __filename, '向后端updateEssay发起Post请求.', new Date());
        httputils.post(host, getURL('updateEssay'), port, params, function(err, res) {
            if (err) {
                LogUtils.logError(err, __filename, '向后端updateEssay发起请求时, 服务器出错.', new Date());
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

