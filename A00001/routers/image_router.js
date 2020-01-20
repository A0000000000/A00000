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

// 删除文件
function deleteFiles(files) {
    files.forEach(function(item, index) {
       fs.unlink(item.path, function(err) {
          if (err) {
          }
       });
    });
 }
 
 // 处理/addImages的post请求
router.post('/addImages', function(req, resp) {
   var kv = req.body;
   var files = req.files;
   if (!(isValid(kv.key) && isValid(kv.value))) {
      resp.json({
         status: 'failed',
         message: '令牌不合法!'
      });
      deleteFiles(files);
      return;
   }
   if (files.length <= 0) {
      resp.json({
         status: 'failed',
         message: '您没有选择文件!'
      });
      deleteFiles(files);
      return;
   }
   var params = {};
   params.key = kv.key;
   params.value = kv.value;
   var filesdata = [];
   files.forEach(function(item, index) {
      var file = {};
      if (isValid(kv.password)) {
         file.password = kv.password;
      }
      file.originalname = item.originalname;
      file.filename = item.filename;
      file.path = '/' + item.path.replace(/\\/g,"/");
      filesdata.push(file);
   });
   params.images = JSON.stringify(filesdata);
   httputils.post(host, getURL('saveImages'), port, params, function(err, data) {
      if (err) {
         resp.json({
            status: 'failed',
            message: 'Server Error !'
         });
         deleteFiles(files);
         return;
      } else {
         if (data.status === 'failed') {
            deleteFiles(files);
         }
         resp.json(data);
      }
   });
});

// 处理/allImages的get请求
router.get('/allImages', function(req, resp) {
   httputils.post(host, getURL('getAllImagesMsg'), port, null, function(err, data) {
      if (err) {
         resp.status(500).send('Server Error !');
         return;
      } else {
         var left = [];
         var right = [];
         data.forEach(function(item, index) {
            if (index < data.length / 2) {
               left.push(item);
            } else {
               right.push(item);
            }
         });
         resp.render('allImages.html', {
            left: left,
            right: right
         });
      }
   });
});

// 处理/getImageById的post请求
router.post('/getImageById', function(req, resp) {
   var params = req.body;
   if (!isValid(params.id)) {
      resp.json({
         status: 'failed',
         message: '参数错误!'
      });
      return;
   }
   httputils.post(host, getURL('getImageById'), port, params, function(err, data) {
      if (err) {
         resp.json({
            status: 'failed',
            message: 'Server Error!'
         });
      } else {
         resp.json(data);
      }
   });
});

// 处理/deleteImageById的post请求
router.post('/deleteImageById', function(req, resp) {
   var params = req.body;
   if (!(isValid(params.id) && isValid(params.path))) {
      resp.json({
         status: 'failed',
         message: 'id或path不能为空!'
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
   var deletePath = '.' + params.path;
   httputils.post(host, getURL('deleteImageById'), port, params, function(err, data) {
      if (err) {
         resp.json({
            status: 'failed',
            message: 'Server Error!'
         });
         return;
      } else {
         if (data.status === 'success') {
            fs.unlink(deletePath, function(err) {
               if (err) {
               }
            });
         }
         resp.json(data);
      }
   });
});

module.exports = router;