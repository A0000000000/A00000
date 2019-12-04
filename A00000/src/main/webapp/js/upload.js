$(function() {
    $.ajax({
        "url": "/A00000/getAllImage.action",
        "type": "POST",
        "data": {},
        "dataType": "JSON",
        "success": function (data, status, obj) {
            for (var i = 0; i < data.length; i++) {
                var inner;
                if(data[i]["password"] == "true"){
                    inner = "<li value='" + data[i]["id"] + "'> [加密] " + data[i]["filename"] + "</li>";
                } else {
                    inner = "<li value='" + data[i]["id"] + "'>" + data[i]["filename"] + "</li>";
                }
                if(inner != "") {
                    $("#list").append(inner);
                }
            }
            $("li").click(function () {
                var id = $(this).attr("value");
                var isPassword = $(this).html().search("[加密]") != -1;
                var password = "";
                if(isPassword){
                    password = prompt("请输入该图片的密码");
                    if(password == ""){
                        alert("密码不能为空!");
                        return;
                    }
                }
                $.ajax({
                    "url" : "/A00000/getImageById.action",
                    "type" : "POST",
                    "data" : {"id" : id, "password" : password},
                    "dataType" : "JSON",
                    "success" : function (data, status, obj) {
                        if(data["status"] == "success") {
                            $("#image").css("display", "block");
                            var filename = data["filename"];
                            var path = data["path"];
                            var uploadTime = data["uploadTime"];
                            $("#filename").html(filename);
                            $("#path").html(path);
                            $("#uploadTime").html(uploadTime);
                            $("#imageShow").attr("src", path);
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

    $("#isPassword").change(function () {
        if($(this).is(":checked")) {
            $("#password").removeAttr("disabled");
        } else {
            $("#password").attr("disabled", "disabled");
            $("#password").val("");
        }
    });
    $("#submit").click(function(){
        var formData = new FormData($("#ImageForm")[0]);
        $.ajax({
            url : "/A00000/imageUpload.action",
            type : "POST",
            data : formData,
            cache : false,
            processData : false,
            contentType : false,
            dataType : "JSON",
            success : function (data, status, obj) {
                if (data["status"] == "failed") {
                    alert(data["message"]);
                } else if (data["status"] == "middle") {
                    alert("上传完成, 但部分失败! 成功" + data["success"] + ", 失败" + data["failed"] + "!")
                }else {
                    alert("上传成功!");
                    location.reload();
                }
            },
            error : function (data, status, obj) {
                alert("error!");
            }
        });
    });
});