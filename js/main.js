window.onload = function () {
    var oName = get.byId('username');
    var oNameBox = get.byId('namebox');
    var aImgs = get.byTagName('img', oNameBox);
    var oBtn = get.byTagName('button', get.byId('tr'))[0];
    var oCountBox = get.byClassName('tip', get.byId('tr'))[0];
    var oCount = get.byClassName('count', get.byId('tr'))[0];
    var oContent = get.byId('content');
    var oUl = get.byTagName('ul', get.byId('list'))[0];
    var aLis = get.byTagName('li', oUl);
    var oMain = get.byId('main');
    var oList = get.byId('list');
    var aDelete = get.byTagName('a', oList);
    var count = 140;
    var canSend = false;
    var timer = null;
    var len = aLis.length;
    init();
    //初始化
    function init() {
        //获取localStorage全部数据
        for (var i = 0; i < localStorage.length; i++) {
            var getKey = localStorage.key(i);
            var getVal = JSON.parse(localStorage.getItem(getKey));
            var newLi = document.createElement('li');
            newLi.className = 'clearfix';
            newLi.innerHTML = '<div class="upic"> <img src=' + getVal.src +
                '> </div> <div class="user-content"> <p class="user">' + getVal.name +
                '</p> <p class="ucontent">' + getVal.content +
                '</p> <p class="date">' + getVal.time + '</p> <a class="delete"> 删除 </a> </div>';
            newLi.userNo = getKey;
            aLis.length = 0 ? oUl.appendChild(newLi) : oUl.insertBefore(newLi, aLis[0]);
            len++;
        }
        contentLimit();
        iHover();
        iDelete();
        oMain.style.height = oList.offsetTop + oList.offsetHeight + 10 + 'px';
    }
    //头像选中效果
    for (var i = 0; i < aImgs.length; i++) {
        aImgs[i].onclick = function () {
            for (var j = 0; j < aImgs.length; j++) {
                aImgs[j].className = '';
            }
            this.className = 'picked';
        }
    }


    //给广播按钮添加属性，可通过点击或Ctrl+enter发送
    EventUtil.addEvent(oBtn, 'click', send);
    EventUtil.addEvent(document, 'keydown', function (ev) {
        var e = ev || window.event;
        if (e.ctrlKey && e.keyCode == 13) {
            send();
        }
    })

    function send() {
        if (oName.value == '') {
            alert('姓名不能为空');
            oName.focus();
        } else if (!/^[\u4e00-\u9fa5\w]{2,10}$/.test(oName.value)) {
            alert('姓名至少由2-8位数字，字母,汉字或下划线组成');
            oName.focus();
        } else if (oContent.value == '') {
            alert('请说点什么吧');
            oContent.focus();
        } else if (!canSend) {
            alert('您的内容已超出限制');
            oContent.focus();
        } else {
            appendNode();
            contentLimit();
            iHover();
            iDelete();
        }

    }

    //添加节点
    function appendNode() {
        var newLi = document.createElement('li');
        newLi.className = 'clearfix';
        var date = new Date();
        var time = format(date.getMonth() + 1) + '月' + format(date.getDate()) + '日' + format(date.getHours()) + '：' + format(date.getMinutes()) + '：' + format(date.getSeconds());
        newLi.innerHTML = '<div class="upic"> <img src=' + get.byClassName('picked', get.byId('namebox'))[0].src +
            '> </div> <div class="user-content"> <p class="user">' + oName.value +
            '</p> <p class="ucontent">' + oContent.value +
            '</p> <p class="date">' + time + '</p> <a class="delete"> 删除 </a> </div>';
        aLis.length = 0 ? oUl.appendChild(newLi) : oUl.insertBefore(newLi, aLis[0]);
        len++;
        newLi.userNo = "user" + date.getTime();
        //判断是否可使用localStorage
        if (typeof (localStorage) == "undefined") {
            console.log("您的浏览器不支持localStorage");
        } else {
            var msgInfo = {
                src: get.byClassName('picked', get.byId('namebox'))[0].src,
                name: oName.value,
                content: oContent.value,
                time: time
            }
            localStorage.setItem(newLi.userNo, JSON.stringify(msgInfo));
            console.log(localStorage.getItem(newLi.userNo));
        }

        //使其淡入效果出现
        var alpha = 0;
        css.css(newLi, 'opacity', '0');
        clearInterval(timer);
        timer = setInterval(function () {
            if (alpha >= 100) {
                clearInterval(timer);
            } else {
                alpha += 10;
                newLi.style.opacity = alpha / 100;
            }
        }, 80); //变明显
        oName.value = '';
        oContent.value = '';
        oMain.style.height = oList.offsetTop + oList.offsetHeight + 10 + 'px';
    }

    //用于转换日期的方法
    function format(num) {
        return num.toString().replace(/^(\d)$/, '0$1');
    }

    //给发表内容添加字数限制
    EventUtil.addEvent(oContent, 'keyup', contentLimit);

    function contentLimit() {
        var iLen = oContent.value.length;
        oCount.innerHTML = count - iLen;
        if (count - iLen <= 0) {
            canSend = false;
            oCountBox.innerHTML = '已经超出了<span class="count" style="color: #ff4d4d">' + (iLen - count) + '</span>个字';
        } else {
            canSend = true;
        }
    }


    //栏目添加鼠标滑过效果
    function iHover() {
        for (var i = 0; i < aLis.length; i++) {
            aLis[i].index = i;
            EventUtil.addEvent(aLis[i], 'mouseover', function () {
                css.css(this, 'background', '#fffef3');
                aDelete[this.index].style.display = 'block';
            })
            EventUtil.addEvent(aLis[i], 'mouseout', function () {
                css.css(this, 'background', 'white');
                aDelete[this.index].style.display = 'none';
            })
        }
    }

    //删除操作
    function iDelete() {
        var aA = get.byClassName('delete', oUl);
        for (var i = 0; i < aA.length; i++) {
            aA[i].onclick = function () {
                var oParent = this.parentNode.parentNode; //找到Li节点
                //使其淡入效果出现
                var alpha = 100;
                css.css(oParent, 'opacity', '1');
                clearInterval(timer);
                timer = setInterval(function () {
                    if (alpha <= 0) {
                        clearInterval(timer);
                    } else {
                        alpha -= 10;
                        oParent.style.opacity = alpha / 100;
                    }
                }, 80);
                oUl.removeChild(oParent);
                //判断是否可使用localStorage
                if (typeof (localStorage) == "undefined") {
                    console.log("您的浏览器不支持localStorage");
                } else {
                    localStorage.removeItem(oParent.userNo);
                }
                iHover();
                oMain.style.height = oList.offsetTop + oList.offsetHeight + 10 + 'px';
            }
        }
    }

}