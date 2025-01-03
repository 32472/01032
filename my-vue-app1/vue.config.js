module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 后端服务地址
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '' // 根据需要重写路径
        }
      }
    }
  }
};
