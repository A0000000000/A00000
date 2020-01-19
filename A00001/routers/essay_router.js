// 导入文件操作库
var fs = require('fs');
// 导入path库
var path = require('path');
// 导入自己封装http请求的工具
var httputils = require(path.join(__dirname, '../utils/httputils'));
// 导入静态数据
var static_data = require(path.join(__dirname, '../utils/static_data'));
// 导入express框架
var express = require('express');

// 创建express路由
var router = express.Router();

// 导入showdown的库
var showdown = require('showdown');

// 创建解析器
var converter = new showdown.Converter();

// 请求主机地址
var host = static_data.host;

// 请求主机的端口
var port = static_data.port;

// 获取请求URL的地址
var getURL = function(str) {
    return static_data.before + str + static_data.after;
}

// 判断是否具有某个参数
var isValid = function(str) {
   if (str === undefined || str === null || str === "") {
      return false;
   }
   return true;
}


// 处理/essay的get请求
router.get('/essay', function(req, resp) {
   var id = req.query.id;
   if (!isValid(id)) {
      resp.render('error.html', {
         status: 'failed',
         message: '请求参数有误!'
      });
      return;
   }
   httputils.post(host, getURL('isHavePassword'), port, { id: id }, function(err, data) {
      if (err) {
         resp.status(500).send('Server Error !');
         console.log(err);
         return;
      }
      if (data.status === 'failed') {
         resp.send(data.message);
      } else {
         if (data.message === 'true') {
            resp.render('password.html', {
               id: id
            });
         } else {
            httputils.post(host, getURL('getEssayById'), port, { id: id , password: '' }, function(err, essay) {
               if (err) {
                  resp.status(500).send('Server Error !');
                  console.log(err);
                  return;
               }
               if (essay.status === 'failed') {
                  resp.send(essay.message);
               } else {
                  httputils.post(host, getURL('getTypeById'), port, { id: essay.typeid }, function(err, type) {
                     if (err) {
                        resp.status(500).send('Server Error !');
                        return;
                     }
                     essay.content = converter.makeHtml(essay.content);
                     resp.render('essay.html', {
                        essay: essay,
                        type: type
                     });
                  });
               }
            });
         }
      }
   });
});
 
// 处理/essay的post请求
router.post('/essay', function(req, resp) {
   var params = req.body;
   if (!(isValid(params.id) && isValid(params.password))) {
      resp.render('password.html', {
         status: 'failed',
         message: '请求参数有误!',
         id: params.id
      });
      return;
   }
   httputils.post(host, getURL('getEssayById'), port, params, function(err, data) {
      if (err) {
         resp.status(500).send('Server Error !');
      } else {
         if (data.status === 'failed') {
            resp.send(data.message);
         } else {
            if (data.message === 'success') {
               httputils.post(host, getURL('getTypeById'), port, {id: data.typeid}, function(err, type) {
                  if (err) {
                     resp.status(500).send('Server Error !');
                     return;
                  } else {
                     data.content = converter.makeHtml(data.content);
                     resp.render('essay.html', {essay: data, type: type});
                  }
               });
            } else {
               data.id = req.body.id;
               resp.render('password.html', data);
            }
         }
      }
   });
});

// 处理/deleteEssay的post请求
router.post('/deleteEssay', function(req, resp) {
   var params = req.body;
   if (!(isValid(params.id) && isValid(params.key) && isValid(params.value))) {
      resp.json({
         status: 'failed',
         message: '请求参数有误!'
      });
      return;
   }
   httputils.post(host, getURL('deleteEssayById'), port, params, function(err, data) {
      if (data.status === 'success') {
         resp.json(data);
      } else {
         resp.json(data);
      }
   });
});

// 处理/createEssay的get请求
router.get('/createEssay', function(req, resp) {
   httputils.post(host, getURL('getAllType'), port, null, function(err, data) {
      if (err) {
         resp.status(500).send('Server Error !');
      } else {
         resp.render('create.html', {types: data});
      }
   });
});

// 处理/createEssay的post请求
router.post('/createEssay', function(req, resp) {
   var params = req.body;
   if (!isValid(params.title)) {
      resp.json({status: 'failed', message: '标题不能为空!' });
      return;
   }
   if (!isValid(params.creator)) {
      resp.json({status: 'failed', message: '作者不能为空!' });
      return;
   }
   if (!(isValid(params.key) && isValid(params.value))) {
      resp.json({status: 'failed', message: 'key或value不能为空!' });
      return;
   }
   if (!isValid(params.typeid)) {
      resp.json({status: 'failed', message: '类型不能为空!' });
      return;
   }
   if (!isValid(params.content)) {
      resp.json({status: 'failed', message: '内容不能为空!' });
      return;
   }
   httputils.post(host, getURL('addNewEssay'), port, params, function(err, data) {
      if (err) {
         resp.json({status: 'failed', message: 'Server Error!'});
      } else {
         resp.json(data);
      }
   });
});

// 处理/validPassword的post请求
router.post('/validPassword', function(req, resp) {
   var params = req.body;
   if (!isValid(params.id)) {
      resp.json({
         status: 'failed',
         message: 'id不能为空!'
      });
      return;
   }
   httputils.post(host, getURL('getEssayById'), port, params, function(err, data) {
      if (err) {
         resp.json({
            status: 'failed',
            message: 'Server Error !'
         });
         return;
      } else {
         if (data.status === 'failed') {
            resp.json({status: 'failed', message: '随笔不见了~~~'});
         } else {
            if (data.message === 'success') {
               resp.json({status: 'success', message: 'ok'});
            } else {
               resp.json({status: 'failed', message: '密码错误!'});
            }
         }
      }
   });
});

// 处理/update的get请求
router.get('/update', function(req, resp) {
   var params = req.query;
   if (!isValid(params.id)) {
      resp.status(500).send('Server Error !');
      return;
   }
   httputils.post(host, getURL('getEssayById'), port, params, function(err, data) {
      if (err) {
         console.log(err);
         resp.status(500).send('Server Error !');
         return;
      }
      if (data.status === 'failed'){
         resp.status(500).send(data.message);
         return;
      }
      if (!(data.message === 'success')) {
         resp.status(500).send(data.message);
         return;
      }
      httputils.post(host, getURL('getAllType'), port, null, function(err, types) {
         if (err) {
            console.log(err);
            resp.status(500).send('Server Error !');
            return;
         }
         resp.render('update.html', {
            essay: data,
            types: types,
            password: params.password
         });
      });
   });
});

//处理/updateEssay的post请求
router.post('/updateEssay', function(req, resp) {
   var params = req.body;
   if (!isValid(params.id)){
      resp.json({status: 'failed', message: '页面出错! 请刷新后重试!' });
      return;
   }
   if (!isValid(params.title)) {
      resp.json({status: 'failed', message: '标题不能为空!' });
      return;
   }
   if (!isValid(params.creator)) {
      resp.json({status: 'failed', message: '作者不能为空!' });
      return;
   }
   if (!(isValid(params.key) && isValid(params.value))) {
      resp.json({status: 'failed', message: 'key或value不能为空!' });
      return;
   }
   if (!isValid(params.typeid)) {
      resp.json({status: 'failed', message: '类型不能为空!' });
      return;
   }
   if (!isValid(params.content)) {
      resp.json({status: 'failed', message: '内容不能为空!' });
      return;
   }
   httputils.post(host, getURL('updateEssay'), port, params, function(err, data) {
      if (err) {
         console.log(err);
         resp.json({status: 'failed', message: 'Server Error !'});
         return;
      }
      resp.json(data);
   });
   
});
 
module.exports = router;