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


// 处理/的get请求
router.get('/', function(req, resp) {
   httputils.post(host, getURL('getAllEssayTitle'), port, { page: 1}, function(err, data) {
      if (err) {
         resp.status(500).send('Server Error !');
      } else {
         var count = parseInt(fs.readFileSync(path.join(__dirname, '../count.data'), 'utf8'));
         count = count + 1;
         var time = new Date() - new Date('2020-01-17T07:34:35.355Z');
         resp.render('essaylist.html', {
            essaies: data,
            count: count,
            time: time,
            lastPage: 1,
            cruPage: 1,
            nextPage: 2
         });
         fs.writeFile(path.join(__dirname, '../count.data'), count, function(err) {
            if (err) {
            }
         });
      }
   });
});

// 处理/essaylist的get请求
router.get('/essaylist', function(req, resp) {
   var cru = parseInt(req.query.page);
   if (req.query.page === undefined || req.query.page === null) {
      cru = 1;
   }
   httputils.post(host, getURL('getAllEssayTitle'), port, { page: cru}, function(err, data) {
      if (err) {
         resp.status(500).send('Server Error !');
      } else {
         if (data.length <= 0) {
            cru = 0;
         }
         var count = parseInt(fs.readFileSync('./count.data', 'utf8'));
         count = count + 1;
         var time = new Date() - new Date('2020-01-17T07:34:35.355Z');
         resp.render('essaylist.html', {
            essaies: data,
            count: count,
            time: time,
            lastPage: cru - 1 > 0 ? cru - 1 : 1,
            cruPage: cru,
            nextPage: cru + 1
         });
         fs.writeFile('./count.data', count, function(err) {
            if (err) {
            }
         });
      }
   });
});

// 处理/addition的get请求
router.get('/addition', function(req, resp) {
    resp.render('additionMsg.html');
});


module.exports = router;