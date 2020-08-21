import { request1 } from './request'

// 左侧菜单权限
export function getMeunList() {
    return request1({
        url: '/menus',
        method: 'get',
    })
}

// 用户数据列表
export function getUserList(object) {
    return request1({
        url: '/users',
        method: 'get',
        params: object //携带的数据
    })
}

// 改变用户状态
export function changeUserState(uId, type) {
    return request1({
        url: '/users/' + uId + '/state/' + type,
        method: 'put'
    })
}

// 添加用户
export function addUser(object) {
    return request1({
        url: '/users',
        method: 'post',
        data: {
            username: object.username,
            password: object.password,
            email: object.email,
            mobile: object.mobile
        }
    })
}

// 编辑用户提交
export function changeUserData(object) {
    return request1({
        url: `/users/${object.id}`,
        method: 'put',
        data: {
            email: object.email,
            mobile: object.mobile
        }
    })
}

// 删除单个用户
export function deleteUser(id) {
    return request1({
        url: `/users/${id}`,
        method: 'delete',
    })
}