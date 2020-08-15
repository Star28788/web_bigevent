$(function() {
    var form = layui.form

    //1. 表单验证提示框，pwd复制layui的，其他两个自定义，value是获取的输入表单的数字
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $(".newPwd").val()) return '新旧密码不能相同'
        },
        rePwd: function(value) {
            if (value !== $(".rePwd").val()) return '两次密码不一致'
        }
    })

    //2. 重置按钮不用管，直接默认重置为空
    //3. 修改密码提交按钮：监听表单form事件submit，阻止默认提交行为，发起提交请求。提交成功后表单密码重置清空-jQuery没有reset重置方法，只有js的DOM有，所以要先用[0]转js
    $(".layui-form").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(), //快速获取所有提交数据
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('更新密码失败！')
                layui.layer.msg('更新密码成功！')
                $(".layui-form")[0].reset()
            }
        })
    })

})