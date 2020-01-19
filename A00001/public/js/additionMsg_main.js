function isValid(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}

$(function() {
    $('#isPassword').change(function () {
        if($(this).is(':checked')) {
            $('#password').removeAttr('disabled');
        } else {
            $('#password').attr('disabled', 'disabled');
            $('#password').val('');
        }
    });

    $('#imageSubmit').click(function(){
        var formData = new FormData($('#ImageForm')[0]);
        $.ajax({
            url: '/addImages',
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'JSON',
            success: function (data, status, obj) {
                if (data['status'] === 'failed') {
                    alert(data['message']);
                } else if (data['status'] === 'middle') {
                    alert(data.message);
                }else {
                    alert(data.message);
                    location.reload();
                }
            },
            error: function (data, status, obj) {
                alert('出现错误! ' + data);
            }
        });
    });

    $('#typeSubmit').click(function() {
        var params = {};
        params.name = $('#typename').val();
        params.message = $('#introduction').val();
        params.key = $('#key_2').val();
        params.value = $('#value_2').val();
        if (!isValid(params.name)) {
            alert('名称不能为空!');
            return;
        }
        if (!(isValid(params.key) && isValid(params.value))) {
            alert('参数不合法!');
            return;
        }
        $.ajax({
            url: '/addType',
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
    });
});