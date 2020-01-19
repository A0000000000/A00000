function isValid(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}

function deleteImage() {
    var id = $('#msgContentId').text();
    if (!isValid(id)) {
        alert('请先查看一张图片!');
        return;
    }
    $('#id1').val(id);
    $('#Token').modal();
}

function SureDeleteImage() {
    $('#Token').modal('toggle');
    var params = {};
    params.id = $('#id1').val();
    params.key = $('#key').val();
    params.value = $('#value').val();
    params.path = $('#msgContentPath').text();
    $('#key').val('');
    $('#value').val('');
    if (!(isValid(params.id) && isValid(params.path))) {
        alert('页面出错, 请刷新后重试!');
        return;
    }
    if (!(isValid(params.key) && isValid(params.value))) {
        alert('请输入令牌!');
        return;
    }
    $.ajax({
        url: '/deleteImageById',
        type: 'POST',
        data: params,
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status === 'failed') {
                alert(data.message);
            } else {
                alert(data.message);
                location.reload();
            }
        },
        error: function(data, status, obj) {
            alert('出现错误! ' + data);
        }
    });
}

function checkImage(id, password) {
    $('#id2').val(id);
    if (password) {
        $('#Password').modal();
    } else {
        SureCheckImage(false);
    }
}

function SureCheckImage(flag) {
    var params = {};
    params.id = $("#id2").val();
    if (!isValid(params.id)) {
        alert('页面出错, 请刷新后重试!');
        return;
    }
    $("#id2").val('');
    if (flag) {
        $('#Password').modal('toggle');
        params.password = $('#password').val();
        if (!isValid(params.password)) {
            alert('密码不合法!');
            return;
        }
        $('#password').val('');
    }
    $.ajax({
        url: '/getImageById',
        type: 'POST',
        data: params,
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status === 'failed') {
                alert(data.message);
            } else {
                $('body').css('background-image', 'url(' + data.path + ')');
                $('#msgContentId').text(data.id);
                $('#msgContentFilename').text(data.filename);
                $('#msgContentPath').text(data.path);
                $('#msgContentUploadTime').text(data.uploadTime);
            }
        },
        error: function(data, status, obj) {
            alert('出现错误! ' + data);
        }
    });
}
