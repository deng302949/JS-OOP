/**
 * 无对象编程实现拖拽
 */






var oElem = document.getElementById('target');

var startX = 0;
var startY = 0;

var sourceX = 0;
var sourceY = 0;

oElem.addEventListener('mousedown', start, false);

function start(event) {
    startX = event.pageX;
    startY = event.pageY;

    var pos = getTargetPos(oElem);

    sourceX = pos.x;
    sourceY = pos.y;

    document.addEventListener('mousemove', move, false);
    document.addEventListener('mouseup', end, false);
}

function move(event) {
    var currentX = event.pageX;
    var currentY = event.pageY;

    var distanceX = currentX - startX;
    var distanceY = currentY - startY;

    setTargetPos(oElem, {
        x: (sourceX + distanceX).toFixed(),
        y: (sourceY + distanceY).toFixed()
    })
}

function end(event) {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', end);
    // do other things
}


function getStyle(elem, property) {
    // 低版本ie通过currentStyle来获取元素的样式，其他浏览器通过getComputedStyle来获取
    return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(elem, false)[property] : elem.currentStyle[property];
}

function getTransform() {
    var transform = '',
        divStyle = document.createElement('div').style,
        transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],

        i = 0,
        len = transformArr.length;

    for (; i < len; i++) {
        if (transformArr[i] in divStyle) {
            return transform = transformArr[i];
        }
    }

    return transform;
}


function getTargetPos(elem) {
    var pos = { x: 0, y: 0 };
    var transform = getTransform();
    // transform = false;
    if (transform) {
        var transformValue = getStyle(elem, transform);
        if (transformValue == 'none') {
            elem.style[transform] = 'translate(0, 0)';
            return pos;
        } else {
            var temp = transformValue.match(/[0-9,\s\.]+/)[0].split(',');
            return pos = {
                x: parseInt(temp[4].trim()),
                y: parseInt(temp[5].trim())
            }
        }
    } else {
        if (getStyle(elem, 'position') == 'static') {
            elem.style.position = 'relative';
            return pos;
        } else {
            var x = parseInt(getStyle(elem, 'left') ? getStyle(elem, 'left') : 0);
            var y = parseInt(getStyle(elem, 'top') ? getStyle(elem, 'top') : 0);
            return pos = {
                x: x,
                y: y
            }
        }
    }
}

// pos = { x: 200, y: 100 }
function setTargetPos(elem, pos) {
    var transform = getTransform();
    if (transform) {
        elem.style[transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
    } else {
        elem.style.left = pos.x + 'px';
        elem.style.top = pos.y + 'px';
    }
    return elem;
}

/**
 * 对象编程实现拖拽
 */
;
(function () {
    // 这是一个私有属性，不需要被实例访问
    var transform = getTransform();

    function Drag(selector) {
        // 放在构造函数中的属性，都是属于每一个实例单独拥有
        this.elem = typeof selector == 'Object' ? selector : document.getElementById(selector);
        this.startX = 0;
        this.startY = 0;
        this.sourceX = 0;
        this.sourceY = 0;

        this.init();
    }


    // 原型
    Drag.prototype = {
        constructor: Drag,

        init: function () {
            // 初始时需要做些什么事情
            this.setDrag();
        },

        // 稍作改造，仅用于获取当前元素的属性，类似于getName
        getStyle: function (property) {
            return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(this.elem, false)[property] : this.elem.currentStyle[property];
        },

        // 用来获取当前元素的位置信息，注意与之前的不同之处
        getPosition: function () {
            var pos = { x: 0, y: 0 };
            if (transform) {
                var transformValue = this.getStyle(transform);
                if (transformValue == 'none') {
                    this.elem.style[transform] = 'translate(0, 0)';
                } else {
                    var temp = transformValue.match(/-?\d+/g);
                    pos = {
                        x: parseInt(temp[4].trim()),
                        y: parseInt(temp[5].trim())
                    }
                }
            } else {
                if (this.getStyle('position') == 'static') {
                    this.elem.style.position = 'relative';
                } else {
                    pos = {
                        x: parseInt(this.getStyle('left') ? this.getStyle('left') : 0),
                        y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0)
                    }
                }
            }

            return pos;
        },

        // 用来设置当前元素的位置
        setPostion: function (pos) {
            if (transform) {
                this.elem.style[transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
            } else {
                this.elem.style.left = pos.x + 'px';
                this.elem.style.top = pos.y + 'px';
            }
        },

        // 该方法用来绑定事件
        setDrag: function () {
            var self = this;
            this.elem.addEventListener('mousedown', start, false);
            function start(event) {
                self.startX = event.pageX;
                self.startY = event.pageY;

                var pos = self.getPosition();

                self.sourceX = pos.x;
                self.sourceY = pos.y;

                document.addEventListener('mousemove', move, false);
                document.addEventListener('mouseup', end, false);
            }

            function move(event) {
                var currentX = event.pageX;
                var currentY = event.pageY;

                var distanceX = currentX - self.startX;
                var distanceY = currentY - self.startY;

                self.setPostion({
                    x: (self.sourceX + distanceX).toFixed(),
                    y: (self.sourceY + distanceY).toFixed()
                })
            }

            function end(event) {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
                // do other things
            }
        }
    }

    // 私有方法，仅仅用来获取transform的兼容写法
    function getTransform() {
        var transform = '',
            divStyle = document.createElement('div').style,
            transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],

            i = 0,
            len = transformArr.length;

        for (; i < len; i++) {
            if (transformArr[i] in divStyle) {
                return transform = transformArr[i];
            }
        }

        return transform;
    }

    // 一种对外暴露的方式
    window.Drag = Drag;
})();

// 使用：声明2个拖拽实例
new Drag('target');
new Drag('target2');