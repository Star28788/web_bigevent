$(function() {
    //1. 裁剪区
    // 1.1 获取裁剪区域的 DOM 元素 
    var $image = $('#image')
        // 1.2 配置选项  
    const options = {
            // 纵横比 ,裁剪框的宽高比，也改变头像形状   
            aspectRatio: 1,
            // 指定预览区域    
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域  
    $image.cropper(options)


    //2. 上传按钮：点击后要弹出上传文件夹，此上传文件文件夹应是input的file，隐藏在上传按钮附件.点击上传按钮时程序打开文件表单
    $("#btnChooseImage").on('click', function() {
        $("#file").click();

    });

    //3. 给文件选择框绑定点击选择事件change，点击选择后判断是否选中，选到后拿到该图片索引，将图片转为路径，把旧路径销毁后把新路径加到src，最后初始化裁剪区
    $('#file').on('change', function(e) {
        console.log(e)
        var filelist = e.target.files //获取用户选择文件{0: File, length: 1}
        if (filelist.length === 0) return layui.layer.msg('请选择图片！')
        var file = e.target.files[0] //拿到用户选择的文件索引
        var imgURL = URL.createObjectURL(file) //文件转路径
        $image.cropper('destroy') //销毁旧裁剪区
            .attr('src', imgURL) //重新设置文件路径
            .cropper(options) //重新初始化裁剪区
    });

    //4. 确定按钮：点击后拿到用户剪切后的图片，把该头像上传到服务器，根据响应判断更换头像是否成功，若成功需将本子页面的头像渲染到父页面上
    $("#btnUpload").on('click', function() {
        var dataURL = $image.cropper('getCroppedCanvas', { //拿到裁剪后的头像：创建一个Canvas画布
            width: 100,
            height: 100
        }).toDataURL('image/png'); //将画布上的内容转化为base64格式字符串
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('更换头像失败！')
                layui.layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        })

    })



})