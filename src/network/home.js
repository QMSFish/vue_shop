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

// 商品分类数据列表
export function getGoodsClassifyList(object) {
    return request1({
        url: `/categories`,
        method: 'get',
        params: object
    })
}

// 添加分类
export function addClassify(object) {
    return request1({
        url: `/categories`,
        method: 'post',
        data: object
    })
}

// 编辑提交分类
export function editClassify(id, name) {
    return request1({
        url: `/categories/${id}`,
        method: 'put',
        data: {
            cat_name: name
        }
    })
}

// 删除分类
export function deleteClassify(id) {
    return request1({
        url: `/categories/${id}`,
        method: 'delete'
    })
}

// 参数列表
export function getClassifyParams(id, type) {
    return request1({
        url: `/categories/${id}/attributes`,
        method: 'get',
        params: {
            sel: type
        }
    })
}

// 添加动态参数或者静态属性
export function addParams(id, obj) {
    return request1({
        url: `/categories/${id}/attributes`,
        method: 'post',
        data: obj
    })
}

// 编辑提交参数
export function editParams(id, attrId, obj) {
    return request1({
        url: `/categories/${id}/attributes/${attrId}`,
        method: 'put',
        data: obj
    })
}

//  删除参数
export function deleteParams(id, attrId) {
    return request1({
        url: `/categories/${id}/attributes/${attrId}`,
        method: 'delete',
    })
}

//  商品列表数据
export function getGoodsList(obj) {
    return request1({
        url: `/goods`,
        method: 'get',
        params: obj
    })
}

// 添加商品
export function addGoods(obj) {
    return request1({
        url: `/goods`,
        method: 'post',
        data: obj
    })
}

// 删除商品
export function deleteGood(id) {
    return request1({
        url: `/goods/${id}`,
        method: 'delete',
    })
}

// 订单数据列表
export function getOrderList(obj) {
    return request1({
        url: `/orders`,
        method: 'get',
        params: obj
    })
}

//查看物流信息
export function getLogisticsInfo(id) {
    return request1({
        url: `/kuaidi/${id}`,
        method: 'get',
    })
}

// 基于时间统计的折线图
export function getReportsData() {
    return request1({
        url: `/reports/type/1`,
        method: 'get',
    })
}