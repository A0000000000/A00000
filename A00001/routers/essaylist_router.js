let path = require('path');
let httputils = require(path.join(__dirname, '../utils/httputils'));
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

router.get('/essaylist', function(req, resp) {
    LogUtils.logInfo('get /essaylist', __filename, '处理/essaylist的Get请求', new Date());
    let params = req.query;
    if (!isValid(params.page)) {
        params.page = 1;
    }
    if (!isValid(params.size)) {
        params.size = 10;
    }
    LogUtils.logInfo('Request Post getAllEssayTitle', __filename, '向后端getAllEssayTitle发起Post请求', new Date());
    httputils.post(host, getURL('getAllEssayTitle'), port, params, function(err, res) {
        if (err) {
            LogUtils.logError(err, __filename, '向后端getAllEssayTitle发起请求时, 服务器出错.', new Date());
            resp.send('服务器错误, 请稍后再试!');
        } else {
            resp.render('essaylist.html', {list: res});
        }
    });
});

router.post('/getPages', function(req, resp) {
    LogUtils.logInfo('Post /getPages', __filename, '处理/getPages的Post请求.', new Date());
    let params = req.body;
    LogUtils.logInfo('Request Post getPagesCount', __filename, '向后端getPagesCount发起Post请求.', new Date());
    httputils.post(host, getURL('getPagesCount'), port, params, function(err, res) {
        if (err) {
            LogUtils.logError(err, __filename, '向后端getPagesCount发起请求时, 服务器出错.', new Date());
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