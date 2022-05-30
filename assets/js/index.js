$(function() {
    getUserinfo()

    var layer = layui.layer

    // 绑定退出按钮的绑定事件
    $('#btnLogout').on('click', function() {
        layer.confirm("确定退出？", {icon: 3, title: '提示'},
        function(index) {
            // 清空本地的token
            localStorage.removeItem('token')
            // 重新跳转至登陆页
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index)
        })
    })
})

// 获取用户基本信息
function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if(res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用函数渲染用户头像
            renderAvatar(res.data)
        }
    })
}

// 调用函数渲染用户头像
function renderAvatar(user) {
    // 获取名称
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染头像
    if(user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}