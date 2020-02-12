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

router.get('/friend', function(req, resp) {
   LogUtils.logInfo('Get /friend', __filename, '处理/friend的Get请求', new Date());
   resp.render('friend.html');
});

router.post('/addNewFriend', function(req, resp) {
   LogUtils.logInfo('Post /addNewFriend', __filename, '处理/addNewFriend的Post请求', new Date());
   let params = req.body;
   if (!isValid(params.username)) {
      resp.json({
         status: 'failed',
         message: '请留下您的称呼!'
      });
      return;
   }
   if (!(isValid(params.telephone) || isValid(params.qqid) || isValid(params.wechatid) || isValid(params.email))) {
      resp.json({
         status: 'failed',
         message: '请至少留下一项联系方式!'
      });
      return;
   }
   LogUtils.logInfo('Request Post addNewFriend', __filename, '向后端addNewFriend发起Post请求.', new Date());
   httputils.post(host, getURL('addNewFriend'), port, params, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '向后端addNewFriend发起请求时, 服务器出错.', new Date());
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