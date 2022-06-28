import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

import {ElMessage} from "element-plus";

const routes: RouteRecordRaw[] = [
    //前台页面的路由
    {
        name: "Show",
        path: "/",
        alias: "/show",
        redirect: "/index",
        component: () => import('../../layout/Show.vue'),
        children: [{
            name: 'Index',
            path: '/index',
            component: () => import('../../show/page/Index.vue'),
        }, {
            name: 'ArticleList',
            component: () => import('../../components/ArticleList.vue'),
            path: '/articleList/:condition?/:val?',
        }, {
            name: "Dynamic",
            path: "/dynamic",
            component: () => import("../../show/page/Dynamic.vue")
        }, {
            name: "Label",
            path: "/label",
            component: () => import('../../show/page/Label.vue')
        }, {
            name: "Archives",
            path: "/archives",
            component: () => import('../../show/page/Archives.vue')
        }, {
            name: 'MainArticle',
            path: '/article/:articleId/:scroll?',
            component: () => import('../../components/MainArticle.vue'),

        },{
            name: 'MsgBoard',
            path: '/msg-board',
            component: () => import('../../show/page/MsgBoard.vue')
        }]
    },
    //登录页面的路由
    {
        name: "Login",
        path: "/login",
        component: () => import('../../layout/Login.vue')
    },
    //后台页面的路由
    {
        name: 'Admin',
        path: '/admin',
        redirect: '/admin/dashboard',
        component: () => import('../../layout/Admin.vue'),
        children: [{
            name: "Dashboard",
            path: "/admin/dashboard",
            component: () => import('../../admin/page/Dashboard.vue')
        }, {
            name: "Article",
            path: "/admin/article",
            component: () => import('../../admin/page/Article.vue')
        }, {
            name: "Type",
            path: "/admin/type",
            component: () => import('../../admin/page/Type.vue')
        }, {
            name: "SysUser",
            path: "/admin/sys-user",
            component: () => import('../../admin/page/SysUser.vue')

        }, {
            name: "User",
            path: "/admin/user",
            component: () => import('../../admin/page/User.vue')
        }, {
            name: "Comment",
            path: "/admin/comment",
            component: () => import('../../admin/page/Comment.vue')
        }, {
            name: "MsgBoardAdmin",
            path: "/admin/msg-board",
            component: () => import('../../admin/page/MsgBoardAdmin.vue')
        } , {
            name: "Tag",
            path: "/admin/tag",
            component: () => import('../../admin/page/Tag.vue')
        }, {
            name: "Setting",
            path: "/admin/setting",
            component: () => import('../../admin/page/Setting.vue')
        }]
    },
    // 部分公共组件
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
router.beforeEach((to, from, next) => {
    console.log('path==========>'+to.path)

    let token = sessionStorage.getItem('token');
    if (token){
        return next()
    }else if (to.path.indexOf('/admin/') !== -1){
        ElMessage.error("token不存在")
        return next('/login')
    }else {
        return next()
    }

})

export default router
