// 导入库
let mongoose = require('mongoose');
let path = require('path');
let static_data = require(path.join(__dirname, 'static_data'));
// 连接数据库
mongoose.connect(static_data.mongourl, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

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

let RunInfo = {
    getRunDate (callback) {
        DateModel.findOne({id: '0'}, function (err, ret) {
            if (err) {
                callback(err);
            } else {
                callback(err, new Date() - ret.StartDate);
            }
        });
    },
    getAccessCount (callback) {
        CountModel.findOne({id: '0'}, function (err, ret) {
            if (err) {
                callback(err);
            } else {
                callback(err, ret.Count);
            }
        });
    },
    addAccessCount (callback, count) {        
        if (!count || isNaN(count)) {
            return;
        }
        CountModel.findOneAndUpdate({id: '0'}, {Count: count}, callback);
    }
};

let EssayUtils = {
    getEssayById (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        EssayModel.findOne({id: id}, callback);
    },
    saveEssay (params, callback) {
        let saved = new EssayModel(params);
        saved.save(callback);
    },
    deleteEssay (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        EssayModel.deleteOne({id: id}, callback);
    },
    deleteEssayByType (params, callback) {
        const typeid = params.typeid;
        if (!typeid) {
            callback('数据库无此记录', null);
            return;
        }
        EssayModel.deleteMany({typeid: typeid}, callback);
    }
};

let TypeUtils = {
    getTypeById (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        TypeModel.findOne({id: id}, callback);
    },
    saveType (params, callback) {
        let saved = new TypeModel(params);
        saved.save(callback);
    },
    deleteType (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        TypeModel.deleteOne({id: id}, callback);
    }
};

let CommentUtils = {
    getCommentsByEssayId (params, callback) {
        const essayId = params.essayId;
        if (!essayId) {
            callback('数据库无此记录', null);
            return;
        }
        CommentModel.find({essayId, essayId}, callback);
    },
    removeCommentsByEssayId (params, callback) {
        const essayId = params.essayId;
        if (!essayId) {
            callback('数据库无此记录', null);
            return;
        }
        CommentModel.deleteMany({essayId: essayId}, callback);
    },
    removeCommentsById (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        CommentModel.deleteOne({id: id}, callback);
    },
    addComments(params, callback) {
        if (!(params instanceof  Array)) {
            callback('failed', null);
        }
        for (let i = 0; i < params.length; i++) {
            let tmp = new CommentModel(params[i]);
            tmp.save(callback);
        }
    }
};

let ImageUtils = {
    getImageById (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        ImageModel.findOne({id: id}, callback);
    },
    deleteImage (params, callback) {
        const id = params.id;
        if (!id) {
            callback('数据库无此记录', null);
            return;
        }
        ImageModel.deleteOne({id: id}, callback);
    },
    saveImage (params, callback) {
        if (params.password === 'false') {
            let tmp = new ImageModel(params);
            tmp.save(callback);
        } else {
            callback('failed', null);
        }
    }
}

module.exports = {
    RunInfo: RunInfo,
    EssayUtils: EssayUtils,
    TypeUtils: TypeUtils,
    CommentUtils: CommentUtils,
    ImageUtils: ImageUtils
}


