let path = require('path');
let httputils = require(path.join(__dirname, '../utils/httputils'));
let CommentUtils = require(path.join(__dirname, '../utils/mongodb')).CommentUtils;
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

router.get('/comment', function(req, resp) {
   LogUtils.logInfo('Get /comment', __filename, '处理/comment的Get请求', new Date());
   let params = req.query;
   if (!isValid(params.essayId)) {
      resp.send('参数错误!');
      return;
   }
   let p1 = new Promise(function (resolve, reject) {
      try {
         LogUtils.logInfo('Try Get Comment Data From MongoDB', __filename, '尝试从MongoDB的缓存中获取评论数据', new Date());
         CommentUtils.getCommentsByEssayId(params, function(err, res) {
            if (err || !res || res.length === 0) {
               LogUtils.logWarning(err || 'No Comment From MongoDB', __filename, '缓存命中失败, 从MongoDB中没有取到Comment的数据', new Date());
               reject(err || '服务器无此记录');
            } else {
               resolve(res);
            }
         });
      } catch (err) {
         LogUtils.logWarning(err, __filename, '在从MongoDB中取Comment的数据时, 访问数据库出错.', new Date());
         reject(err);
      }
   });
   let p2 = p1.then(function (res) {
      if (res) {
         LogUtils.logInfo('Get Comment Data From MongoDB Success', __filename, '缓存命中成功, 成功从MongoDB中取到Comment的数据', new Date());
         resp.render('comment.html', {comments: res, id: params.essayId});
      }
   }, function (err) {
      return new Promise(function(resolve, reject) {
         LogUtils.logInfo('Request Post getCommentsByEssayId', __filename, '向后端getCommentsByEssayId发起Post请求', new Date());
         httputils.post(host, getURL('getCommentsByEssayId'), port, params, function(err, res) {
            if (err) {
               LogUtils.logError(err,  __filename, '访问后端getCommentsByEssayId时, 服务器出错', new Date());
               reject(err);
            } else {
               resolve(res);
            }
         });
      });
   });
   p2.then(function(res) {
      if (res) {
         try {
            LogUtils.logInfo('Save Comment To MongoDB', __filename, '向MongoDB中保存评论信息', new Date());
            CommentUtils.addComments(res, function(err, res) {
               if (err) {
                  LogUtils.logWarning(err, __filename, '向MongoDB中保存评论信息时出错', new Date());
               } 
            });
         } catch (err) {
            LogUtils.logWarning(err, __filename, '向MongoDB中保存评论信息时, 访问数据库出错.', new Date());
         }
         resp.render('comment.html', {comments: res, id: params.essayId});
      }
   }, function(err) {
      resp.send(err);
   });
});

router.post('/deleteComment', function(req, resp) {
   LogUtils.logInfo('Post /deleteComment', __filename, '处理/deleteComment的Post请求', new Date());
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
   LogUtils.logInfo('Request Post deleteCommentById', __filename, '向后端deleteCommentById发起Post请求', new Date());
   httputils.post(host, getURL('deleteCommentById'), port, params, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '向后端deleteCommentById发起请求时, 服务器出错.', new Date());
         resp.json({
            status: 'failed',
            message: '服务器错误!'
         });
      } else {
         if (res.status === 'success') {
            try {
               CommentUtils.removeCommentsById(params, function(err, res){
                  if (err) {
                     LogUtils.logWarning(err, __filename, '后端评论删除成功, MongoDB评论信息删除出错', new Date());
                  }
               });
            } catch (err) {
               LogUtils.logWarning(err, __filename, 'MongoDB删除评论信息时, MongoDB访问出错.', new Date());
            }
         }
         resp.json(res);
      }
   });
});

router.post('/addComment', function(req, resp) {
   LogUtils.logInfo('Post /addComment', __filename, '处理/addComment的Post请求', new Date());
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
   LogUtils.logInfo('Request Post addNewComment', __filename, '向后端发起addNewComment请求', new Date());
   httputils.post(host, getURL('addNewComment'), port, params, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '当请求后端addNewComment时, 服务器出错.', new Date());
         resp.json({
            status: 'failed',
            message: '服务器错误!'
         });
      } else {
         if (res.status === 'success') {
            try {
               LogUtils.logInfo('Delete Comment From MongoDB', __filename, '后端评论数据发送变化, 清空MongoDB的缓存', new Date());
               CommentUtils.removeCommentsByEssayId({essayId: params.essayId}, function(err, res) {
                  if (err) {
                     LogUtils.logWarning(err, __filename, '清空MongoDB的评论数据时, 删除数据出错', new Date());
                  }
               });
            } catch (err) {
               LogUtils.logWarning(err, __filename, '清空MongoDB的评论数据时, 访问数据库出错', new Date());
            }
         }
         resp.json(res);
      }
   });
});

module.exports = router;