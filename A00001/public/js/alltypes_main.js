function isValid(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}

function deleteType(id) {
    $('#id').val(id);
    $('#Token').modal();
}

function SureDeleteType() {
    $('#Token').modal('toggle');
    var params = {};
    params.id = $('#id').val();
    if (!isValid(params.id)) {
        alert("页面出错, 请刷新后重试!");
        return;
    }
    params.key = $('#key').val();
    $('#key').val('');
    params.value = $('#value').val();
    $('#value').val('');
    if(!(isValid(params.key) && isValid(params.value))) {
        alert("令牌不合法!");
        return;
    }
    $.ajax({
        url: '/deleteType',
        type: 'POST',
        data: params,
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status === 'failed') {
                alert(data.message);
                return;
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