create database A00000 character set utf8 collate utf8_general_ci;
use A00000;

create table t_type(
    id varchar(255) primary key,
    name varchar(255),
    message varchar(255)
)character set utf8 collate utf8_general_ci;

create table t_essay(
    id varchar(255) primary key ,
    title varchar(255),
    content text,
    createTime datetime,
    updateTime datetime,
    password varchar(255),
    creator varchar(255),
    typeid varchar(255),
    constraint fk_essay_type foreign key (typeid) references t_type(id)
)character set utf8 collate utf8_general_ci;

create table t_image(
    id varchar(255) primary key,
    filename varchar(255),
    originalname varchar(255),
    path varchar(255),
    uploadTime datetime,
    password varchar(255)
)character set utf8 collate utf8_general_ci;

create table t_friend(
    id varchar(255) primary key,
    username varchar(255),
    qqid varchar(255),
    wechatid varchar(255),
    email varchar(255),
    telephone varchar(255),
    createTime datetime
)character set utf8 collate utf8_general_ci;

create table t_comment (
    id varchar(255) primary key,
    username varchar(255),
    content varchar(255),
    createTime datetime,
    essayId varchar(255),
    constraint fk_comment_essay foreign key (essayId) references t_essay(id)
)character set utf8 collate utf8_general_ci;