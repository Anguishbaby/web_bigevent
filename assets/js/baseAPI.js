// 每次发请求时，会先调用这个函数，可以拿到提供的配置对象
$.ajaxPrefilter(function(options) {
    // 统一为请求匹配根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // 统一为有权限的接口设置headers请求头
    if(options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete（无论成功还是失败都会调用的函数）回调函数
    options.complete = function(res) {
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 跳转回登陆页
            location.href = '/login.html'
        }
    }
})