var b1 = document.querySelector('#b1')
var b2 = document.querySelector('#b2')
var b3 = document.querySelector('#b3')
var b4 = document.querySelector('#b4')
var b5 = document.querySelector('#b5')
var element = document.querySelector('#target');

b1.addEventListener('click', function (e) {
    console.log('innerHeight:' + window.innerHeight + " " + window.innerWidth);
    console.log("outerHeight:" + window.outerHeight + " " + window.outerWidth);
    console.log("pageXOffset:" + window.pageXOffset + " " + window.pageYOffset);
    console.log("screenX :" + window.screenX + " " + window.screenY);

}, false);

b2.addEventListener('click', function (e) {
    console.log('height:' + screen.height + " " + screen.width);
    console.log("availHeight:" + screen.availHeight + " " + screen.availWidth);
}, false);

b3.addEventListener('click', function (e) {
    var el=document.elementFromPoint(10,70);
    el.style.color='red';
}, false);

b4.addEventListener('click', function (e) {
    var rect=this.getBoundingClientRect();
    console.log('left:'+rect.left+' right:'+rect.right+' top:'+rect.top+' bottom:'+rect.bottom+' width:'+rect.width+' height:'+rect.height);
}, false);

b5.addEventListener('click', function (e) {
    console.log('clientLeft:'+element.clientLeft+' clientTop:'+element.clientTop);
    console.log('clientWidth:'+element.clientWidth+' clientHeight:'+element.clientHeight);

    console.log('offsetLeft:'+element.offsetLeft+' offsetTop:'+element.offsetTop);
    console.log('offsetWidth:'+element.offsetWidth+' offsetHeight:'+element.offsetHeight);
}, false);




element.addEventListener('mousedown', start, false);

// 声明2个变量用来保存鼠标初始位置的x，y坐标
var startX = 0;
var startY = 0;

// 声明2个变量用来保存目标元素初始位置的x，y坐标
var sourceX = 0;
var sourceY = 0;


function start(event) {
    // 获取鼠标初始位置
    startX = event.pageX;
    startY = event.pageY;

    // 获取元素初始位置
    var pos = getElementPos(element);

    sourceX = pos.x;
    sourceY = pos.y;

    element.addEventListener('mousemove', move);
    element.addEventListener('mouseup', end);
}

function move(event) {
    // 获取鼠标当前位置
    var currentX = event.pageX;
    var currentY = event.pageY;

    // 计算差值
    var distanceX = currentX - startX;
    var distanceY = currentY - startY;

    // 计算并设置元素当前位置
    setElementPos(element, {
        x: (sourceX + distanceX).toFixed(),
        y: (sourceY + distanceY).toFixed()
    })
}

function end(event) {
    element.removeEventListener('mousemove', move);
    element.removeEventListener('mouseup', end);
}

//实用方法：
function getTransform() {
    var transform = '',
        transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
        divStyle = document.createElement('div').style,
        len = transformArr.length;
    for (var i = 0; i < len; i++) {
        if (transformArr[i] in divStyle) {
            return transform = transformArr[i];
        }
    }

    return transform
}

function getElementStyle(ele, propoty) {
    return window.getComputedStyle ? window.getComputedStyle(ele, false)[propoty] : ele.currentStyle[property];
}

function getElementRect(ele) {
    return ele.getBoundingClientRect();
}

function getElementPos(ele) {
    var pos = { x: 0, y: 0 };

    var rect = getElementRect(ele);
    var x = rect.top;
    var y = rect.left;
    return { x: x, y: y };
}

function setElementPos(ele, pos) {
    var transformMethod = getTransform();
    if (transformMethod) {
        ele.style[transformMethod] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
    } else {
        ele.style.left = pos.x + 'px';
        ele.style.top = pos.y + 'px';
    }
}



// var oElem = document.getElementById('target');

// var startX = 0;
// var startY = 0;

// var sourceX = 0;
// var sourceY = 0;

// oElem.addEventListener('mousedown', start, false);

// function start(event) {
//     startX = event.pageX;
//     startY = event.pageY;

//     var pos = getTargetPos(oElem);

//     sourceX = pos.x;
//     sourceY = pos.y;

//     document.addEventListener('mousemove', move, false);
//     document.addEventListener('mouseup', end, false);
// }

// function move(event) {
//     var currentX = event.pageX;
//     var currentY = event.pageY;

//     var distanceX = currentX - startX;
//     var distanceY = currentY - startY;

//     setTargetPos(oElem, {
//         x: (sourceX + distanceX).toFixed(),
//         y: (sourceY + distanceY).toFixed()
//     })
// }

// function end(event) {
//     document.removeEventListener('mousemove', move);
//     document.removeEventListener('mouseup', end);
//     // do other things
// }


// function getStyle(elem, property) {
//     // 低版本ie通过currentStyle来获取元素的样式，其他浏览器通过getComputedStyle来获取
//     return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(elem, false)[property] : elem.currentStyle[property];
// }

// function getTransform() {
//     var transform = '',
//         divStyle = document.createElement('div').style,
//         transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],

//         i = 0,
//         len = transformArr.length;

//     for(; i < len; i++)  {
//         if(transformArr[i] in divStyle) {
//             return transform = transformArr[i];
//         }
//     }

//     return transform;
// }


// function getTargetPos(elem) {
//     var pos = {x: 0, y: 0};
//     var transform = getTransform();
//     // transform = false;
//     if(transform) {
//         var transformValue = getStyle(elem, transform);
//         if(transformValue == 'none') {
//             elem.style[transform] = 'translate(0, 0)';
//             return pos;
//         } else {
//             var temp = transformValue.match(/[0-9,\s\.]+/)[0].split(',');
//             return pos = {
//                 x: parseInt(temp[4].trim()),
//                 y: parseInt(temp[5].trim())
//             }
//         }
//     } else {
//         if(getStyle(elem, 'position') == 'static') {
//             elem.style.position = 'relative';
//             return pos;
//         } else {
//             var x = parseInt(getStyle(elem, 'left') ? getStyle(elem, 'left') : 0);
//             var y = parseInt(getStyle(elem, 'top') ? getStyle(elem, 'top') : 0);
//             return pos = {
//                 x: x,
//                 y: y
//             }
//         }
//     }
// }

// // pos = { x: 200, y: 100 }
// function setTargetPos(elem, pos) {
//     var transform = getTransform();
//     if(transform) {
//         elem.style[transform] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
//     } else {
//         elem.style.left = pos.x + 'px';
//         elem.style.top = pos.y + 'px';
//     }
//     return elem;
// }
