// 导入文件操作库
let fs = require('fs');
// 导入path库
let path = require('path');
// 导入自己封装http请求的工具
let httputils = require(path.join(__dirname, '../utils/httputils'));
// 导入操作Mongodb的库
let runInfo = require(path.join(__dirname, '../utils/mongodb')).RunInfo;
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

router.get('/comment', function(req, resp) {
   let params = req.query;
   if (!isValid(params.essayId)) {
      resp.send('参数错误!');
      return;
   }
   let p1 = new Promise(function (resolve, reject) {
      CommentUtils.getCommentsByEssayId(params, function(err, res) {
         if (err || !res || res.length === 0) {
            reject(err || '服务器无此记录');
         } else {
            resolve(res);
         }
      });
   });
   let p2 = p1.then(function (res) {
      if (res) {
         resp.render('comment.html', {comments: res, id: params.essayId});
      }
   }, function (err) {
      return new Promise(function(resolve, reject) {
         httputils.post(host, getURL('getCommentsByEssayId'), port, params, function(err, res) {
            if (err) {
               reject(err);
            } else {
               resolve(res);
            }
         });
      });
   });
   p2.then(function(res) {
      if (res) {
         CommentUtils.addComments(res, function(err, res) {});
         resp.render('comment.html', {comments: res, id: params.essayId});
      }
   }, function(err) {
      resp.send(err);
   });
});

router.post('/deleteComment', function(req, resp) {
   let params = req.body;
   if (!isValid(params.id)) {
      resp.json({
         status: 'failed',
         message: '参数错误!'
      });
      return;
   }
   if (!(isValid(params.key) && isValid(params.value))) {
      resp.json({
         status: 'failed',
         message: '令牌不能为空!'
      });
      return;
   }
   httputils.post(host, getURL('deleteCommentById'), port, params, function(err, res) {
      if (err) {
         resp.json({
            status: 'failed',
            message: '服务器错误!'
         });
      } else {
         if (res.status === 'success') {
            CommentUtils.removeCommentsById(params, function(err, res){});
         }
         resp.json(res);
      }
   });
});

router.post('/addComment', function(req, resp) {
   let params = req.body;
   if (!isValid(params.essayId)) {
      resp.json({
         status: 'failed',
         message: '页面出错, 请刷新重试!'
      });
      return;
   }
   if (!(isValid(params.username) && params.content)) {
      resp.json({
         status: 'failed',
         message: '昵称或内容不能为空!'
      });
      return;
   }
   httputils.post(host, getURL('addNewComment'), port, params, function(err, res) {
      if (err) {
         resp.json({
            status: 'failed',
            message: '服务器错误!'
         });
      } else {
         if (res.status === 'success') {
            CommentUtils.removeCommentsByEssayId({essayId: params.essayId}, function(err, res) {});
         }
         resp.json(res);
      }
   });
});

module.exports = router;