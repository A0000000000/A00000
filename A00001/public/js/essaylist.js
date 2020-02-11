function GetQueryString(name) {
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
$(function() {
    window.vm = new Vue({
        el: '#app',
        data: {
            last_page_class: { 'nav-link': true, 'disabled': true },
            currentpage: 1,
            next_page_class: { 'nav-link': true, 'disabled': false },
            pages: 0,
            size: 10
        },
        methods: {
            
        }
    });
    let page = Number(GetQueryString('page'));
    if (page) {
        console.log(page);
    } else {
        page = 1;
    }
    window.vm.currentpage = page;
    if (page > 1) {
        window.vm.last_page_class['disabled'] = false;
    }
    let size = Number(GetQueryString('size'));
    if (size && size > 0) {
        window.vm.size = size;
    }
    $.ajax({
        url: '/getPages',
        data: {
            size: size
        },
        type: 'POST',
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status === 'failed') {
                console.log(data.msg);
            } else {
                let pages = data.pages;
                window.vm.pages = pages;
                if (page >= pages) {
                    window.vm.next_page_class['disabled'] = true;
                }
            }
        },
        error: function(data, status, obj) {

        }
    });
});