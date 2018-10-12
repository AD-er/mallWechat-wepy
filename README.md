## 项目简介
一个基于Laravel + Wepy微信小程序商城Demo。项目刚开始使用小程序原生语法开发，后续调用后台API并不友好。最终选着Wepy框架，类Vue开发风格、支持组件化开发、Promise、ES6/7等主流特性。对常用工具函数再次封装，完美解决回调烦恼，大大提升开发效率。更多关联项目：
> * 基于Laravel + Bootstrap商城前后端Demo[[GitHub源码](https://github.com/AD-er/mallWeb-bootstrap)]
> * 基于Laravel + React前后端完全分离的商城后台Demo[[GitHub源码](https://github.com/AD-er/mallAdmin-wepy)]

### 项目安装
1). 克隆本项目源代码到本地：

     git clone git@github.com:AD-er/mallWechat-wepy.git

2). 切换至项目目录

     cd mallWechat-wepy

3). 安装模块依赖

     npm install

4). 配置 src/utils/api.js 文件

```
const host = '后端API接口'
const origin_host = '数据源API接口'
```

5). 开启实时编译

     wepy build --watch

### 截图预览
由于项目涉及经营性信息，小程序发布需要公司资质，所以不提供在线浏览。以下简单截图，预览商城大体结构布局：
![后台前端预览](https://github.com/AD-er/mallWechat-wepy/blob/master/images/mallWechat1.jpg?raw=true)
![后台前端预览](https://github.com/AD-er/mallWechat-wepy/blob/master/images/mallWechat2.jpg?raw=true)
![后台前端预览](https://github.com/AD-er/mallWechat-wepy/blob/master/images/mallWechat3.jpg?raw=true)
![后台前端预览](https://github.com/AD-er/mallWechat-wepy/blob/master/images/mallWechat4.jpg?raw=true)
![后台前端预览](https://github.com/AD-er/mallWechat-wepy/blob/master/images/mallWechat5.jpg?raw=true)

### 后端API
API接口由另一个项目[[基于Laravel + Bootstrap商城前后端Demo](https://github.com/AD-er/mallWeb-bootstrap)]提供开发，使用Laravel框架、DingoAPI扩展、RESTFul 设计风格、JWT 身份验证、Transformer数据序列化等 API 开发相关技术。更多详情介绍请查看[GitHub源码](https://github.com/AD-er/mallWeb-bootstrap)

### 最后
本项目[作者](https://github.com/AD-er)本人利用业余时间，断断续续写的。结合已掌握和新知识，参考部份开源项目。部份功能尚未完善，做得不好，当做参考。欢迎指正~
