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
                key: '',
                value: '',
                id: '',
            };
        },
        methods: {
            handleDelete (id, e) {
                this.id = id;
                $('#Token').modal('toggle');
            },
            handleSureDelete (e) {
                $('#Token').modal('toggle');
                let params = {
                    id: this.id,
                    key: this.key,
                    value: this.value
                };
                this.key = '';
                this.value = '';
                if(!(isValid(params.key) && isValid(params.value))) {
                    alert("令牌不合法!");
                    return;
                }
                $.ajax({
                    url: '/deleteType',
                    type: 'POST',
                    data: params,
                    dataType: 'JSON',
                    success: function(data, status, obj) {
                        if (data.status === 'failed') {
                            alert(data.message);
                            return;
                        } else {
                            alert(data.message);
                            location.reload();
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