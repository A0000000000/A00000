let isValid = function(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}
$(function() {
    let converter = new showdown.Converter();
    window.vm = new Vue({
        el: '#app',
        data: {
            disabled: !$('input[type="checkbox"]')[0].checked
        },
        methods: {
            handleChangePwd (e) {
                const checked = e.target.checked;
                if (!checked) {
                    $('#password').val('');
                }
                this.disabled = !checked;
            },
            submit () {
                let params = {};
                params.id = $('#id').val();
                if (!isValid(params.id)) {
                    alert('页面出错, 请刷新重试.');
                    return;
                }
                params.title = $('#essaytitle').val().trim();
                if (!isValid(params.title)) {
                    alert('标题不能为空!');
                    return;
                }
                params.creator = $('#creator').val().trim();
                if (!isValid(params.creator)) {
                    alert('作者不能为空!');
                    return;
                }
                params.key = $('#key').val().trim();
                if (!isValid(params.key)) {
                    alert('令牌Key不能为空!');
                    return;
                }
                params.value = $('#value').val().trim();
                if (!isValid(params.value)) {
                    alert('令牌Value不能为空!');
                    return;
                }
                params.password = $('#password').val().trim();
                params.content = $('#writeContent').val();
                if (!isValid(params.content)) {
                    alert('内容不能为空!');
                    return;
                }
                params.typeid = $('#type option:selected').attr('value');
                if (!isValid(params.typeid)) {
                    alert('类别不能为空!');
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
                            window.location.href = '/essay?id=' + params.id;
                        }
                    },
                    error: function(data, status, obj) {
                        console.dir(data);
                    }
                });
            },
            clean () {
                $('#writeContent').val('');
                $('#showContent').html('');
            }
        },
        computed: {
            contentHtml () {
                return converter.makeHtml($('#writeContent').val());
            }
        }
    });
    $('#writeContent').bind('input propertychange', function () {
        let mdText = $(this).val();
        $('#showContent').html(converter.makeHtml(mdText));
    });
});