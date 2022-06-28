export enum PrePageApi {
    ARTICLE_LIST="/articleList",
    ARTICLE_LIST_BY_TITLE = "/articleList/byTitle/"
}

export enum AdminApi {
    ADMIN='/admin',
    LOGIN = "/login",
    USER='/admin/user',
    SYS_USER='/admin/sys-user',
    ARTICLE='/admin/article',
    COMMENT='/admin/comment',
    TYPE='/admin/type',
    TAG='/admin/tag',
}
export enum ShowApi {
    LOGOUT = '/logout'
}

/**
 * 后端 api 路径
 */
let admin = '/admin';
export const URL = {
    admin: {
        url: admin,
        des: "管理界面的根路径",
        user: {
            url:`${admin}/user`,
            des:'用户管理',
        },
        sysUser:{
            url:`${admin}/sys-user`,
            des:'系统用户管理',
        },
        article:{
            url:`${admin}/article`,
            des:'文章管理',
        },
        comment:{
            url:`${admin}/comment`,
            des:'评论管理',
        },
        type:{
            url:`${admin}/type`,
            des:'分类管理',
        },
        tag:{
            url:`${admin}/tag`,
            des:'分类管理',
        }
    },
    login:{
        url:'/login',
        des:'登录',
    },
    show:{
        des:'网站前台的路径',
        articleList:{
            url:'/articleList',
            des:'文章列表，部分查询',
            byTitle:{
                url:'/articleList/byTitle/',
                des:'文章按标题排序'
            }
        }
    }
}

