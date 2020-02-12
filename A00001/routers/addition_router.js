let fs = require('fs');
let path = require('path');
let httputils = require(path.join(__dirname, '../utils/httputils'));
let ImageUtils = require(path.join(__dirname, '../utils/mongodb')).ImageUtils;
let TypeUtils = require(path.join(__dirname, '../utils/mongodb')).TypeUtils;
let EssayUtils = require(path.join(__dirname, '../utils/mongodb')).EssayUtils;
let static_data = require(path.join(__dirname, '../utils/static_data'));
let LogUtils = require(path.join(__dirname, '../utils/logutils'));
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
router.get('/addition', function(req, resp) {
   LogUtils.logInfo('Get /addition', __filename, '处理/addition的Get请求', new Date());
   resp.render('addition.html')
});
function deleteFiles(files) {
   LogUtils.logWarning('Delete Files', __filename, '删除文件的工具方法', new Date());
   files.forEach(function(item, index) {
      fs.unlink(item.path, function(err) {
         if (err) {
            LogUtils.logError(err, __filename, '删除文件出错信息', new Date());
         }
      });
   });
}
router.post('/uploadImage', function(req, resp) {
   LogUtils.logInfo('Post /uploadImage'. __filename, '处理/uploadImage的Post请求', new Date());
   var kv = req.body;
   var files = req.files;
   if (!(isValid(kv.key) && isValid(kv.value))) {
      resp.json({
         status: 'failed',
         message: '令牌不合法!'
      });
      LogUtils.logInfo('Call Delete Files', __filename, '令牌不合法时调用删除文件的位置', new Date());
      deleteFiles(files);
      return;
   }
   if (files.length <= 0) {
      resp.json({
         status: 'failed',
         message: '您没有选择文件!'
      });
      LogUtils.logInfo('Call Delete Files', __filename, '当文件个数小于0时', new Date());
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
   LogUtils.logInfo('Request Post saveImages', __filename, '向后台发起Post请求, 请求地址为saveImages', new Date());
   httputils.post(host, getURL('saveImages'), port, params, function(err, data) {
      if (err) {
         LogUtils.logError(err, __filename, '向后台请求saveImages, 出错时', new Date());
         resp.json({
            status: 'failed',
            message: 'Server Error !'
         });
         LogUtils.logInfo('Call Delete Files', __filename, '请求出错时, 删除文件', new Date());
         deleteFiles(files);
         return;
      } else {
         if (data.status === 'failed') {
            LogUtils.logInfo('Call Delete Files', __filename, '后台存数据库出错时, 删除文件', new Date());
            deleteFiles(files);
         }
         resp.json(data);
      }
   });
});

router.get('/images', function(req, resp) {
   LogUtils.logInfo('Get /images', __filename, '处理/images的get请求', new Date());
   LogUtils.logInfo('Request Post getAllImagesMsg', __filename, '向后台发起Post请求, 请求地址为getAllImagesMsg', new Date());
   httputils.post(host, getURL('getAllImagesMsg'), port, null, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '向后台请求getAllImagesMsg时, 服务器出错', new Date());
         resp.send('服务器错误!');
      } else {
         resp.render('image.html', {images: res});
      }
   });
});

