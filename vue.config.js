module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
            }
        }
    },
    // chainWbepack 修改打包入口地址是通过链式编程的方式
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
                config.entry('app').clear().add('./src/main-prod.js')
            }),
            config.when(process.env.NODE_ENV === 'development', config => {
                config.entry('app').clear().add('./src/main-dev.js')
            })
    }
}