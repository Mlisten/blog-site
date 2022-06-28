import { createStore } from 'vuex'

const store = createStore({
    strict: false,
    state:{
        //@ts-ignore
        user: JSON.parse(sessionStorage.getItem('user')) || {
            createTime: null,
            id: null,
           // 不返回 password,
            phone: null,
            roleId: null,
            sex: null,
            status: null,
            updateTime: null,
            username: null,
        },
        tags: [],
        types:[],
        articleList : []
    },
    mutations:{
        increment(state,user){
            state.user  = user;
            sessionStorage.setItem('user',JSON.stringify(user))
        },
        addTags(state,tags){
            state.tags = tags
        },
        addTypes(state,types){
            state.types=types
        },
        addArticleList(state,list){
            state.articleList = list
        }
    },
    getters:{
        id(state){
            return state.user.id;
        },
        username(state){
            return state.user.username
        },
        phone(state){
            return state.user.phone;
        },
        createDate(state){
            return state.user.createDate
        },
        roleId(state){
            return state.user.roleId
        },
        sex(state){
            return state.user.sex
        },
        status(state){
            return state.user.status
        },
    },
})

export default store;