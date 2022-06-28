## 个人博客的HTML页面

###项目结构
```
    src
     |--- admin  后台页面
            |--- components 组件
            |--- page       vue页面
     |--- assets 静态资源
     |--- components 一个页面中，占据空间较大的组件，可复用的
            |--- admin 后台页面中的
     |--- commons 配置工具包
            |--- config 配置
            |--- router 路由，采用懒加载模式配置
            |--- store  状态管理
            |--- utils  工具类
     |--- components 组件
     |--- layout 大页面的容器（前台，后台，登录页）
     |--- show  前台页面
            |--- components 组件
            |--- page vue页面
     |--- App.vue 整个项目的入口路由
     |--- main.ts 整个项目的入口ts文件
    index.html    整个项目的入口
    package.json  依赖管理
    tsconfig.json
    vite.config.ts 
```
项目大部分都以 setup + ts 的方式编写

该项目有一个前台展示页面和一个后台管理页面

前台页面负责 文章，评论查询，单个文章能添加评论

后台页面对文章，用户，评论的操作