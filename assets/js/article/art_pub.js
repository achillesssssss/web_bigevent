$(document).ready(function() {
    var layer = layui.layer;
    var form = layui.form;

    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 400,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    initCate();

    function initCate() {

        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("初始化文章分类失败！");
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                var Id = getId();
                if (Id) {
                    $.ajax({
                        method: "GET",
                        url: "/my/article/" + Id,
                        success: function(res) {

                            $("[name=title]").val(`${res.data.title}`)
                            $(`select>option[value=${res.data.cate_id.toString()}]`).prop("selected", "true");
                            tinyMCE.editors[0].setContent(res.data.content)
                            console.log("true")
                            var newImgURL = "http://api-breakingnews-web.itheima.net" + res.data.cover_img;
                            console.log(newImgURL)
                            $image
                                .cropper('destroy') // 销毁旧的裁剪区域
                                .attr('src', newImgURL) // 重新设置图片路径
                                .cropper(options) // 重新初始化裁剪区域
                            form.render();
                            // $("#form-pub").off("submit", submitEvent);
                            //     $("#form-pub").on("submit", function(e) {
                            //         e.preventDefault();
                            //         var fd = new FormData($(this).get(0));
                            //         fd.append("Id", Id);
                            //         fd.append("state", art_state);
                            //         // 将封面裁剪过i后的图片转化为文件对象
                            //         $image
                            //             .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                            //                 width: 400,
                            //                 height: 400
                            //             })
                            //             .toBlob(function(blob) {
                            //                 // 将 Canvas 画布上的内容，转化为文件对象
                            //                 // 得到文件对象后，进行后续的操作
                            //                 fd.append("cover_img", blob);
                            //                 publishArticle(fd);
                            //             });
                            //     $.ajax({
                            //         method: "POST",
                            //         url: "/my/article/edit",
                            //         data: fd,
                            //         success: function(res) {
                            //             if (res.status !== 0) {
                            //                 return layer.msg("修改文章失败！")
                            //                 console.log(11);

                            //             }
                            //             layer.msg("修改文章成功！")
                            //             console.log(11);


                            //         }
                            //     })
                            // })

                        }
                    });
                }
                console.log("false")
                form.render();

            }
        })


    }
    $("#btnChooseImage").on("click", function() {
        $("#coverFile").click();
    })
    $("#coverFile").on("change", function(e) {
        var files = e.target.files;
        if (files.length === 0)
            return
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        console.log(newImgURL)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    var art_state = "已发布";
    $("#btnSave2").on("click", function() {
        console.log(1);
        art_state = "草稿";
    });
    $("#form-pub").on("submit", submitEvent)

    function submitEvent(e) {
        e.preventDefault();

        var fd = new FormData($(this).get(0));
        for (var [a, b] of fd.entries()) {
            console.log(a, b);
        }
        fd.append("state", art_state);
        // 将封面裁剪过i后的图片转化为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 400
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                var Id = getId();
                if (!Id) {
                    publishArticle(fd);
                } else {
                    fd.append("Id", Id);
                    editArticle(fd)
                }
            });

    }

    function editArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/edit",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg("修改文章失败！");
                layer.msg("修改文章成功！");
                location.href = "/article/art_list.html";
            }
        })
    }

    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg("发布文章失败！");
                layer.msg("发布文章成功！");
                location.href = "/article/art_list.html"
            }
        })
    }

    function getId() {
        var url = location.href;
        return url.split("=")[1];
    }

    // function fillInfo() {
    //     var id = getId();
    //     if (id) {
    //         $.ajax({
    //             method: "GET",
    //             url: "/my/article/" + id,
    //             success: function(res) {
    //                 console.log(res);
    //                 $("[name=title]").val(`${res.data.title}`)
    //                     console.log($(`select>option[value=${res.data.cate_id}]`));
    //                     $(`select>option[value=${res.data.cate_id}]`).prop("selected", "true");
    //                     form.render();
    //                     $.ajax({
    //                         method: "GET",
    //                         url: "/my/article/cates/" + res.data.cate_id,
    //                         success: function(res) {
    //                             if (res.status !== 0) return layer.msg("获取文章类别失败！");
    //                             console.log($(`select>option[value=${res.data.Id}]`));
    //                             $(`select>option[value=${res.data.Id}]`).prop("selected", "true");
    //                             form.render();
    //                         }
    //                     })
    //             }
    //         })
    //     }
    // }
})