// 由于node渲染后的html是字符串, 所以页面加载后把字符串转成html
$(function() {
    $('#content').html($('#content').text());
});

// 验证提交的数据是否合法
function isValid(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
 }

 // 更新按钮的事件
function updateEssay(password) {
    if (password) {
        $('#Password').modal();
    } else {
        SureUpdate(false);
    }

}

// 删除按钮的事件
function deleteEssay() {
    $('#Token').modal();
}

// 模态对话框的按钮事件
function SureDelete() {
    $('#Token').modal('toggle');
    var params = {};
    params.id = $('#id1').val();
    params.key = $('#key').val();
    params.value = $('#value').val();
    $('#key').val('');
    $('#value').val('');
    if (!(isValid(params.id) && isValid(params.key) && isValid(params.value))) {
        alert('请求参数错误, 请重试!');
        return;
    }
    $.ajax({
        url: '/deleteEssay',
        type: 'POST',
        data: params,
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status == 'success') {
                alert(data.message);
                location.href = '/essaylist';
            } else {
                alert(data.message);
            }
        },
        error: function(data, status, obj) {
            alert('出现错误! ' + data);
        }
    });
}

// 模态对话框的按钮事件
function SureUpdate(flag) {
    var params = {};
    params.id = $('#id2').val();
    var url = '/update?id=' + params.id;
    if (flag) {
        $('#Password').modal('toggle');
        params.password = $('#password').val();
        if (!isValid(params.password)) {
            alert('密码不能为空!');
            return;
        }
        url = url + '&password=' + params.password;
    }
    if (!isValid(params.id)) {
        alert('页面出错, 请刷新后重试!');
        return;
    }
    $.ajax({
        url: '/validPassword',
        type: 'POST',
        data: params,
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status === 'failed') {
                alert(data.message);
            } else {
                location.href = url;
            }
        },
        error: function(data, status, obj) {
            alert('出现错误! ' + data);
        }
    });
    
}