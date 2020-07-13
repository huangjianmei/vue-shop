module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    proxy: { // 请求代理服务器
      '/api': {
        target: 'http://192.168.0.101:8081/api/private/v1',
        // changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  }
} 
