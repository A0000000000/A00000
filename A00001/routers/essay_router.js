let path = require('path');
let httputils = require(path.join(__dirname, '../utils/httputils'));
let EssayUtils = require(path.join(__dirname, '../utils/mongodb')).EssayUtils;
let TypeUtils = require(path.join(__dirname, '../utils/mongodb')).TypeUtils;
let CommentUtils = require(path.join(__dirname, '../utils/mongodb')).CommentUtils;
let LogUtils = require(path.join(__dirname, '../utils/logutils'));
let static_data = require(path.join(__dirname, '../utils/static_data'));
let express = require('express');
let router = express.Router();
let showdown = require('showdown');
let converter = new showdown.Converter();
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

router.get('/essay', function (req, resp) {
   LogUtils.logInfo('Get /essay', __filename, '处理/essay的Get请求', new Date());
   let params = req.query;
   if (!isValid(params.id)) {
      resp.send('参数有误!');
      return;
   }
   let p1 = new Promise(function(resolve, reject){
      LogUtils.logInfo('Request Post isHavePassword', __filename, '向后端isHavePassword发起Post请求', new Date());
      httputils.post(host, getURL('isHavePassword'), port, params, function(err, res) {
         if (err) {
            LogUtils.logError(err, __filename, '向后端isHavePassword发起请求时, 服务器出错', new Date());
            reject(err);
         } else {
            resolve(res);
         }
      });
   });
   let p2 = p1.then(function(res) {
      if (res) {
         if (res.status === 'success') {
            if (res.message === 'true') {
               resp.render('password.html', {id: params.id});
            } else {
               return new Promise(function(resolve, reject) {
                  try {
                     LogUtils.logInfo('Try To Get Essay From MongoDB', __filename, '尝试从MongoDB中获得随笔数据.', new Date());
                     EssayUtils.getEssayById(params, function(err, ret) {
                        if (err || ret === null) {
                           LogUtils.logWarning(err || 'No Data From MongoDB', __filename, '从MongoDB中获取随笔数据失败.', new Date());
                           reject(err);
                        } else {
                           resolve(ret);
                        }
                     });
                  } catch (err) {
                     LogUtils.logWarning(err, __filename, '从MongoDB中获取随笔缓存时, 数据库访问出错.', new Date());
                     reject(err);
                  }
               });
            }
         } else {
            resp.send(res.message);
         }
      }
   }, function(err) {
      resp.send('服务器出错!');
   });
   let p3 = p2.then(function(res) {
      if (res) {
         res.content = converter.makeHtml(res.content);
         resp.render('essay.html', {essay: res});
      }
   }, function(err) {
      return new Promise(function(resolve, reject) {
         LogUtils.logInfo('Request Post getEssayById', __filename, '向后端getEssayById发起Post请求', new Date());
         httputils.post(static_data.host, getURL('getEssayById'), static_data.port, params, function(err, res) {
            if (err) {
               LogUtils.logError(err, __filename, '向后端getEssayById发起请求时, 服务器出错.', new Date());
               reject(err);
            } else {
               resolve(res);
            }
         });
      });
   });
   p3.then(function(res){
      if (res) {
         if (res.password === 'false') {
            try {
               LogUtils.logInfo('Try To Save Essay Data To MongoDB', __filename, '尝试向MongoDB中保存一条随笔记录.', new Date());
               EssayUtils.saveEssay(res, function(err, res) {
                  if (err) {
                     LogUtils.logWarning(err, __filename, '向MongoDB中保存Essay时出错.', new Date());
                  }
               });
            } catch (err) {
               LogUtils.logWarning(err, __filename, '向MongoDB中保存Essay时, 访问数据库出错.', new Date());
            }
         }
         res.content = converter.makeHtml(res.content);
         resp.render('essay.html', {essay: res});
      }
   }, function(err) {
      resp.send('服务器错误!');
   });

});

