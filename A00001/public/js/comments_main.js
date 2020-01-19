function isValid(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}

function deleteComment(id) {
    if (!isValid(id)) {
        alert('页面出错, 请刷新后重试!');
        return;
    }
    $('#id').val(id);
    $("#Token").modal();
}

function SureDeleteComment() {
    $('#Token').modal('toggle');
    var params = {};
    params.key = $('#key').val();
    $('#key').val('');
    params.value = $('#value').val();
    $('#value').val('');
    params.id = $('#id').val();
    $('#id').val('');
    if (!isValid(params.id)) {
        alert('页面出错, 请刷新后重试!');
        return;
    }
    if (!(isValid(params.key) && isValid(params.value))) {
        alert('令牌无效!');
        return;
    }
    $.ajax({
        url: '/deleteComment',
        type: 'POST',
        data: params,
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status === 'success') {
                alert(data.message);
                location.reload();
            } else {
                alert(data.message);
            }
        },
        error: function(data, status, obj) {
            alert('出现错误! ' + data);
        }
    });
}

$(function() {
    $('#commentSubmit').click(function() {
        var params = {};
        params.essayId = $('#essayId').val();
        params.username = $('#username').val();
        params.content = $('#content').val();
        if (!isValid(params.essayId)) {
            alert('页面出错, 请刷新后重试!');
            return;
        }
        if (!(isValid(params.username) && isValid(params.content))) {
            alert('称呼或评论不能为空!');
            return;
        }
        $.ajax({
            url: '/addComment',
            type: 'post',
            data: params,
            dataType: 'JSON',
            success: function(data, status, obj) {
                if (data.status === 'success') {
                    alert(data.message);
                    location.reload();
                } else {
                    alert(data.message);
                }
            },
            error: function(data, status, obj) {
                alert('出现错误! ' + data);
            }
        });
    });
});