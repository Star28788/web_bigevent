// 优化url省略跟目录，会调用ajaxPrefilter函数，拿到我们给Ajax提供的跟路径，拼接跟路径
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url)

    // 优化需身份权限访问内容：统一为有权限接口设置请求头headers中携带Authorization身份认证字段，需先判断路径是否含/my,有就如下
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '' //认证字段是响应的token值，已存在本地存储中，可提取
        }
    }

    // 优化进入首页. 全局统一挂载complete回调：请求的账号密码成功才能正常登录进入首页，否则会不能：请求成功与否都会调用complete回调函数，可使用它的responseJSON属性拿到响应回来的数据，如果该数据与请求失败的数据一致，就清空本地存储的token，且跳到登录页面
    options.complete = function(res) {
        // console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem('token')
            location.href = '/S-bigEvent/login.html'
        }
    }

})