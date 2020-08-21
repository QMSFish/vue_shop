import axios from 'axios'

export function request1(config) {
    // 1、创建axios实例
    const instance = axios.create({
        baseURL: 'http://119.23.53.78:8888/api/private/v1',
        timeout: 5000
    });
    // 2、axios拦截  request/respond
    // 请求拦截
    instance.interceptors.request.use(config => {
        // console.log(config);
        // 给请求的header添加token令牌
        config.headers.Authorization = sessionStorage.getItem('token')
            // console.log(config);
        return config
    }, err => {
        console.log(err);
    });
    // 响应拦截
    instance.interceptors.response.use(res => {
        // console.log(res);
        return res.data
    }, err => {
        console.log(err);
    });
    // 3、真正请求数据
    return instance(config)


}