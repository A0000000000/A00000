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
                typename: '',
                introduction: '',
                key: '',
                value: '',
                disabled: true
            };
        },
        methods: {
            handleTypeSubmit (e) {
                let params = {
                    name: this.typename,
                    message: this.introduction,
                    key: this.key,
                    value: this.value
                };
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
            },
            handleChange (e) {
                const checked = e.target.checked;
                if (!checked) {
                    $('#password').val('');
                }
                this.disabled = !checked;
            },
            handleImageSubmit (e) {
                let formData = new FormData($('#ImageForm')[0]);
                $.ajax({
                    url: '/uploadImage',
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
            }
        }
    }).$mount('#app');
});