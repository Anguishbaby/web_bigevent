$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }

        })
    }

    // 绑定点击事件：设置弹出层
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            area: ['500px', '250px']
            ,type: 1
            ,title: '添加文章分类'
            ,content: $('#dialog-add').html()
        });   
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                layer.close(indexAdd)
            }
        })
    })


    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function(e) {
        e.preventDefault()

        // 弹出层
        indexEdit = layer.open({
            area: ['500px', '250px']
            ,type: 1
            ,title: '修改文章分类'
            ,content: $('#dialog-edit').html()
        });  

        // 获取当前需要编辑的那栏的id
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })

        
    })

    // 为“确认修改”绑定事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 为“删除按钮”绑定事件
    $('tbody').on('click', '.btn-delete', function(){
        var id = $(this).attr('data-id')

        // 提示框
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除分类数据失败')
                    }
                    layer.msg('删除分类数据成功')
                    layer.close(index)
                    initArtCateList()
                }
            })
        });

    })
})