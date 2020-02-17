### 记录随笔的后端代码
* 本仓库是为了备份随笔的源代码
* [随笔的地址](http://www.a00000.xyz)

### 项目介绍
1. 项目采用前后端分离的思想编写
2. 页面采用服务端渲染
3. 前端
    * 前端使用HTML, CSS, JavaScript
    * 前端框架为jQuery, BootStrap, Vue, showndown
4. 代理层
    * 代理层使用node.js
    * 库使用了Express, body-parser, art-template, express-art-template, showdown, multer
    * node的作用主要是进行路由和服务端页面渲染
    * node的数据来源于后端
    * node使用了MongoDB数据库做http缓存
    * 增加日志功能, 默认日志信息输出到控制台
5. 后端
    * 后端使用JavaWeb
    * 后端框架为SpringMVC, Spring, MyBatis
    * Service层使用Redis做缓存
    * Dao层使用EhCache做二级缓存
    * 增加日志功能, 默认日志信息输出到控制台
6. 数据库
    * 数据库使用MySQL, Redis, MongoDB
    * 数据表维护了7张

### 仓库
1. A00000文件夹下是全部后端代码
2. A00001文件夹下是代理层和前端代码
3. db文件夹下是创建数据库的语句(start.js是向MongoDB添加数据的语句)
