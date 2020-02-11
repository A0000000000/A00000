let isValid = function(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}

$(function() {
    function showImage() {
        let params = {
            id: window.vm.id,
            password: window.vm.password
        };
        window.vm.password = '';
        if (!isValid(params.id)) {
            alert('页面出错, 请刷新重试!');
            return;
        }
        $.ajax({
            url: '/getImageById',
            data: params,
            type: 'POST',
            dataType: 'JSON',
            success: function(data, status, obj) {
                if (data.status === 'failed') {
                    alert(data.message);
                } else {
                    $('body').css('background-image', 'url(' + data.path + ')');
                    $('#msgContentId').text(data.id);
                    $('#msgContentFilename').text(data.filename);
                    $('#msgContentPath').text(data.path);
                    $('#msgContentUploadTime').text(data.uploadTime);
                    window.vm.path = data.path;
                }
            },
            error: function(data, status, obj) {
                console.dir(data);
            }
        });
    }
    window.vm = new Vue({
        data() {
            return {
                id: '',
                password: '',
                key: '',
                value: '',
                path: ''
            };
        },
        methods: {
            handleShowImg (e, id, pwd) {
                $('body').css('background-image', 'url()');
                $('#msgContentId').text('');
                $('#msgContentFilename').text('');
                $('#msgContentPath').text('');
                $('#msgContentUploadTime').text('');
                this.id = id;
                if (pwd === 'false') {
                    showImage();
                } else {
                    $('#Password').modal('toggle');
                }
            },
            handlePwdShow (e) {
                $('#Password').modal('toggle');
                showImage();
            },
            handleDelete (e) {
                $('#Token').modal('toggle');
            },
            handleDeleteImage (e) {
                $('#Token').modal('toggle');
                let params = {
                    id: this.id,
                    key: this.key,
                    value: this.value,
                    path: this.path
                };
                this.key = '';
                this.value = '';
                if (!(isValid(params.id) && isValid(params.path))) {
                    alert('页面出错, 请刷新后重试!');
                    return;
                }
                if (!(isValid(params.key) && isValid(params.value))) {
                    alert('请输入令牌!');
                    return;
                }
                $.ajax({
                    url: '/deleteImageById',
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

            }
        }
    }).$mount('#app');
});