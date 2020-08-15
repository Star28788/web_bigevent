$(function() {
    getUserInfo()
    var layer = layui.layer;
    //3. 点击退出按钮，复制layer提示框js，弹出是否退出，否不变化，是就清空本地存储、跳转到首页、提示框关闭  
    $("#btnLogout").on("click", function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token')
            location.href = '/S-bigEvent/index.html'
            layer.close(index); //关闭询问框，index是自带索引，不需管
        });
    })
});

//1. 发起get请求获取用户基本信息,方便把响应信息渲染到首页
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo', //my开头的请求路径需身份权限访问，需在请求头headers中携带Authorization身份认证字段，可优化统一写
        // headers: {
        //     Authorization: localStorage.getItem('token') || '' //认证字段是响应的token值，已存在本地存储中，可提取
        // },
        success: function(res) {
            console.log(res)
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败！')
                //调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
        //4. 进入首页：请求的账号密码成功才能正常登录进入首页，否则会不能：请求成功与否都会调用complete回调函数，可使用它的responseJSON属性拿到响应回来的数据，如果该数据与请求失败的数据一致，就清空本地存储的token，且跳到登录页面. 可在新js文件中全局统一挂载complete回调
        // complete: function(res) {
        //     console.log(res)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem('token')
        //         location.href = '/S-bigEvent/login.html'
        //     }
        // }
    })
}

//2. 渲染用户名称及头像:①获取用户名称，优先昵称如管理员，没有就用户名，渲染到欢迎文本 ②判断是否有user_pic属性，有就让头像图片地址为user_pic显示，字母盒子隐藏；否则头像图片隐藏，字母盒子内容是名称的第一个字母大写显示
function renderAvatar(user) {
    var name = user.nickname || user.username
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $(".layui-nav-img").hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}