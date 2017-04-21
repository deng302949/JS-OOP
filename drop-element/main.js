var list = document.querySelector('.list');
list.addEventListener('click', function (e) {
    console.log('clientX:' + event.clientX + " " + event.clientY);
    console.log("pageX:" + event.pageX + " " + event.pageY);
    console.log('screenX:' + event.screenX + " " + event.screenY);

    var target = e.target;

    if (target && target.nodeName.toUpperCase() == 'LI') {
        console.log(target.innerHTML);
    }
}, false);


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
    var el = document.elementFromPoint(10, 70);
    el.style.color = 'red';
}, false);

b4.addEventListener('click', function (e) {
    var rect = this.getBoundingClientRect();
    console.log('left:' + rect.left + ' right:' + rect.right + ' top:' + rect.top + ' bottom:' + rect.bottom + ' width:' + rect.width + ' height:' + rect.height);
}, false);

b5.addEventListener('click', function (e) {
    console.log('clientLeft:' + element.clientLeft + ' clientTop:' + element.clientTop);
    console.log('clientWidth:' + element.clientWidth + ' clientHeight:' + element.clientHeight);

    console.log('offsetLeft:' + element.offsetLeft + ' offsetTop:' + element.offsetTop);
    console.log('offsetWidth:' + element.offsetWidth + ' offsetHeight:' + element.offsetHeight);
}, false);




// element.addEventListener('mousedown', start, false);


// // 声明2个变量用来保存鼠标初始位置的x，y坐标
// var startX = 0;
// var startY = 0;

// // 声明2个变量用来保存目标元素初始位置的x，y坐标
// var sourceX = 0;
// var sourceY = 0;


// function start(event) {
//     console.log('start');
//     // 获取鼠标初始位置
//     startX = event.pageX;
//     startY = event.pageY;

//     // 获取元素初始位置
//     var pos = getElementPos(element);

//     sourceX = pos.x;
//     sourceY = pos.y;

//     element.addEventListener('mousemove', move);
//     element.addEventListener('mouseup', end);
// }

// function move(event) {
//     // 获取鼠标当前位置
//     var currentX = event.pageX;
//     var currentY = event.pageY;

//     // 计算差值
//     var distanceX = currentX - startX;
//     var distanceY = currentY - startY;

//     console.log('move');
//     // 计算并设置元素当前位置
//     setElementPos(element, {
//         x: (sourceX + distanceX).toFixed(),
//         y: (sourceY + distanceY).toFixed()
//     })
// }

// function end(event) {
//     console.log('end');
//     element.removeEventListener('mousemove', move);
//     element.removeEventListener('mouseup', end);
// }

// //实用方法：
// function getTransform() {
//     var transform = '',
//         transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
//         divStyle = document.createElement('div').style,
//         len = transformArr.length;
//     for (var i = 0; i < len; i++) {
//         if (transformArr[i] in divStyle) {
//             return transform = transformArr[i];
//         }
//     }

//     return transform
// }

// function getElementStyle(ele, propoty) {
//     return window.getComputedStyle ? window.getComputedStyle(ele, false)[propoty] : ele.currentStyle[property];
// }

// function getElementRect(ele) {
//     return ele.getBoundingClientRect();
// }

// function getElementPos(ele) {
//     var pos = { x: 0, y: 0 };

//     var rect = getElementRect(ele);
//     var x = rect.left;
//     var y = rect.top;
//     return { x: x, y: y };
// }

// function setElementPos(ele, pos) {
//     var transformMethod = getTransform();
//     if (transformMethod) {
//         ele.style[transformMethod] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
//     } else {
//         ele.style.left = pos.x + 'px';
//         ele.style.top = pos.y + 'px';
//     }
//     console.log(getElementPos(element).x, getElementPos(element).y);
// }


//OOP对象实现拖拽
(function () {
    // 这是一个不需要被实例访问的属性局部变量。
    var transform = getTransform();

    function Drop(id, ops) {
        this.element = document.querySelector('#' + id);

        this.startX = 0;
        this.startY = 0;

        this.init();
    }

    Drop.prototype = {
        constructor: Drop,

        init: function () {
            this.setDrop();
        },

        setDrop: function () {
            var self = this;

            this.element.addEventListener('mousedown', function (e) {
                self.start(e, self);
            }, false);
        },

        getStyleValue: function (style) {
            return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(this.element, false)[style] : this.element.currentStyle[style];
        },
        getElementPos: function () {
            var pos = { x: 0, y: 0 };

            if (transform) {
                var transformValue = this.getStyleValue(transform);
                if (transformValue == 'none') {
                    this.element.style[transform] = 'translate(0,0)';
                } else {
                    var temp = transformValue.match(/-?\d+/g);
                    pos = {
                        x: parseInt(temp[4].trim()),
                        y: parseInt(temp[5].trim())
                    }
                }
            } else {
                if (this.getStyleValue('position') == 'static') {
                    this.element.style.position = 'relative';
                } else {
                    pos = {
                        x: parseInt(this.getStyleValue('left') ? this.getStyleValue('left') : 0),
                        y: parseInt(this.getStyleValue('top') ? this.getStyleValue('top') : 0)
                    }
                }
            }

            return pos;
        },

        setElementPos: function (pos) {
            if (transform) {
                this.element.style[transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
            } else {
                this.element.style.left = pos.x + 'px';
                this.element.style.top = pos.y + 'px';
            }
        },

        start: function (event, self) {
            var startPos = self.getElementPos();
            self.startX = startPos.x;
            self.startY = startPos.y;
            console.log(self.startX, self.startY);
            var clickPos = {
                x: event.pageX,
                y: event.pageY
            }
            var move = function (e) {
                self.move(e, clickPos, self);
            };
            var end = function (e) {
                self.end(e, self,move,end);
            };
            // self.element.addEventListener('mousemove', function (e) {
            //     self.move(e, clickPos, self);
            // });
            // self.element.addEventListener('mouseup', function (e) {
            //     self.end(e, self);
            // });

            self.element.addEventListener('mousemove',move);
            self.element.addEventListener('mouseup',end);
        },

        move: function (event, pos, self) {
            var currentX = event.pageX;
            var currentY = event.pageY;

            var distanceX = currentX - pos.x;
            var distanceY = currentY - pos.y;
            self.setElementPos({
                x: (self.startX + distanceX).toFixed(),
                y: (self.startY + distanceY).toFixed()
            });
        },

        end: function (event, self,move,end) {
            self.element.removeEventListener('mousemove', move);
            self.element.removeEventListener('mouseup', end);
        }

    }



    function getTransform() {
        var transform = '',
            transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
            divStyle = document.createElement('div').style;

        transform = transformArr.filter(function (v) {
            return v in divStyle;
        })[0];

        return transform;
    }

    window.Drop = Drop;
})();

var t1 = new Drop('target');
var t2 = new Drop('target2');