let isValid = function(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}

$(function() {
    window.vm = new Vue({
        data () {
            return {
                username: '',
                telephone: '',
                qqid: '',
                wechatid: '',
                email: ''
            };
        },
        methods: {
            handleSubmit (e) {
                let params = {
                    username: this.username,
                    telephone: this.telephone,
                    qqid: this.qqid,
                    wechatid: this.wechatid,
                    email: this.email
                };
                if (!isValid(params.username)) {
                    alert('请留下您的称呼!');
                    return;
                }
                if (!(isValid(params.telephone) || isValid(params.qqid) || isValid(params.wechatid) || isValid(params.email))) {
                    alert('请至少留下一项联系方式');
                    return;
                }
                $.ajax({
                    url: '/addNewFriend',
                    type: 'POST',
                    data: params,
                    dataType: 'JSON',
                    success: function(data, status, obj) {
                        if (data.status === 'failed') {
                            alert(data.message);
                        } else {
                            alert(data.message);
                            window.location.href = '/essaylist?page=1&size=10';
                        }
                    },
                    error: function(data, status, obj) {
                        console.dir(data);
                    }
                });
            }
        }
    }).$mount('#app');
});