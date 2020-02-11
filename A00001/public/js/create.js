let isValid = function(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}
$(function() {
    window.vm = new Vue({
        el: '#app',
        data: {
            title: '',
            creator: 'A00000',
            key: '',
            value: '',
            password: '',
            type: '0',
            disabled: true,
            content: ''
        },
        methods: {
            handleChangePwd (e) {
                const checked = e.target.checked;
                if (!checked) {
                    this.password = '';
                }
                this.disabled = !checked;
            },
            submit () {
                let params = {};
                params.title = this.title.trim();
                if (!isValid(params.title)) {
                    alert('标题不能为空!');
                    return;
                }
                params.creator = this.creator;
                if (!isValid(params.creator)) {
                    alert('作者不能为空!');
                    return;
                }
                params.key = this.key;
                if (!isValid(params.key)) {
                    alert('令牌Key不能为空!');
                    return;
                }
                params.value = this.value;
                if (!isValid(params.value)) {
                    alert('令牌Value不能为空!');
                    return;
                }
                params.password = this.password;
                params.content = this.content;
                if (!isValid(params.content)) {
                    alert('内容不能为空!');
                    return;
                }
                params.typeid = this.type;
                if (!isValid(params.typeid)) {
                    alert('类别不能为空!');
                    return;
                }
                $.ajax({
                    url: '/addNewEssay',
                    data: params,
                    type: 'POST',
                    dataType: 'JSON',
                    success: function(data, status, obj) {
                        alert(data.message);
                        if (data.status === 'success') {
                            window.location.href = '/essaylist';
                        }
                    },
                    error: function(data, status, obj) {
                        console.dir(data);
                    }
                });
            },
            clean () {
                this.content = '';
            }
        },
        computed: {
            contentHtml () {
                let converter = new showdown.Converter();
                return converter.makeHtml(this.content);
            }
        }
    });
});