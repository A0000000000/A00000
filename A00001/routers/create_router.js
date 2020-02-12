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

router.get('/create', function(req, resp) {
   LogUtils.logInfo('Get /create', __filename, '处理/create的Get请求', new Date());
   LogUtils.logInfo('Request Post getAllType', __filename, '向后端getAllType发起Post请求', new Date());
   httputils.post(host, getURL('getAllType'), port, null, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '向后端getAllType发起请求时, 请求出错.', new Date());
         resp.send('服务器出错!');
         return;
      }
      resp.render('create.html', {types: res});
   });
});

router.post('/addNewEssay', function(req, resp) {
   LogUtils.logInfo('Post /addNewEssay', __filename, '处理/addNewEssay的Post请求', new Date());
   let params = req.body;
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
   LogUtils.logInfo('Request Post addNewEssay', __filename, '向后端addNewEssay发起Post请求', new Date());
   httputils.post(host, getURL('addNewEssay'), port, params, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '向后端addNewEssay发起请求时, 服务器出错', new Date());
         resp.json({
            status: 'failed',
            message: '服务器错误!'
         });
      } else {
         resp.json(res);
      }
   });
});

module.exports = router;