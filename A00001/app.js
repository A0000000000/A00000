let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let multer = require('multer');
let path = require('path');
let fs = require('fs');
let LogUtils = require(path.join(__dirname, './utils/logutils'));
require(path.join(__dirname, './utils/mongodb'));
fs.exists(path.join(__dirname, 'upload/'), function(exists) {
   if (!exists) {
       fs.mkdir(path.join(__dirname, 'upload/'), function(err) {
       });
   }
});

app.use('/node_modules/', express.static(path.join(__dirname, 'node_modules/')));
app.use('/public/', express.static(path.join(__dirname, 'public/')));
app.use('/upload/', express.static(path.join(__dirname, 'upload/')));

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

let upload = multer({storage: storage});

app.use(upload.array('images'));

app.engine('html', require('express-art-template'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('./routers/index_router'));
app.use(require('./routers/essaylist_router.js'));
app.use(require('./routers/essay_router.js'));
app.use(require('./routers/create_router.js'));
app.use(require('./routers/update_router.js'));
app.use(require('./routers/friend_router.js'));
app.use(require('./routers/comment_router.js'));
app.use(require('./routers/addition_router.js'));

app.listen(80, function() {
    LogUtils.logInfo('App is Running at Port 80.', __filename, '程序启动入口.', new Date());
});

