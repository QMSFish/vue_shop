// 这是项目发布阶段需要用到的babel插件
const prodPlugins = []
    // 判断是不是发布阶段
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console')

}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        // 这行代码 在开发阶段和生成阶段都会执行 所以需要判断
        // 作用：移除console代码
        // "transform-remove-console"

        // 发布产品时候的插件数组
        ...prodPlugins
    ]
}