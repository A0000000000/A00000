let path = require('path');
let runInfo = require(path.join(__dirname, '../utils/mongodb')).RunInfo;
let LogUtils = require(path.join(__dirname, '../utils/logutils'));
let express = require('express');
let router = express.Router();

router.get('/', function (req, resp) {
   LogUtils.logInfo('Get /', __filename, '处理/的Get请求.', new Date());
   resp.render('index.html');
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

module.exports = router;