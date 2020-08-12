$(function() {
    //1. 点击去注册账号
    $("#link_reg").on("click", function() {
        $(".login-box").hide()
        $(".reg-box").show()
    });

    //2. 点击去登录
    $("#link_login").on("click", function() {
        $(".ligin-box").show()
        $(".reg-box").hide()
    });

    //3. 验证表单：提示表单输入内容是否正确的规则：①从layui中获取form对象 ②通过form.verify()函数自定义校验规则 ③自定义一个叫pwd的校验规则 ④把此规则添加到密码结构lay-verify属性中，用|分隔
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        //验证两次密码是否一致的规则：采用函数方式
        repwd: function(value) { //value是确认密码的内容
            var pwd = $('.reg-box [name=password]').val() //注册的密码
            if (pwd !== value) return '两次密码不一致!'
        }
    });

    //4. 一个账号只能注册一次：监听注册表单事件，阻止默认提交事件，发起POST请求，若注册过返提示消息，若注册成功模拟点击登录行为跳到登录页面
    $('#form_reg').on("submit", function(e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() } //代码的优化，减轻post内容
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录！')
            $('#link_login').click();
        })
    });

    //5. 输入账号登录后：监听登录按钮，阻止默认提交，发起post请求，判断账号在后台有没有，无就登录失败，有就跳转到首页，且将响应的token字符串存到本地存储方便查看 
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), //快速获取登录数据
            success: function(res) {
                if (res.status !== 0) return layer.msg('登录失败！')
                layer.msg('登录成功！')
                localStorage.setItem('token', res.token)
                location.href = '/index.html' //跳转到后台主页
            }
        })
    })

})