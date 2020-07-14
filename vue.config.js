module.exports = {
  // devServer: {
  //   host: '0.0.0.0',
  //   port: '8080',
  //   proxy: { // 请求代理服务器
  //     '/api': {
  //       target: 'http://192.168.0.101:8081/api/private/v1',
  //       // changeOrigin: true,
  //       // pathRewrite: {
  //       //   '^/api': ''
  //       // }
  //     }
  //   }
  // }
  chainWebpack: config => {
    // 生产模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'Axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
