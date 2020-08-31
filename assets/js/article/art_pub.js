$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate();
    //2. 初始化富文本编辑器
    initEditor()

    //1. 定义加载文章分类的方法，动态获取下拉菜单，用模板引擎渲染
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章类别失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate-id]').html(htmlStr)
                    //数据是模板引擎动态添加的，一定要用render渲染
                form.render()
            }
        })
    }

    //3. 封页剪裁区 3.1初始化图片裁剪器
    var $image = $('#image');
    //3.2裁剪选项
    var options = {
        aspectRatio: 400 / 280, //纵横比
        preview: '.img-preview' //在哪里打开图
    };
    //3.3初始化裁剪区域
    $image.cropper(options);

    //4. 为封页 选择按钮 绑定点击事件，点击后自动触发更换图片文件
    $("#btnChooseImage").on('click', function() {
        $("#coverFile").click()
    })

    //5. 监听 更换图片文件 的 change 事件，获取用户选择的文件列表
    $("#coverFile").on('change', function(e) {
        var files = e.target.files //获取文件列表数组
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域  
    })


    // 定义文章的发布状态
    var art_state = '已发布'

    //6. 存为草稿按钮：
    $("#btnSave2").on('click', function() {
        art_state = '草稿'
    })

    //7. 发布按钮：所有信息都拿到后给服务器发提交请求
    $("#form-pub").on('submit', function(e) {
        e.preventDefault();
        //(1)基于form表单快速创建一个FormData对象-请求体,并把5行内容补充完整
        var fd = new FormData($(this)[0]);
        // fd.forEach(function(v, k) {
        //     console.log(v, k) //title-标题值 cate_id-分类值 content-内容,只有3项内容，还需追加state发布状态和封页
        // })
        fd.append('state', art_state); //追加文章的发布状态到fd中
        //将封页裁剪后的图输出为一个文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象blob
                // 得到文件对象后，追加到fd中
                fd.append('cover_img', blob)
            });
        //(2)发起ajax请求提交数据，调用publishArticle()方法
        publishArticle(fd)
    })

    //8. 定义Ajax提交请求,发布文章
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注：若向服务器提交的是FormData格式的数据，必须添加如下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/S-bigEvent/article/art_list.html' //发布成功后跳转到文章列表页面
            }
        })
    }

})