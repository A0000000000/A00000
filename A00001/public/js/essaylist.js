function GetQueryString(name) {
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

let isValid = function(str) {
    if (str === undefined || str === null || str === "") {
       return false;
    }
    return true;
}

function deleteTag (id) {
    window.vm.tagId = id;
    window.vm.isAdd = false;
    $('#DIV').modal('toggle');
}

function addTag (id) {
    window.vm.essayId = id;
    window.vm.isAdd = true;
    $('#DIV').modal('toggle');
}

function SetData(id, sel, jsonData) {
    let html = '';
    html += '<div>';
    for (let i = 0; i < jsonData.length; i++) {
        let item = jsonData[i];
        html += `<div><button type="button" class="btn btn-outline-danger" onclick="deleteTag('${ item.id }')">${ item.name } &times;</button></div>`;
    }
    html += '</div>';
    html += `<button class="btn btn-outline-primary" onclick="addTag('${id}')">添加标签</button>`;
    sel.html(html);
}
$(function() {
    window.vm = new Vue({
        el: '#app',
        data: {
            last_page_class: { 'nav-link': true, 'disabled': true },
            currentpage: 1,
            next_page_class: { 'nav-link': true, 'disabled': false },
            pages: 0,
            size: 10,
            key: '',
            value: '',
            name: '',
            isAdd: false,
            tagId: '',
            essayId: ''
        },
        methods: {
            handlerMouseEnter (e, id) {
                $('#info_' + id).slideUp(500);
                $('#tag_' + id).slideDown(500);
                $.ajax({
                    url: 'getTagsByEssayId',
                    data: {essayId: id},
                    type: 'POST',
                    dataType: 'JSON',
                    success: function(data, status, obj) {
                        if (data.status && data.status === 'failed') {
                            alert(data.message);
                            return;
                        }
                        SetData(id, $('#tag_' + id), data);
                    },
                    error: function(data, status, obj) {
                        console.dir(data);
                    }
                });
            },
            handlerMouseLeave (e, id) {
                $('#tag_' + id).slideUp(500);
                $('#info_' + id).slideDown(500);
                SetData(id, $('#tag_' + id), []);
            },
            handleDiv (e) {
                $('#DIV').modal('toggle');
                let params = {};
                if (this.isAdd) {
                    params['essayId'] = this.essayId;
                    params['key'] = this.key.trim();
                    params['value'] = this.value.trim();
                    params['tagName'] = this.name.trim();
                    if (!isValid(params.essayId)) {
                        alert('页面出错, 请刷新重试!');
                        return;
                    }
                    if (!(isValid(params.key) && isValid(params.value))) {
                        alert('令牌不能为空!');
                        return;
                    }
                    if (!isValid(params.tagName)) {
                        alert('标签名不能为空!');
                        return;
                    }
                    $.ajax({
                        url: '/addTag',
                        type: 'POST',
                        data: params,
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
                } else {
                    params['id'] = this.tagId;
                    params['key'] = this.key.trim();
                    params['value'] = this.value.trim();
                    if (!isValid(params.id)) {
                        alert('页面出错, 请刷新重试!');
                        return;
                    }
                    if (!(isValid(params.key) && isValid(params.value))) {
                        alert('令牌不能为空!');
                        return;
                    }
                    $.ajax({
                        url: '/deleteTag',
                        type: 'POST',
                        data: params,
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
                this.key = '';
                this.value = '';
                this.tagId = '';
                this.essayId = '';
            }
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
            console.dir(data);
        }
    });
});