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
        data: object
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

// 分配用户角色
export function allotRole(userId, roleId) {
    return request1({
        url: `/users/${userId}/role`,
        method: 'put',
        data: {
            rid: roleId
        }
    })
}

// 所有权限列表
export function getPowerList(type) {
    return request1({
        url: `/rights/${type}`,
        method: 'get',
    })
}

// 角色列表
export function getRolesList() {
    return request1({
        url: `/roles`,
        method: 'get',
    })
}

// 添加角色
export function addRoles(object) {
    return request1({
        url: '/roles',
        method: 'post',
        data: object
    })
}

//编辑提交角色
export function editRoles(object) {
    return request1({
        url: `/roles/${object.id}`,
        method: 'put',
        data: {
            roleName: object.roleName,
            roleDesc: object.roleDesc
        }
    })
}

// 删除角色
export function deleteRoles(id) {
    return request1({
        url: `/roles/${id}`,
        method: 'delete',
    })
}

// 删除角色指定的权限
export function deleteRoleRight(roleId, rightId) {
    return request1({
        url: `/roles/${roleId}/rights/${rightId}`,
        method: 'delete',
    })
}

// 角色授权
export function allotRight(roleId, rids) {
    return request1({
        url: `/roles/${roleId}/rights`,
        method: 'post',
        data: {
            rids: rids
        }
    })
}