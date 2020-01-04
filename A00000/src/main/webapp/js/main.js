$(function () {
    $.ajax({
        "url": "/A00000/getAllEssayList.action",
        "type": "GET",
        "data": {},
        "dataType": "JSON",
        "success": function (data, status, obj) {
            for (var i = 0; i < data.length; i++) {
                var inner;
                if(data[i]["password"] == "true"){
                    inner = "<li value='" + data[i]["id"] + "'> [加密] " + data[i]["title"] + "</li>";
                } else {
                    inner = "<li value='" + data[i]["id"] + "'>" + data[i]["title"] + "</li>";
                }
                if(inner != "") {
                    $("#titleList").append(inner);
                }
            }
            $("li").click(function () {
                var id = $(this).attr("value");
                var isPassword = $(this).html().search("[加密]") != -1;
                var password = "";
                if(isPassword){
                    password = prompt("请输入该文章的密码");
                    if(password == ""){
                        alert("密码不能为空!");
                        return;
                    }
                }
                $.ajax({
                    "url" : "/A00000/getEssayById.action",
                    "type" : "POST",
                    "data" : {"id" : id, "password" : password},
                    "dataType" : "JSON",
                    "success" : function (data, status, obj) {
                        if(data["status"] == "success") {
                            $("#title").html(data["title"]);
                            $("#edit").css("display", "block");
                            $("#edit").val(id);
                            $("#edit").attr("pwd", password);
                            $("#creator").html("创作者: " + data["creator"]);
                            $("#createTime").html("创作时间: " + data["createTime"]);
                            $.ajax({
                                "url" : "/A00000/getEssayContentById.action",
                                "type" : "POST",
                                "data" : {"id" : id, "password" : password},
                                "dataType" : "text",
                                "success" : function (data, status, obj) {
                                    var converter = new showdown.Converter();
                                    $("#content").html(converter.makeHtml(data));
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
            });
        },
        "error": function (data, status, obj) {
            alert("error!");
        }
    });
    $("#update").click(function (event) {
        var id = $("#edit").val();
        var password = $("#edit").attr("pwd");
        $(this).attr("href", "EssayCreator.html?id=" + id + "&password=" + password);
    });
    $("#delete").click(function (event) {
        var key = prompt("请输入令牌key");
        var value = prompt("请输入令牌value");
        var id = $("#edit").val();
        if(key == null || key == "" || value == null || value == "") {
            alert("令牌不能为空!");
        } else {
            if(confirm("确认删除? 此操作不可逆")) {
                $.ajax({
                    "url" : "/A00000/deleteEssay.action",
                    "type" : "POST",
                    "data" : {"id" : id, "key" : key, "value" : value},
                    "dataType" : "JSON",
                    "success" : function (data, status, obj) {
                        if (data["status"] == "success") {
                            alert("删除成功!");
                            location.reload();
                        } else {
                            alert(data["message"]);
                        }
                    },
                    "error" : function (data, status, obj) {
                        alert("error");
                    }
                });
            }
        }
        event.preventDefault();
    });
    $("#submit").click(function () {
        var username = $("#username").val();
        var qqid = $("#qqid").val();
        var wechatid = $("#wechatid").val();
        var email = $("#email").val();
        var telephone = $("#telephone").val();
        if (username == "") {
            alert("称呼不能为空哦!");
            return;
        }
        if (qqid == "" && wechatid == "" && email == "" && telephone == "") {
            alert("请至少留下一项联系方式!");
            return;
        }
        $.ajax({
            url : "/A00000/addNewFriend.action",
            data : {"username": username, "qqid" : qqid, "wechatid" : wechatid, "email" : email, "telephone" : telephone},
            type : "POST",
            dataType : "JSON",
            success : function (data, status, obj) {
                if (data["status"] == "success") {
                    alert("提交成功!");
                    location.reload();
                } else {
                    alert(data["message"]);
                }
            },
            error : function (data, status, obj) {
                alert("error!");
            }
        });
    });
});