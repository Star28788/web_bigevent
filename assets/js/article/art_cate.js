$(function() {
    var form = layui.form
    var layer = layui.layer
    initArtCateList();

    //1. 表格中数据获取并渲染：发起get请求获取文章分类列表，把响应回来的数据用template渲染到表格
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //2. 添加类别按钮：点击后弹出提示框，在框里写入要填的分类名称和别名，用layui的弹出层，其属性可改。里面的表单另外用script做完再引用过来content
    $("#btnAddCate").on('click', function() {
        var indexAdd = null
        indexAdd = layer.open({ //index是索引，关闭弹出层时要用，open就是一个索引值
            type: 1, //默认为0底部有确认按钮，改为1无
            area: ['500px', '250px'], //指定弹出层的宽高
            title: '添加文章类别',
            content: $('#dialog-add').html()
        });
    });

    //3. 确认添加按钮：该按钮是模板添加的，只能通过委托绑定submit提交事件，再发起post提交请求，响应后把数据渲染到页面调用initArtCateList()，渲染成功后根据索引弹出层关闭close属性
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('新增分类失败！')
                layer.msg('新增分类成功！')
                initArtCateList()
                layer.close(indexAdd)
            }
        })
    });

    //4. 编辑按钮：该按钮是模板添加的，只能通过委托绑定点击事件，点击后弹出提示框，在框里写入要填的分类名称和别名，用layui的弹出层，其属性可改。里面的表单另外用script做完再引用过来content.
    var indexEdit = null
    $("tbody").on('click', '.btn-edit', function() {
        indexEdit = layer.open({ //index是索引，关闭弹出层时要用，open就是一个索引值
            type: 1, //默认为0底部有确认按钮，改为1无
            area: ['500px', '250px'], //指定弹出层的宽高
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        });

        //5. 弹出框里本应有原有的数据以供修改：发起GET请求获取id值，此值存在隐藏的input框，其他数据用layui的表单赋值form.val()快速让弹出框有数据
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res)
                form.val('form-edit', res.data)
            }
        })
    });

    //6. 确认按钮提交修改：通过代理形式为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //7. 删除按钮：通过代理的形式为删除按钮绑定点击事件,提示用户是否要删除
    $("tbody").on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })

})