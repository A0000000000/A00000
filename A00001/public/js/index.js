function loadLive2D() {
    live2d_settings['modelId'] = 1;
    live2d_settings['modelTexturesId'] = 87;
    live2d_settings['modelStorage'] = false;
    live2d_settings['canCloseLive2d'] = false;
    live2d_settings['canTurnToHomePage'] = false;
    live2d_settings['waifuSize'] = '400x357';
    live2d_settings['waifuTipsSize'] = '300x100'; 
    live2d_settings['waifuFontSize'] = '20px';
    live2d_settings['waifuToolFont'] = '36px';
    live2d_settings['waifuToolLine'] = '50px';
    live2d_settings['waifuToolTop'] = '-60px';
    live2d_settings['waifuDraggable'] = 'axis-x';
    initModel("/public/assets/waifu-tips.json?v=1.4.2")
}
function formatDate(time){
	var date = new Date(time);
	var year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate(),
		hour = date.getHours(),
		min = date.getMinutes(),
		sec = date.getSeconds();
	var newTime = year - 1970 + '年' +
				month + '月' +
				day + '天' +
				hour + '小时' +
				min + '分钟' +
				sec + '秒';
	return newTime;			
}
$(function() {
    loadLive2D();
    window.vm = new Vue({
        el: '#app',
        data: {
            count: 0,
            date: null,
            interval: null
        },
        methods: {

        },
        computed: {
            showDate () {
                return formatDate(this.date);
            }
        }
    });
    function add1s () {
        window.vm.$data.date = window.vm.$data.date + 1000;
    }
    $.ajax({
        url: '/getServerRunTime',
        type: 'POST',
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status === 'success') {
                window.vm.date = data.date;
                window.vm.interval = setInterval(add1s, 1000);
            } else {
                console.log(data.msg);
            }
        },
        error: function(data, status, obj) {
            console.dir(data);
            console.dir(status);
            console.dir(obj);
        }
    })
    $.ajax({
        url: '/getAccessCount',
        type: 'POST',
        dataType: 'JSON',
        success: function(data, status, obj) {
            if (data.status === 'success') {
                window.vm.count = data.count;
            } else {
                console.log(data.msg);
            }
        },
        error: function(data, status, obj) {
            console.dir(data);
            console.dir(status);
            console.dir(obj);
        }
    });
});