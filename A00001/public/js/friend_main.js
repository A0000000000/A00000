function isValid(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}

$(function() {
    $('#submit').click(function() {
        var params = {};
        params.username = $('#username').val();
        params.telephone = $('#phone').val();
        params.qqid = $('#qqid').val();
        params.wechatid = $('#wechatid').val();
        params.email = $('#email').val();
        if (!isValid(params.username)) {
            alert('请输入如何称呼您!');
            return;
        }
        if (!(isValid(params.qqid) || isValid(params.wechatid) || isValid(params.phone) || isValid(params.email))) {
            alert('请至少输入一项联系方式!');
            return;
        }
        $.ajax({
            url: '/addFriend',
            type: 'POST',
            data: params,
            dataType: 'JSON',
            success: function(data, status, obj) {
                if (data.status === 'success') {
                    alert(data.message);
                    location.href = '/';
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