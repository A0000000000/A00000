// 导入http库
var http = require('http');
// 导入querystring库
var querystring = require('querystring');
var static_data = require('./static_data');
// 判断一个字符串是否可以转换为json
function isJson(str) {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch(e) {
    }
    return false;
}

// 封装的get请求
function get(host, path, port, params, callback) {
    if (!params) {
        params = {}
    }
    params.TOKEN = static_data.TOKEN;
    var content = querystring.stringify(params);
    var options = {
        host: host,
        port: port,
        path: path + '?' + content,
        method: 'GET'
    };
    var req = http.request(options, function(res) {
        res.setEncoding('UTF-8');
        res.on('data', function(data) {
            data = data.replace(/\n/g,"\\n").replace(/\r/g,"\\r");
            if (isJson(data)) {
                callback(null, JSON.parse(data));
            } else {
                callback(null, data);
            }
        })
    });
    req.on('error', function(err){
        callback(err);
    });
    req.end();
}

// 封装的post请求
function post(host, path, port, params, callback) {
    if (!params) {
        params = {}
    }
    params.TOKEN = static_data.TOKEN;
    var content = querystring.stringify(params);
    var options = {
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
        } 
    };
    var req = http.request(options, function(res) {
        res.setEncoding('UTF-8');
        res.on('data', function(data) {
            data = data.replace(/\n/g,"\\n").replace(/\r/g,"\\r");
            if (isJson(data)) {
                callback(null, JSON.parse(data));
            } else {
                callback(null, data);
            }
        })
    });
    req.on('error', function(err){
        callback(err);
    });
    req.write(content);
    req.end();
}

exports.get = get;
exports.post = post;