var http = require('http');
var querystring = require('querystring');
var static_data = require('./static_data');
function isJson(str) {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch(e) {
    }
    return false;
}

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