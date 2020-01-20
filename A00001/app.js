// 导入express库
var express = require('express');
// 创建一个app实例
var app = express();
// 导入body-parser的库
var bodyParser = require('body-parser');
// 导入multer库
var multer = require('multer');
// 导入path库
var path = require('path');
// 导入fs库
var fs = require('fs');

fs.exists(path.join(__dirname, 'upload/'), function(exists) {
   if (!exists) {
       fs.mkdir(path.join(__dirname, 'upload/'), function(err) {
       });
   }
});

// 开发node_modules, upload和public文件夹
app.use('/node_modules/', express.static(path.join(__dirname, 'node_modules/')));
app.use('/public/', express.static(path.join(__dirname, 'public/')));
app.use('/upload/', express.static(path.join(__dirname, 'upload/')));

// 设置文件名, 文件保存路径
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({storage: storage});

// 使用解析多文件上传的库
app.use(upload.array('images'));

// 设置.html文件使用art-template模板引擎渲染
app.engine('html', require('express-art-template'));

// 设置post请求参数解析的工具
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 使用自定义的路由
app.use(require('./routers/index_router'));
app.use(require('./routers/essay_router'));
app.use(require('./routers/image_router'));
app.use(require('./routers/type_router'));
app.use(require('./routers/friend_router'));
app.use(require('./routers/comment_router'));

// 开启监听服务
app.listen(80, function() {
    console.log('app is running on port 80.');
});

