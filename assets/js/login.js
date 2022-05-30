$(function() {
    // 点击注册账号的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击登录链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer

    // 自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ], 
        repwd: function(value) {
            // 通过形参拿到确认密码的内容，和密码框的进行比较。
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止默认的提交行为
        e.preventDefault()

        var data = {
            username: $('#form_reg [name=username]').val(), 
            password: $('#form_reg [name=password]').val()
        }
        // 发起ajax请求
        $.post('/api/reguser', data, 
        function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            } 
            layer.msg('注册成功，请登陆')
            // 用程序模拟点击事件
            $('#link_login').click()
        })
    })

    // 监听登陆表单
    $('#form_login').submit(function(e) {
        e.preventDefault()

        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登陆成功')
                // 存储token字符串
                localStorage.setItem('token', res.token)
                // 跳转至后台主页
                location.href = '/index.html'
            }
        })
        
    })
})

