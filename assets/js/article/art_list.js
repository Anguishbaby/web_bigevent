$(function() {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
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

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n :'0' + n
    }

    // 定义一个查询的参数对象
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate() 

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 成功：使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 成功：使用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                
                // 通知layui重新渲染一下表单区（它原来渲染的是空的表单区）
                form.render()
            }
        })
    }

    // 为筛选按钮绑定事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state

        // 重新渲染表单数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: total //数据总数，从服务端得到
            ,limit: q.pagesize
            ,curr: q.pagenum
            ,limits: [2, 3, 5, 10]
            ,layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            ,jump: function(obj, first) { // 分页切换触发的回调函数
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表
                if(!first) {
                    initTable()
                }
                
            }
          });        
    }

    // 通过代理的形式为删除按钮绑定事件
    $('tbody').on('click', 'btn-delete', function(e) {
        // 获取页面上的删除按钮数量（即该页面数据的数量）
        var len = $('.btn-delete').length
        // 获取删除的id
        var id = $(this).attr('data-id')

        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除数据失败')
                    }
                    layer.msg('删除成功')

                    // 数据删除后的判断：如果该页数据只有一项了
                    // 则此次删除完毕之后，页面上就没有任何数据了
                    if (len === 1) {
                        // 页码值最小只能等于1
                        // 三元表达式判断：
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    
                    initTable()
                }
            })
            layer.close(index)
        });
    })
})