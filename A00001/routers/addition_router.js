// 导入文件操作库
let fs = require('fs');
// 导入path库
let path = require('path');
// 导入自己封装http请求的工具
let httputils = require(path.join(__dirname, '../utils/httputils'));
// 导入操作Mongodb的库
let ImageUtils = require(path.join(__dirname, '../utils/mongodb')).ImageUtils;
let TypeUtils = require(path.join(__dirname, '../utils/mongodb')).TypeUtils;
let EssayUtils = require(path.join(__dirname, '../utils/mongodb')).EssayUtils;
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

router.get('/addition', function(req, resp) {
   resp.render('addition.html')
});

// 图片处理部分
function deleteFiles(files) {
   files.forEach(function(item, index) {
      fs.unlink(item.path, function(err) {
         if (err) {
         }
      });
   });
}

router.post('/uploadImage', function(req, resp) {
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

router.get('/images', function(req, resp) {
   httputils.post(host, getURL('getAllImagesMsg'), port, null, function(err, res) {
      if (err) {
         resp.send('服务器错误!');
      } else {
         resp.render('image.html', {images: res});
      }
   });
});

router.post('/getImageById', function(req, resp) {
   let params = req.body;
   if (!isValid(params.id)) {
      resp.json({
         status: 'failed',
         message: '页面出错, 请刷新重试!'
      });
      return;
   }
   let p1 = new Promise(function(resolve, reject) {
      ImageUtils.getImageById(params, function(err, res) {
         if (err || res === null) {
            reject(err || '数据库无此记录!');
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
         httputils.post(host, getURL('getImageById'), port, params, function(err, res) {
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
         if(res.status === 'success' && res.password === 'false') {
            ImageUtils.saveImage(res, function(err, res) {});
         }
         resp.json(res);
      }
   }, function(err) {
      resp.json({
         status: 'failed',
         message: '服务器错误!'
      });
   });
});

router.post('/deleteImageById', function(req, resp) {
   let params = req.body;
   if (!(isValid(params.id) && isValid(params.path))) {
      resp.json({
         status: 'failed',
         message: '页面出错, 请刷新后重试!' 
      });
      return;
   }
   if (!(isValid(params.key) && isValid(params.value))) {
      resp.json({
         status: 'failed',
         message: '请输入令牌!' 
      });
      return;
   }
   let deletePath = '.' + params.path;
   httputils.post(host, getURL('deleteImageById'), port, params, function(err, data) {
      if (err) {
         resp.json({
            status: 'failed',
            message: 'Server Error!'
         });
         return;
      } else {
         if (data.status === 'success') {
            ImageUtils.deleteImage({id: params.id}, function(err, res) {});
            fs.unlink(deletePath, function(err) {});
         }
         resp.json(data);
      }
   });
});

// 随笔类型处理部分
router.post('/addType', function(req, resp) {
   let params = req.body;
   if (!isValid(params.name)) {
       resp.json({status: 'failed', message: '名称不能为空!'});
   }
   if (!(isValid(params.key) && isValid(params.value))) {
       resp.json({status: 'failed', message: '参数不合法!'});
   }
   httputils.post(host, getURL('addNewType'), port, params, function(err, data) {
       if (err) {
           resp.json({
               status: 'failed',
               message: 'Server Error !'
           });
           return;
       } else {
           resp.json(data);
       }
   });
});

router.get('/types', function(req, resp) {
   httputils.post(host, getURL('getAllType'), port, null, function(err, res) {
      if (err) {
         resp.send('服务器错误!');
      } else {
         resp.render('type.html', {types: res});
      }
   });
});

router.post('/deleteType', function(req, resp) {
   let params = req.body;
   if (!isValid(params.id)) {
      resp.json({
          status: 'failed',
          message: '页面出错, 请刷新重试!'
      });
      return;
  }
  if (params.id === '0') {
      resp.json({
          status: 'failed',
          message: '不能删除默认随笔类型!'
      });
      return;
  }
  if (!(isValid(params.key) && params.value)) {
      resp.json({
          status: 'failed',
          message: '令牌不合法!'
      });
      return;
  }
  httputils.post(host, getURL('deleteTypeById'), port, params, function(err, data) {
      if (err) {
          resp.json({
              status: 'failed',
              message: '服务器错误!'
          });
          return;
      } else {
         if (data.status === 'success'){
            TypeUtils.deleteType({id: params.id}, function(err, res) {});
            EssayUtils.deleteEssayByType({typeid: params.id}, function(err, res) {});
         }
         resp.json(data);
      }
  });
});

module.exports = router;

