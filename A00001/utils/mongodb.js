let mongoose = require('mongoose');
let path = require('path');
let static_data = require(path.join(__dirname, 'static_data'));
let LogUtils = require(path.join(__dirname, 'logutils'));

try {
    mongoose.connect(static_data.mongourl, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(function(msg) {
        if (msg) {
            LogUtils.logWarning(msg, __filename, '连接信息.', new Date());
        }
    });
} catch (err) {
    if (err) {
        LogUtils.logWarning(err, __filename, '连接出错, 放弃连接.', new Date());
    }
}
mongoose.Promise = global.Promise;
const conn = mongoose.connection;
let DateModel = mongoose.model('RunDate', {id: String, StartDate: Date});
let CountModel= mongoose.model('RunAccess', {id: String, Count: Number});
let EssayModel = mongoose.model('Essay', {
    id: String, 
    title: String,
    content: String,
    createTime: String,
    updateTime: String,
    creator: String,
    typeid: String
});
let TypeModel = mongoose.model('Type', {
    id: String,
    name: String,
    message: String
});
let CommentModel = mongoose.model('Comment', {
    id: String,
    username: String,
    content: String,
    createTime: String,
    essayId: String
});
let ImageModel = mongoose.model('Image', {
    id: String,
    filename: String,
    path: String,
    updateTime: String
});
let TagModel = mongoose.model('Tag', {
    id: String,
    essayId: String,
    name: String,
    createTime: String
});

let RunInfo = {
    getRunDate: null,
    getAccessCount: null,
    addAccessCount: null
};
let EssayUtils = {
    getEssayById: null ,
    saveEssay: null,
    deleteEssay: null ,
    deleteEssayByType: null
};
let TypeUtils = {
    getTypeById: null,
    saveType: null,
    deleteType: null
};
let CommentUtils = {
    getCommentsByEssayId: null,
    removeCommentsByEssayId: null,
    removeCommentsById: null,
    addComments: null
};
let ImageUtils = {
    getImageById: null,
    deleteImage: null,
    saveImage: null
}
let TagUtils = {
    getTagsByEssayId: null,
    addTags: null,
    deleteTagsByEssayId: null,
    deleteTagById: null
}

conn.on('connected', function() {
    LogUtils.logInfo('MongoDB connect success', __filename, 'MongoDB数据库连接成功', new Date());
    RunInfo.getRunDate = function (callback) {
        DateModel.findOne({id: '0'}, function (err, ret) {
            if (err) {
                callback(err);
            } else {
                callback(err, new Date() - ret.StartDate);
            }
        });
    }
    RunInfo.getAccessCount = function (callback) {
        CountModel.findOne({id: '0'}, function (err, ret) {
            if (err) {
                callback(err);
            } else {
                callback(err, ret.Count);
            }
        });
    }
    RunInfo.addAccessCount = function (callback, count) {        
        if (!count || isNaN(count)) {
            return;
        }
        CountModel.findOneAndUpdate({id: '0'}, {Count: count}, callback);
    }
    EssayUtils.getEssayById = function (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        EssayModel.findOne({id: id}, callback);
    }
    EssayUtils.saveEssay = function (params, callback) {
        let saved = new EssayModel(params);
        saved.save(callback);
    }
    EssayUtils.deleteEssay = function (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        EssayModel.deleteOne({id: id}, callback);
    }
    EssayUtils.deleteEssayByType = function (params, callback) {
        const typeid = params.typeid;
        if (!typeid) {
            callback('数据库无此记录', null);
            return;
        }
        EssayModel.deleteMany({typeid: typeid}, callback);
    }
    TypeUtils.getTypeById = function (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        TypeModel.findOne({id: id}, callback);
    }
    TypeUtils.saveType = function (params, callback) {
        let saved = new TypeModel(params);
        saved.save(callback);
    }
    TypeUtils.deleteType = function (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        TypeModel.deleteOne({id: id}, callback);
    }
    CommentUtils.getCommentsByEssayId = function (params, callback) {
        const essayId = params.essayId;
        if (!essayId) {
            callback('数据库无此记录', null);
            return;
        }
        CommentModel.find({essayId, essayId}, callback);
    }
    CommentUtils.removeCommentsByEssayId = function (params, callback) {
        const essayId = params.essayId;
        if (!essayId) {
            callback('数据库无此记录', null);
            return;
        }
        CommentModel.deleteMany({essayId: essayId}, callback);
    }
    CommentUtils.removeCommentsById = function (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        CommentModel.deleteOne({id: id}, callback);
    }
    CommentUtils.addComments = function (params, callback) {
        if (!(params instanceof  Array)) {
            callback('failed', null);
        }
        for (let i = 0; i < params.length; i++) {
            let tmp = new CommentModel(params[i]);
            tmp.save(callback);
        }
    }
    ImageUtils.getImageById = function (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        ImageModel.findOne({id: id}, callback);
    }
    ImageUtils.deleteImage = function (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        ImageModel.deleteOne({id: id}, callback);
    }
    ImageUtils.saveImage = function (params, callback) {
        if (params.password === 'false') {
            let tmp = new ImageModel(params);
            tmp.save(callback);
        } else {
            callback('failed', null);
        }
    }
    TagUtils.getTagsByEssayId = function(params, callback) {
        if (!params.essayId) {
            callback('参数无效!', null);
            return;
        }
        TagModel.find({essayId: params.essayId}, callback);
    }
    TagUtils.deleteTagsByEssayId = function(params, callback) {
        if (!params.essayId) {
            callback('参数无效!', null);
            return;
        }
        TagModel.deleteMany(params, callback);
    }
    TagUtils.addTags = function(params, callback) {
        if (!params instanceof Array) {
            callback('参数错误!', null);
            return;
        }
        params.forEach(element => {
            let tmp = new TagModel(element);
            tmp.save(callback);
        });
    }
    TagUtils.deleteTagById = function(params, callback) {
        if (!params.id) {
            callback('参数无效!', null);
            return;
        }
        TagModel.deleteOne({id: params.id}, callback);
    }
});


conn.on('error', function(err) {
    if (err) {
        LogUtils.logWarning(err, __filename, '连接出错, 放弃连接.', new Date());
        RunInfo.getRunDate = function(callback) {
            callback('Cannt connect MongoDB');
        }
        RunInfo.getAccessCount = function(callback) {
            callback('Cannt connect MongoDB');
        }
        EssayUtils.getEssayById = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        EssayUtils.saveEssay = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        EssayUtils.deleteEssay = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        EssayUtils.deleteEssayByType = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        TypeUtils.getTypeById = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        TypeUtils.saveType = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        TypeUtils.deleteType = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        CommentUtils.getCommentsByEssayId = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        CommentUtils.removeCommentsByEssayId = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        CommentUtils.removeCommentsById = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        CommentUtils.addComments = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        ImageUtils.getImageById = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        ImageUtils.deleteImage = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        ImageUtils.saveImage = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        TagUtils.getTagsByEssayId = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        TagUtils.deleteTagsByEssayId = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        TagUtils.addTags = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
        TagUtils.deleteTagById = function(params, callback) {
            callback('Cannt connect MongoDB');
        }
    }
});


module.exports = {
    RunInfo: RunInfo,
    EssayUtils: EssayUtils,
    TypeUtils: TypeUtils,
    CommentUtils: CommentUtils,
    ImageUtils: ImageUtils,
    TagUtils: TagUtils
}
