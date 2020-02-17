let path = require('path');
let httputils = require(path.join(__dirname, '../utils/httputils'));
let static_data = require(path.join(__dirname, '../utils/static_data'));
let runInfo = require(path.join(__dirname, '../utils/mongodb')).RunInfo;
let LogUtils = require(path.join(__dirname, '../utils/logutils'));
let TagUtils = require(path.join(__dirname, '../utils/mongodb')).TagUtils;
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

router.get('/', function (req, resp) {
   LogUtils.logInfo('Get /', __filename, '处理/的Get请求.', new Date());
   resp.render('index.html');
});

router.get('/robots.txt', function(req, resp) {
   resp.send(`
   # 本网站爬取没有任何限制(只要别给我爬垮了)<br/>
   # 如果有需要, 请联系管理员, 可以提供API接口<br/>
   # 管理员邮箱: mengxin_zzl@outlook.com<br/>
   `);
});

router.post('/robots.txt', function(req, resp) {
   resp.send(`
   # 本网站爬取没有任何限制(只要别给我爬垮了)<br/>
   # 如果有需要, 请联系管理员, 可以提供API接口<br/>
   # 管理员邮箱: mengxin_zzl@outlook.com<br/>
   `);
});

router.get('/index', function (req, resp) {
   LogUtils.logInfo('Get /index', __filename, '处理/index的Get请求.', new Date());
    resp.render('index.html');
});

router.post('/getServerRunTime', function (req, resp) {
   LogUtils.logInfo('Post /getServerRunTime', __filename, '处理/getServerRunTime的Post请求.', new Date());
   try {
      LogUtils.logInfo('Get RunData From MongoDB', __filename, '从MongoDB中获取系统运行的时间.', new Date());
      runInfo.getRunDate(function(err, ret) {
         if (err) {
            LogUtils.logWarning(err, __filename, '从MongoDB中获得运行时间失败.', new Date());
            resp.json({
               status: 'failed',
               msg: err
            });
         } else {
            resp.json({
               status: 'success',
               date: ret
            });
         }
      });
   } catch (err) {
      LogUtils.logWarning(err, __filename, '从MongoDB中获得运行时间时, 访问数据库失败.', new Date());
      resp.json({
         status: 'failed',
         msg: err
      });
   }
});

router.post('/getAccessCount', function(req, resp) {
   LogUtils.logInfo('Post /getAccessCount', __filename, '处理/getAccessCount的Post请求.', new Date());
   try {
      LogUtils.logInfo('Get AccessCount From MongoDB', __filename, '从MongoDB中获取访问人数.', new Date());
      runInfo.getAccessCount(function(err, ret) {
         if (err) {
            LogUtils.logWarning(err, __filename, '从MongoDB中获得访问人数失败.', new Date());
            resp.json({
               status: 'failed',
               msg: err
            });
         } else {
            resp.json({
               status: 'success',
               count: ret
            });
            runInfo.addAccessCount(function(err, ret){
               if (err) {
                  LogUtils.logWarning(err, __filename, '向MongoDB中增加一个访问人数时, 出错.', new Date());
               }
            }, Number(ret) + 1)
         }
      });
   } catch (err) {
      LogUtils.logWarning(err, __filename, '从MongoDB中获得访问人数时, 访问数据库出错.', new Date());
      resp.json({
         status: 'failed',
         msg: err
      });
   }
});

router.post('/getTagsByEssayId', function(req, resp){
   LogUtils.logInfo('Post /getTagsByEssayId', __filename, '处理/getTagsByEssayId的Post请求.', new Date());
   let params = req.body;
   if (!isValid(params.essayId)) {
      resp.json({
         status: 'failed',
         message: '参数无效!'
      });
      return;
   }
   let p1 = new Promise(function(resolve, reject) {
      try {
         LogUtils.logInfo('Try Get Tag From MongoDB', __filename, '尝试从MongoDB中获取标签缓存.', new Date());
         TagUtils.getTagsByEssayId(params, function(err, res) {
            if (err || !res || res.length <= 0) {
               reject('failed');
            } else {
               resolve(res);
            }
         });
      } catch (err) {
         LogUtils.logWarning(err, __filename, '从MongoDB中获取Tag缓存时, 访问出错.', new Date());
         reject(err);
      }
   });
   let p2 = p1.then(function(res) {
      if (res) {
         resp.json(res);
      }
   }, function(err) {
      return new Promise(function(resolve, reject) {
         LogUtils.logInfo('Request Post getTagsByEssayId', __filename, '向后端getTagsByEssayId发起Post请求.', new Date());
         httputils.post(host, getURL('getTagsByEssayId'), port, params, function(err, res) {
            if (err) {
               LogUtils.logError(err, __filename, '向后端getTagsByEssayId发起请求出错.', new Date());
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
            TagUtils.addTags(res, function(err, res) {
               if (err) {
                  LogUtils.logWarning(err, __filename, '向MongoDB中增加Tag缓存时, 增加出错.', new Date());
               }
            });
         } catch (err) {
            LogUtils.logWarning(err, __filename, '向MongoDB中增加Tag缓存时, 访问出错.', new Date());
         }
         resp.json(res);
      }
   }, function(err) {
      if (err) {
         resp.json({
            status: 'failed',
            message: '服务器错误!'
         });
      }
   })
});

router.post('/deleteTag', function(req, resp) {
   let params = req.body;
   if (!isValid(params.id)) {
      resp.json({
         status: 'failed',
         message: '页面出错, 请刷新重试!'
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
   try {
      LogUtils.logInfo('Delete Tag Data From MongoDB', __filename, '删除MongoDB中一条Tag记录.', new Date());
      TagUtils.deleteTagById({id: params.id}, function(err, res) {
         if (err) {
            LogUtils.logWarning(err, __filename, '根据id删除MongoDB中Tag的一条记录, 出错.', new Date());
         }
      });
   } catch (err) {
      LogUtils.logWarning(err, __filename, '根据id删除MongoDB中Tag的一条记录, 访问数据库出错.', new Date());
   }
   LogUtils.logInfo('Request Post deleteTag', __filename, '向后端deleteTag发起Post请求.', new Date());
   httputils.post(host, getURL('deleteTag'), port, params, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '向后端deleteTag发起请求时, 服务器出错.', new Date());
         resp.json({
            status: 'failed',
            message: '服务器错误!'
         });
      } else {
         resp.json(res);
      }
   });
});

router.post('/addTag', function(req, resp) {
   let params = req.body;
   if (!isValid(params.essayId)) {
      resp.json({
         status: 'failed',
         message: '页面出错, 请刷新重试!'
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
   if (!isValid(params.tagName)) {
      resp.json({
         status: 'failed',
         message: '标签名不能为空!'
      });
      return;
   }
   try {
      LogUtils.logInfo('Delete Tag Data From MongoDB', __filename, '从MongoDB中删除Tag数据来保证数据的一致性.', new Date());
      TagUtils.deleteTagsByEssayId({essayId: params.essayId}, function(err, res) {
         if (err) {
            LogUtils.logWarning(err, __filename, '从MongoDB中删除Tag信息出错.', new Date());
         }
      });
   } catch (err) {
      LogUtils.logWarning(err, __filename, '从MongoDB中删除Tag信息时, 访问数据库出错.', new Date());
   }
   LogUtils.logInfo('Request Post addTag', __filename, '向后端addTag发起Post请求.', new Date());
   httputils.post(host, getURL('addTag'), port, params, function(err, res) {
      if (err) {
         LogUtils.logError(err, __filename, '向后端addTag发起请求出错.', new Date());
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