import axios, {AxiosResponse} from "axios";
import {ElMessage} from "element-plus";

let instance = axios.create({
    timeout: 5000, //设置请求超时 5秒
    baseURL: '/api',
});

export interface MyAxiosResponse<T = any, D = any> extends AxiosResponse {
    data: T;
    code: number;
    msg: any;
    count: number;
}

instance.interceptors.request.use(config => {
    config.headers = {
        ContentType: 'application/json;charset=utf-8',
        token: ''
    }
    // 从 sessionStorage 获取 token
    const token = sessionStorage.getItem('token');
    // 自动携带token至请求头
    if (token) {
        config.headers.token = token;
    }
    return config;
}, error => {
    // 弹出 一次 异常警告
    setTimeout(() => {
        ElMessage.error('axios request请求异常！')
    }, 300)
    console.error(error)
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    //自动获取请求头的 token
    let token = response.headers.token;
    //把token保存至 sessionStorage
    if (token) {
        sessionStorage.setItem("token", token)
    }
    let res = response.data;
    let code = res.code;
    let msg = res.msg;
    //后台 响应码 不是 2000 时,弹出错误信息，并阻止继续向下执行
    if (code !== 2000) {
        if (msg == 'login'){
            sessionStorage.removeItem('token')
            ElMessage.error("用户状态已失效")
            window.location.href = '/login'
            return ;
        }
        // 非法token时，清空 sessionStorage
        if (code === 4001) {
            sessionStorage.removeItem('token')
        }
        ElMessage.warning(msg)
        return Promise.resolve(null)
    }
    // 不是登录页面 且响应码是 2000
    if (code === 2000 && response.config.url?.indexOf('/login') === -1) {
        let method = response.config.method?.toLowerCase();
        if (method === 'post') {
            ElMessage.success("添加成功")
        } else if (method === 'delete') {
            ElMessage.success("删除成功")
        } else if (method === 'put') {
            ElMessage.success("修改成功")
        }
    }
    return Promise.resolve(res)
}, error => {
    setTimeout(() => {
        ElMessage.error('axios response响应异常！code:' + error.code)
    }, 200)
    return Promise.reject(error);
})

export default instance;