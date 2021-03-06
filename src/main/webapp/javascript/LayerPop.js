var wrapWindowByMask = function () {
    //  윈도우(머리객체) 의 크기에 맞춰서 mask 를 적용
    document.getElementById("mask").style.width = `${window.innerWidth}px`;
    document.getElementById("mask").style.height = `${window.innerHeight}px`;

    //  나타나게 하는 함수!
    fadeIn("mask");
}

var popupOpen = function () {
    const layerbox = document.getElementById("layerbox");
    //  495, 774 는 layer 팝업창의 크기
    layerbox.style.top = `${(window.innerHeight - 495) / 2 + window.scrollY}px`;
    layerbox.style.left = `${(window.innerWidth - 774) / 2 + window.scrollX}px`;
    layerbox.style.position = "absolute";
    layerbox.style.display = "block";

    makeDraggable("layerbox");
}

var popupClose = function () {
    document.getElementById("layerbox").style.display = "none";
    document.getElementById("mask").style.display = "none";
}

//  정의 현황 을 눌렀을 때 작동하는 함수
var goDetail = function () {
    popupOpen(); //레이어 팝업창 오픈
    wrapWindowByMask(); //화면 마스크 효과
}

var fadeIn = function (id) {
    const element = document.getElementById(id);
    element.style.opacity = 0;
    element.style.display = "block";
    (function fade() {
        var val = parseFloat(element.style.opacity);
        if (!((val += .1) > 1)) {
            element.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

var makeDraggable = function (id) {
    let object = document.getElementById(id), initX, initY, firstX, firstY;
    object.addEventListener('mousedown', function (e) {

        e.preventDefault();
        initX = this.offsetLeft;
        initY = this.offsetTop;
        firstX = e.pageX;
        firstY = e.pageY;

        this.addEventListener('mousemove', dragIt, false);

        window.addEventListener('mouseup', function () {
            object.removeEventListener('mousemove', dragIt, false);
        }, false);

    }, false);

    object.addEventListener('touchstart', function (event) {

        event.preventDefault();
        initX = this.offsetLeft;
        initY = this.offsetTop;
        var touch = event.touches;
        firstX = touch[0].pageX;
        firstY = touch[0].pageY;

        this.addEventListener('touchmove', swipeIt, false);

        window.addEventListener('touchend', function (e) {
            e.preventDefault();
            object.removeEventListener('touchmove', swipeIt, false);
        }, false);

    }, false);

    function dragIt(event) {
        this.style.left = initX + event.pageX - firstX + 'px';
        this.style.top = initY + event.pageY - firstY + 'px';
    }

    function swipeIt(event) {
        const contact = event.touches;
        this.style.left = initX + contact[0].pageX - firstX + 'px';
        this.style.top = initY + contact[0].pageY - firstY + 'px';
    }
}

//  정의 현황 + - 변하는 버튼 (Detail 활성화/비활성화)
var openCloseButton = function (id) {
    const display = document.getElementById(id).style.display;
    if (display == "none") {
        document.getElementById(id).style.display = "block";
        document.getElementById(`button${id}`).innerText = "-";
    } else if (display == "block") {
        document.getElementById(id).style.display = "none";
        document.getElementById(`button${id}`).innerText = "+";
    }
    if (event.ctrlKey) {
        const rowCount = document.getElementById("etlGroupDefine").rows.length / 2;
        for (let i = 0; i < rowCount; i++) {
            if (`detail${i}` != id) {
                document.getElementById(`detail${i}`).style.display = "none";
                document.getElementById(`buttondetail${i}`).innerText = "+";
            }
        }
    }
}