// 优化url省略跟目录，会调用ajaxPrefilter函数，拿到我们给Ajax提供的跟路径，拼接跟路径
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3006' + options.url
})