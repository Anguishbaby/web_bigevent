$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章类别的方法
    function initCate() {
        $.ajax ({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }

                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                form.render()
            }
        })
    }

    // 图片裁切区
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件
    $('#coverFile').on('change', function(e) {
        // 拿到用户选择的文件列表
        var files = e.target.files

        if(files.length === 0) {
            return layer.msg('请选择文件')
        }
        // 根据文件选择对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮绑定
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        // 基于form表单，快速创建formData对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存入fd
        fd.append('state', art_state)
        // 将封面裁剪后的文件输出为图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件对象存储到fd对象中
                fd.append('cover_img', blob)
                // 发起ajax请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 向服务器提交的FormData格式的数据必须加这两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // 跳转页面
                location.href = '/article/art_list.html'
            }
        })
    }
})