$(document).ready(function() {
    $("#link_reg").on("click", function() {
        $(".login-box").hide(200);
        $(".reg-box").show(200);
    });
    $("#link_login").on("click", function() {
        $(".reg-box").hide(200);
        $(".login-box").show(200);
    });


    // 从layui中获取form对象
    var form = layui.form;
    form.verify({
            pwd: [/^[\S]{6,12}$/, "密码必须6到12位,且不能出现空格"],
            cpwd: function(value) {
                var pwd = $(".reg-box [name=password]").val();
                console.log(1)
                if (pwd !== value)
                    return "两次输入密码不一致";
            }
        })
        // 监听注册表单的提交事件
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        $.post("/api/reguser", $(this).serialize(), function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            layui.layer.msg("注册成功！");
            $("#link_login").triggerHandler("click");
        })
    })
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg("登录失败！");
                layui.layer.msg("登录成功！");
                console.log(res.token);
                location.href = "/index.html";
                localStorage.setItem("token", res.token);
            }
        })
    })
})