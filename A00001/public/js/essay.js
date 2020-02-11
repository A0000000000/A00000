$(function() {
    let isValid = function(str) {
        if (str === undefined || str === null || str === "") {
           return false;
        }
        return true;
     }
    function SureKV () {
        let params = {
            id: window.vm.id,
            key: window.vm.key,
            value: window.vm.value
        };
        if (!isValid(params.id)) {
            alert('页面出错, 请刷新重试.');
            return;
        }
        if (!(isValid(params.key) && isValid(params.value))) {
            alert('令牌key或令牌value不能为空!');
            return;
        }
        $.ajax({
            url: '/deleteEssay',
            type:'POST',
            data: params,
            dataType: 'JSON',
            success: function(data, status, obj) {
                if (data.status === 'failed') {
                    alert(data.message);
                } else {
                    alert(data.message);
                    window.location.href = '/essaylist';
                }
            },
            error: function(data, status, obj) {
                console.dir(data);
            }
        });
    }
    function SurePwd (flag) {
        let params = {
            id: window.vm.id,
            password: window.vm.password
        }
        if (!isValid(params.id)) {
            alert('页面出错, 请刷新重试.');
            return;
        }
        if (flag && (!isValid(params.password))) {
            alert('密码不能为空!');
            return;
        }
        window.location.href = '/updateEssay?id=' + params.id + "&password=" + params.password;
    }
    $('#main').html($('#main').text())
    window.vm = new Vue({
        data () {
            return {
                type: '',
                typeid: null,
                password: '',
                key: '',
                value: '',
                id: ''
            };
        },
        methods: {
            getType (typeid) {  
                this.typeid = typeid;              
                return this.type;
            },
            handleUpdate (e, id, isPassword) {
                this.id = id;
                if (isPassword) {
                    $('#Password').modal('toggle');
                } else {
                    SurePwd(false);
                }
            },
            handleDelete (e, id) {
                this.id = id;
                $('#Token').modal('toggle')
            }, 
            handleSureKV (e) {
                SureKV();
                $('#Token').modal('toggle')
            },
            handleSurePwd (e) {
                SurePwd(true);
                $('#Password').modal('toggle');
            }
        }
    }).$mount('#app');
    $.ajax({
        url: '/getTypeById',
        data: {id: window.vm.typeid},
        type: 'POST',
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status !== 'failed') {
                window.vm.$data.type = data.name;
            } else {
                window.vm.$data.type = typeid;
            }
        },
        error: function(data, status, obj) {
            console.dir(data);
        }
    });
});