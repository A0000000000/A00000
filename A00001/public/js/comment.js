let isValid = function(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
 }

$(function() {
    window.vm = new Vue({
        data() {
            return {
                id: '',
                essayId: '',
                username: '',
                content: '',
                key: '',
                value: ''
            };
        },
        methods: {
            handleDelete (id, e) {
                this.id = id;
                $('#Token').modal('toggle');
            },
            handleSubmit (e) {
                let params = {
                    essayId: this.essayId,
                    username: this.username,
                    content: this.content
                };
                if (!isValid(params.essayId)) {
                    alert('页面出错, 请刷新重试!');
                    return;
                }
                if(!(isValid(params.username) && isValid(params.content))) {
                   alert('昵称或内容不能为空!');
                   return;
                }
                $.ajax ({
                    url: '/addComment',
                    type: 'POST',
                    data: params,
                    dataType: 'JSON',
                    success: function (data, status, obj) {
                        if (data.status === 'failed') {
                            alert(data.message);
                        } else {
                            alert(data.message);
                            window.location.reload();
                        }
                    },
                    error: function (data, status, obj) {
                        console.dir(data);
                    }
                });
            },
            handleSureDelete (e) {
                $('#Token').modal('toggle');
                let params = {
                    id: this.id,
                    key: this.key,
                    value: this.value
                };
                if (!isValid(params.id)) {
                    alert('页面出错, 请刷新重试!');
                    return;
                }
                if (!(isValid(params.key) && isValid(params.value))) {
                    alert('令牌不能为空!');
                    return;
                }
                $.ajax({
                    url: '/deleteComment',
                    data: params,
                    type: 'POST',
                    dataType: 'JSON',
                    success: function(data, status, obj) {
                        if (data.status === 'failed') {
                            alert(data.message);
                        } else {
                            alert(data.message);
                            window.location.reload();
                        }
                    },
                    error: function(data, status, obj) {
                        console.dir(data);
                    }
                });
            }
        }
    }).$mount('#app');
    window.vm.essayId = $('#essayId').val();
});