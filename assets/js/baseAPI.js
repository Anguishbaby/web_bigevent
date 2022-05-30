// 每次发请求时，会先调用这个函数，可以拿到提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})