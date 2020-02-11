// 导入库
let mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost/A00001', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

let DateModel = mongoose.model('RunDate', {id: String, StartDate: Date});
let CountModel= mongoose.model('RunAccess', {id: String, Count: Number});

let beginTime = new DateModel({
    id: '0',
    StartDate: new Date('2020-01-17T07:34:35.355Z')
});
let count = new CountModel({
    id: '0',
    Count: 0
});

beginTime.save(function(err) {
    if (err) {
        console.log(err);
    }
});



count.save(function(err) {
    if (err) {
        console.log(err);
    }
});