router.post('/getTypeById', function(req, resp) {
   LogUtils.logInfo('Post /getTypeById', __filename, '处理/getTypeById的Post请求.', new Date());
   let params = req.body;
   if(!isValid(params.id)) {
      resp.json({status: 'failed', message: '请求参数无效!'});
      return;
   }
   let p1 = new Promise(function(resolve, reject) {
      try {
         LogUtils.logInfo('Try To Get Type From MongoDB', __filename, '尝试从MongoDB中获得随笔类型的数据.', new Date());
         TypeUtils.getTypeById(params, function(err, res) {
            if (err || res === null) {
               LogUtils.logWarning(err || 'No Data From MongoDB', __filename, '从MongoDB中获取随笔类型失败.', new Date());
               reject(err);
            } else {
               LogUtils.logInfo('Get Type From MongoDB Success', __filename, '成功从MongoDB中获得随笔类型数据.', new Date());
               resolve(res);
            }
         });
      } catch (err) {
         reject(err);
      }
   });

   let p2 = p1.then(function(res) {
      if (res) {
         resp.json(res);
      }
   }, function(err) {
      return new Promise(function(resolve, reject) {
         LogUtils.logInfo('Request Post getTypeById', __filename, '向后端getTypeById发起Post请求', new Date());
         httputils.post(host, getURL('getTypeById'), port, params, function(err, res) {
            if (err) {
               LogUtils.logError(err, __filename, '向后端getTypeById发起请求时, 服务器出错.', new Date());
               reject(err);
            } else {
               resolve(res);
            }
         });
      });
   });

   p2.then(function(res) {
      if(res) {
         try {
            LogUtils.logInfo('Save Type To MongoDB', __filename, '向MongoDB中增加一条Type记录', new Date());
            TypeUtils.saveType(res, function(err, res){
               if (err) {
                  LogUtils.logWarning(err, __filename, '向MongoDB中保存一条随笔类型时, 保存出错.', new Date());
               }
            });
         } catch (err) {
            LogUtils.logWarning(err, __filename, '向MongoDB中保存一条随笔类型时, 访问数据库出错.', new Date());
         }
         resp.json(res);
      }
   }, function(err) {
      resp.json({status: 'failed', message: '服务器错误!'});
   })
});

router.post('/essay', function (req, resp) {
   LogUtils.logInfo('Post /essay', __filename, '处理/essay的Post请求.', new Date());
   let params = req.body;
   if (!(isValid(params.id) && isValid(params.password))) {
      resp.render('password.html', {message: res.message, id: params.id});
   }
   let p1 = new Promise(function(resolve, reject) {
      LogUtils.logInfo('Request Post getEssayById', __filename, '向后端getEssayById发送Post请求', new Date());
      httputils.post(host, getURL('getEssayById'), port, params, function(err, res) {
         if (err) {
            LogUtils.logError(err, __filename, '向后端getEssayById请求时, 服务器出错.', new Date());
            reject(err);
         } else {
            resolve(res);
         }
      });
   });
   p1.then(function(res) {
      if(res.status === 'failed') {
         resp.render('password.html', {message: res.message, id: params.id});
      } else {
         if (res.message === 'success') {
            res.content = converter.makeHtml(res.content);
            resp.render('essay.html', {essay: res});
         } else {
            resp.render('password.html', {message: res.message, id: params.id});
         }
      }
   }, function(err) {
      resp.render('password.html', {
         message: '服务器出错!'
      });
   });
});

router.post('/deleteEssay', function (req, resp) {
   LogUtils.logInfo('Post /deleteEssay', __filename, '处理/deleteEssay的Post', new Date());
   let params = req.body;
   if (!isValid(params.id)) {
      resp.json({
         status: 'failed',
         message: '页面出错, 请刷新重试.'
      });
      return;
   }
   if (!(isValid(params.key) && isValid(params.value))) {
      resp.json({
         status: 'failed',
         message: '令牌key或令牌value不能为空!'
      });
      return;
   }
   try {
      LogUtils.logInfo('Delete Essay From MongoDB', __filename, '尝试从MongoDB中删除一条Essay记录', new Date());
      EssayUtils.deleteEssay(params, function(err, res){
         if (err) {
            LogUtils.logWarning(err, __filename, '尝试从MongoDB中删除一条随笔记录出错.', new Date());
         }
      });
   } catch (err) {
      LogUtils.logWarning(err, __filename, '尝试从MongoDB中删除一条随笔记录时, 访问数据库出错.', new Date());
   }
   try {
      LogUtils.logInfo('Try To Delete Comments From MongoDB', __filename, '尝试根据随笔id删除MongoDB中的评论数据.', new Date());
      CommentUtils.removeCommentsByEssayId({essayId: params.id}, function(err, res) {
         if (err) {
            LogUtils.logWarning(err, __filename, '根据随笔id删除MongoDB评论数据出错.', new Date());
         }
      });
   } catch (err) {
      LogUtils.logWarning(err, __filename, '根据随笔id删除MongoDB评论数据时, 访问数据库出错.', new Date());
   }
   LogUtils.logInfo('Request Post deleteEssayById', __filename, '向后端deleteEssayById发起Post请求.', new Date());
   httputils.post(host, getURL('deleteEssayById'), port, params, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '向后端deleteEssayById发起请求时, 服务器出错.', new Date());
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