router.post('/getImageById', function(req, resp) {
   LogUtils.logInfo('Get /getImageById', __filename, '处理/getImageById的get请求', new Date());
   let params = req.body;
   if (!isValid(params.id)) {
      resp.json({
         status: 'failed',
         message: '页面出错, 请刷新重试!'
      });
      return;
   }
   let p1 = new Promise(function(resolve, reject) {
      try {
         LogUtils.logInfo('Try To Get Data From MongoDB', __filename, '尝试从MongoDB中取图片信息', new Date());
         ImageUtils.getImageById(params, function(err, res) {
            if (err || res === null) {
               LogUtils.logWarning(err || 'No Data', __filename, '从MongoDB中没有取到图片信息', new Date());
               reject(err || '数据库无此记录!');
            } else {
               resolve(res);
            }
         });
      } catch (err) {
         LogUtils.logWarning(err, __filename, '从MongoDB中取数据时, 访问数据库出错', new Date());
         reject(err);
      }
   });
   let p2 = p1.then(function(res) {
      if (res) {
         LogUtils.logInfo('Get Data From MongoDB Success', __filename, '成功从MongoDB中取到图片信息的数据', new Date());
         resp.json(res);
      }
   }, function(err) {
      return new Promise(function(resolve, reject) {
         LogUtils.logInfo('Request Post getImageById', __filename, '向后台getImageById发起Post请求', new Date());
         httputils.post(host, getURL('getImageById'), port, params, function(err, res) {
            if (err) {
               LogUtils.logError(err, __filename, '向后台getImageById发起请求出错', new Date());
               reject(err);
            } else {
               resolve(res);
            }
         });
      });
   });
   p2.then(function(res) {
      if (res) {
         try{
            if(res.status === 'success' && res.password === 'false') {
               LogUtils.logInfo('Save Image To MongoDB', __filename, '向MongoDB保存一张图片信息', new Date());
               ImageUtils.saveImage(res, function(err, res) {
                  if (err) {
                     LogUtils.logWarning(err, __filename, 'MongoDB保存图片失败', new Date());
                  }
               });
            }
         } catch (err) {
            LogUtils.logWarning(err, __filename, '向MongoDB保存图片时, 访问数据库出错', new Date());
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
   LogUtils.logInfo('Post /deleteImageById', __filename, '处理/deleteImageById的请求', new Date());
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
   LogUtils.logInfo('Request Post deleteImageById', __filename, '向后台deleteImageById发起Post请求', new Date());
   httputils.post(host, getURL('deleteImageById'), port, params, function(err, data) {
      if (err) {
         LogUtils.logError(err, __filename, '向后台发起deleteImageById的Post请求时, 出错', new Date());
         resp.json({
            status: 'failed',
            message: 'Server Error!'
         });
         return;
      } else {
         if (data.status === 'success') {
            try {
               LogUtils.logInfo('Delete Image Info', __filename, '后台图片信息删除成功时, 删除MongoDB中的数据');
               ImageUtils.deleteImage({id: params.id}, function(err, res) {
                  if (err) {
                     LogUtils.logWarning(err, __filename, 'MongoDB删除图片时, 出现错误', new Date());
                  }
               });
            } catch (err) {
               LogUtils.logWarning(err, __filename, 'MongoDB删除图片信息时, 访问数据库出错', new Date());
            }
            fs.unlink(deletePath, function(err) {
               LogUtils.logError(err, __filename, '从磁盘中删除文件时, 出现错误', new Date());
            });
         }
         resp.json(data);
      }
   });
});

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
   LogUtils.logInfo('Get /types', __filename, '处理Get /types请求', new Date());
   LogUtils.logInfo('Request Post getAllType', __filename,'向后台getAllType发起Post请求', new Date());
   httputils.post(host, getURL('getAllType'), port, null, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '请求getAllType时, 服务器出错', new Date());
         resp.send('服务器错误!');
      } else {
         resp.render('type.html', {types: res});
      }
   });
});

router.post('/deleteType', function(req, resp) {
   LogUtils.logInfo('Post /deleteType', __filename, '处理/deleteType的Post请求', new Date());
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
  LogUtils.logInfo('Request Post deleteTypeById', __filename, '向后台deleteTypeById发起Post请求', new Date());
  httputils.post(host, getURL('deleteTypeById'), port, params, function(err, data) {
      if (err) {
         LogUtils.logError(err, __filename, '向后台请求deleteTypeById出错', new Date());
          resp.json({
              status: 'failed',
              message: '服务器错误!'
          });
          return;
      } else {
         if (data.status === 'success'){
            try {
               LogUtils.logInfo('Delete Type&Essay', __filename, '后端随笔类型删除成功, 尝试从MongoDB中删除数据.', new Date());
               TypeUtils.deleteType({id: params.id}, function(err, res) {
                  if (err) {
                     LogUtils.logWarning(err, __filename, '在MongoDB中删除随笔类型出错', new Date());
                  }
               });
               EssayUtils.deleteEssayByType({typeid: params.id}, function(err, res) {
                  if (err) {
                     LogUtils.logWarning(err, __filename, '在MongoDB中删除随笔出错', new Date());
                  }
               });
            } catch (err) {
               LogUtils.logWarning(err, __filename, '在删除随笔类型&随笔时, 访问MongoDB出错', new Date());
            }
         }
         resp.json(data);
      }
  });
});

module.exports = router;

