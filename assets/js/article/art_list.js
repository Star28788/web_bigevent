$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    //3. 文章列表里有时间显示，定义一个美化时间过滤器，要用到模板引擎属性调用template.defaults.imports  命名为dataFormat,在script模板中调用
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //1. 定义一个查询参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第1页的数值
        pagesize: 2, //每页显示数据的条数，默认2条
        cate_id: '', //文章分类的id，默认所有分类
        state: '' //文章分布状态，默认所有状态
    }
    initTable()
    initCate()

    //2. 文章列表：若获取数据成功，使用template模板引擎渲染,表格数据渲染后，渲染分页区
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    //4. 初始化文章分类可选项,获取数据成功后用模板引擎渲染到可选项. 又由于模板结构在layui.js之前执行，layui无法渲染模板内容，要调用layui的form.render方法渲染
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //5. 为筛选表单绑定submit事件,获取表单中选中项的值，并赋值到q中，最后调用渲染列表函数，根据最新的筛选条件重新渲染表格数据
    $("#form-search").on("submit", function(e) {
        e.preventDefault()
        var cate_id = $("[name=cate_id]").val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    //6. 定义渲染分页的方法，res.total总数，根据总数来算分页.用layui中laypage方法做动态分页，laypage.render()方法渲染分页结构
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条
            curr: q.pagenum, //设置默认选中页码
            //页码条区域结构，用laypage的layout属性，不写该属性时默认有上一页/中间页/下一页，需加其他功能要添加.limit每页显示多少条(一个下拉菜单)，skip跳转
            // layout: ['prve', 'page', 'next'] 
            layout: ['count', 'limit', 'prve', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页显示多少条的可选数组
            //切换分页时，触发jump回调。触发方式：1.点击页面时触发first=undefined；2.只有调用了laypage.render()就触发first=true
            jump: function(obj, first) {
                // console.log(first)
                // console.log(obj.curr)
                // console.log(obj.limit)
                q.pagenum = obj.curr; //获取最新页码值
                q.pagesize = obj.limit; //获取最新条目数,更改条目数时也触发jump
                //重新渲染该页码的页面，但是不能直接用，否则会让页面1出现渲染死循环（因jump回调一直被触发2），其他页面无效. 需先判断是是哪种方式触发的
                // initTable() 
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //7. 删除按钮：代理submit,layui询问是否删除框,发起删除请求，请求成功刷新页面
    $("tbody").on("submit", function(e) {
        var len = $(".btn-delete").length //获取删除按钮个数
            // console.log(len)
        var id = $(this).attr('data-id') //获取文章id
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('删除文章失败！')
                    layer.msg('删除文章成功！');
                    //删除数据完成后需判断这页中是否还有剩余数据(删除按钮的数据是否为1，若为1，点删除后就没有数据了)，若无则页码值-1(页码值不小于1)后再重新渲染页面
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })

    })

})