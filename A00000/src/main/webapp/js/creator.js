$(function () {
    var action = "/A00000/addNewEssay.action";
    var url =  location.href.split("?")[0];
    if(url == undefined) {
        url = location.href;
    }
    var param = location.href.split("?")[1];
    var password = "";
    if(param != undefined) {
        var kvs = param.split("&");
        for (var i = 0; i < kvs.length; i++) {
            var kv = kvs[i].split("=");
            if(kv[0] == "id") {
                $("#id").val(kv[1]);
                action = "/A00000/updateEssay.action"
            }
            if(kv[0] == "password") {
                password = kv[1];
                if(password != undefined && password != null && password != "") {
                    $("#isPassword").attr("checked", "checked");
                    $("#password").removeAttr("disabled");
                    $("#password").val(password);
                }
            }
        }
        $.ajax({
            "url" : "/A00000/getEssayById.action",
            "type" : "POST",
            "data" : {"id" : $("#id").val(), "password" : password},
            "dataType" : "JSON",
            "success" : function (data, status, obj) {
                if(data["status"] == "success") {
                    $("#title").val(data["title"]);
                    $("#creator").val(data["creator"]);
                    $.ajax({
                        "url" : "/A00000/getEssayContentById.action",
                        "type" : "POST",
                        "data" : {"id" : $("#id").val(), "password" : password},
                        "dataType" : "text",
                        "success" : function (data, status, obj) {
                            $("#write").val(data);
                            var converter = new showdown.Converter();
                            $("#show").html(converter.makeHtml(data));
                        },
                        "error" : function (data, status, obj) {
                            alert("error!");
                        }
                    });
                } else {
                    alert(data["message"]);
                }
            },
            "error" : function (data, status, obj) {
                alert("error!");
            }
        });
    }
    $("#write").bind("input propertychange", function () {
        var mdText = $(this).val();
        var converter = new showdown.Converter();
        $("#show").html(converter.makeHtml(mdText));
    });
    $("#isPassword").change(function () {
        if($(this).is(":checked")) {
            $("#password").removeAttr("disabled");
        } else {
            $("#password").attr("disabled", "disabled");
            $("#password").val("");
        }
    });
    $("#submit").click(function () {
        var id = $("#id").val();
        var title = $("#title").val();
        var creator = $("#creator").val();
        var key = $("#key").val();
        var value = $("#value").val();
        var password = $("#password").val();
        var content = $("#write").val();
        if(title == ""){
            alert("标题不能为空!");
            return;
        }
        if(content == ""){
            alert("内容不能为空!");
            return;
        }
        if(creator == ""){
            alert("作者不能为空!");
            return;
        }
        if(key == "" || value == ""){
            alert("令牌不能为空!");
            return;
        }
        if($("#isPassword").is(":checked")){
            if(password == ""){
                alert("密码不能为空!");
                return;
            }
        }
        $.ajax({
            "url" : action,
            "data" : {"id": id, "title" : title, "content" : content, "creator" : creator, "password" : password, "key" : key, "value" : value},
            "type" : "POST",
            "dataType" : "JSON",
            "success" : function (data, status, obj) {
                if (data["status"] == "failed") {
                    alert(data["message"]);
                } else {
                    alert("提交成功!");
                    location.href = url;
                }
            },
            "error" : function (data, status, obj) {
                alert("error");
            }
        });
    });
    $("#reset").click(function () {
        $("#write").val("");
        $("#show").html("");
    });
});