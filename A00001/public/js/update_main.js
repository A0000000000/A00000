// 验证参数是否合法
function isValid(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
 }

 // 页面加载事件
$(function() {
    // 回显数据同步显示框
    var converter = new showdown.Converter();
    {
        var mdText = $('#write').val();
        $('#show').html(converter.makeHtml(mdText));
    }
    // 监听复选框状态来决定输入框是否禁用
    $('#isPassword').change(function () {
        if ($(this).is(':checked')) {
            $('#password').removeAttr('disabled');
        } else {
            $('#password').attr('disabled', 'disabled');
            $('#password').val('');
        }
    });

    // 监听输入域内容改变来实时渲染markdown
    $('#write').bind('input propertychange', function () {
        var mdText = $(this).val();
        $('#show').html(converter.makeHtml(mdText));
    });
    
    // 清空输入
    $('#reset').click(function () {
        $('#write').val('');
        $('#show').html('');
    });

    // 提交数据
    $('#submit').click(function() {
        var params = {};
        params.id = $('#id').val();
        params.title = $('#essayTitle').val();
        params.creator = $('#essayCreator').val();
        params.key = $('#key').val();
        params.value = $('#value').val();
        params.password = $('#password').val();
        params.typeid = $('#type option:selected').attr('id');
        params.content = $('#write').val();
        if (!isValid(params.id)) {
            alert('页面出错! 请刷新后重试');
            return;
        }
        if (!isValid(params.title)) {
            alert('标题不能为空!');
            return;
        }
        if (!isValid(params.creator)) {
            alert('作者不能为空!');
            return;
        }
        if (!(isValid(params.key) && isValid(params.value))) {
            alert('key或value不能为空!');
            return;
        }
        if (!isValid(params.typeid)) {
            alert('类型不能为空!');
            return;
        }
        if (!isValid(params.content)) {
            alert('内容不能为空!');
            return;
        }
        $.ajax({
            url: '/updateEssay',
            type: 'POST',
            data: params,
            dataType: 'JSON',
            success: function(data, status, obj) {
                if (data.status === 'failed') {
                    alert(data.message);
                } else {
                    alert(data.message);
                    location.href = '/essay?id=' + params.id;
                }
            },
            error: function(data, status, obj) {
                alert('出现错误! ' + data);
            }
        });
    });

});