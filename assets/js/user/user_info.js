$(document).ready(function() {
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "用户名称必须在6个字符之间!";
            }
        }
    })
    initUserInfo();
    var layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！");
                }
                // $("input[name=username]").val(res.data.username)
                // $("input[name=nickname]").val(res.data.nickname)
                // $("input[name=email]").val(res.data.email)
                // $("input[name=id]").val(res.data.id)
                form.val("formUserInfo", res.data);
                var id = $("input[name=id]").val();
            }
        })
    }
    $("#btnReset").on("click", function(e) {
        e.preventDefault();
        initUserInfo();
    })

    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        var form = document.querySelector(".layui-form");
        var formdata = new FormData(form);
        for (var key of formdata.entries()) {
            console.log(key[0] + "," + key[1]);
        }
        console.log($(this).serialize())
        $.ajax({
                method: "POST",
                url: "/my/userinfo",
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("更新用户信息失败！");
                    }
                    layer.msg("更新用户信息成功！");
                    window.parent.getUserInfo();
                }
            })
            // var xhr = new XMLHttpRequest();
            // xhr.open("POST", "http://api-breakingnews-web.itheima.net/my/userinfo");
            // xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
            // xhr.send(formdata);
            // xhr.onreadystatechange = function() {
            //     if (xhr.readyState === 4 && xhr.status === 200) {
            //         console.log(JSON.parse(xhr.responseText))
            //     }
            // }
    })
})