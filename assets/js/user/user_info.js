$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) return '昵称长度必须在1~6个字符之间！'
        }
    })

    initUserInfo();
    //1. 发起get请求获取用户信息渲染到基本资料页面
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败！')
                console.log(res);
                //2. 复制layui的表单赋值取值form.val('filter',object是参数)，filter是form表单layui-form所在元素属性lay-filter=""对应的值。这里的data值有id，却没有存放的盒子，于是新建一个input隐藏表单存放
                form.val('formUserInfo', res.data) //可快速把响应用户信息的data值赋值到表单
            }
        })
    }
    //3. 重置按钮：若修改信息后要还原，需监听按钮，阻止默认重置为空行为，重置表单数据
    $("#btnReset").on('click', function(e) {
            e.preventDefault()
            initUserInfo()
        })
        //4.提交按钮：若修改信息后需提交，需监听表单提交事件submit，阻止默认提交行为，发起提交请求。若请求成功，需把昵称和首字母渲染到首页头像处-调用父页面中方法window.parent.fn(),window是指本fm子页面
    $(".layui-form").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(), //快速获取提交数据
            success: function(res) {
                if (res.status !== 0) return layer.msg('更新用户信息失败！')
                layer.msg('更新用户信息成功！')
                window.parent.getUserInfo() //调用父元素的请求和渲染函数
            }
        })
    })

});