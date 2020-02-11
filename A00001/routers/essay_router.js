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

router.get('/essay', function (req, resp) {
   let params = req.query;
   if (!isValid(params.id)) {
      resp.send('参数有误!');
      return;
   }
   let p1 = new Promise(function(resolve, reject){
      httputils.post(host, getURL('isHavePassword'), port, params, function(err, res) {
         if (err) {
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
                  EssayUtils.getEssayById(params, function(err, ret) {
                     if (err || ret === null) {
                        reject(err);
                     } else {
                        resolve(ret);
                     }
                  });
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
         httputils.post(static_data.host, getURL('getEssayById'), static_data.port, params, function(err, res) {
            if (err) {
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
            EssayUtils.saveEssay(res, function(err, res) {});
         }
         res.content = converter.makeHtml(res.content);
         resp.render('essay.html', {essay: res});
      }
   }, function(err) {
      resp.send('服务器错误!');
   });

});

router.post('/getTypeById', function(req, resp) {
   let params = req.body;
   if(!isValid(params.id)) {
      resp.json({status: 'failed', message: '请求参数无效!'});
      return;
   }
   let p1 = new Promise(function(resolve, reject) {
      TypeUtils.getTypeById(params, function(err, res) {
         if (err || res === null) {
            reject(err);
         } else {
            resolve(res);
         }
      });
   });

   let p2 = p1.then(function(res) {
      if (res) {
         resp.json(res);
      }
   }, function(err) {
      return new Promise(function(resolve, reject) {
         httputils.post(host, getURL('getTypeById'), port, params, function(err, res) {
            if (err) {
               reject(err);
            } else {
               resolve(res);
            }
         });
      });
   });

   p2.then(function(res) {
      if(res) {
         TypeUtils.saveType(res, function(err, res){});
         resp.json(res);
      }
   }, function(err) {
      resp.json({status: 'failed', message: '服务器错误!'});
   })
});

router.post('/essay', function (req, resp) {
   let params = req.body;
   if (!(isValid(params.id) && isValid(params.password))) {
      resp.render('password.html', {message: res.message, id: params.id});
   }
   let p1 = new Promise(function(resolve, reject) {
      httputils.post(host, getURL('getEssayById'), port, params, function(err, res) {
         if (err) {
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
   EssayUtils.deleteEssay(params, function(err, res){});
   CommentUtils.removeCommentsByEssayId({essayId: params.id}, function(err, res) {});
   httputils.post(host, getURL('deleteEssayById'), port, params, function(err, res) {
      if (err) {
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

