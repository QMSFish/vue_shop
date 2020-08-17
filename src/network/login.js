import { request1 } from './request'


export function loginRequest(loginData) {
    return request1({
        url: '/login',
        method: 'post',
        data: loginData
    })
}