$(document).ready(function() {
    // 定义美化事件的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + "-" + m + "-" + " " + hh + ":" + mm + ":" + ss;
    }

    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: "",
    }
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    initTable();
    initCate();

    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                // 使用模板引擎渲染页面数据
                console.log(res)
                var htmlStr = template("tpl-table", res);

                $("tbody").html(htmlStr);
                // 调用分页方法
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg("获取分类的数据失败！");
                var htmlStr = template("tpl-cate", res);

                $("[name=cate_id").html(htmlStr);
                form.render();
            }
        })
    }
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        var cate_id = $("[name=cate_id").val();
        var state = $("[name=state").val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    function renderPage(total) {
        console.log(total);
        laypage.render({
            elem: "pageBox",
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            // elem: "pageBox",
            // count: "100",
            // limit: "5",
            limits: [2, 3, 5, 10],
            // curr: "2",
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }

    $("body").on("click", ".btn-delete", function() {
        var len = $(".btn-delete").length;
        var id = $(this).data("id");
        layer.confirm("确认删除？", {
            icon: 3,
            title: "提示"
        }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败！");
                    }
                    layer.msg("删除文章成功！");
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
        })
    })
})