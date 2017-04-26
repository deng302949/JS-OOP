/**
 * 框架模块定义与加载
 */
(function () {
    var moduleMap = {};

    var thin = {
        define: function (name, dependencies, factory) {
            if (!moduleMap[name]) {
                var module = {
                    name: name,
                    dependencies: dependencies,
                    factory: factory
                };

                moduleMap[name] = module;
            }

            return moduleMap[name];
        },

        use: function (name) {
            var module = moduleMap[name];

            if (!module.entity) {
                var args = [];//dependence's name
                for (var i = 0; i < module.dependencies.length; i++) {
                    if (moduleMap[module.dependencies[i]].entity) {
                        args.push(moduleMap[module.dependencies[i]].entity);
                    }
                    else {
                        args.push(this.use(module.dependencies[i]));
                    }
                }

                module.entity = module.factory.apply(null, args);
            }

            return module.entity;
        }
    };

    window.thin = thin;
})();



thin.define("constant.PI", [], function () {
    return 3.14159;
});

thin.define("shape.Circle", ["constant.PI"], function (pi) {
    var Circle = function (r) {
        this.r = r;
    };

    Circle.prototype = {
        area: function () {
            return pi * this.r * this.r;
        }
    }

    return Circle;
});

thin.define("shape.Rectangle", [], function () {
    var Rectangle = function (l, w) {
        this.l = l;
        this.w = w;
    };

    Rectangle.prototype = {
        area: function () {
            return this.l * this.w;
        }
    };

    return Rectangle;
});

thin.define("ShapeTypes", ["shape.Circle", "shape.Rectangle"], function (Circle, Rectangle) {
    return {
        CIRCLE: Circle,
        RECTANGLE: Rectangle
    };
});

thin.define("ShapeFactory", ["ShapeTypes"], function (ShapeTypes) {
    return {
        getShape: function (type) {
            var shape;

            switch (type) {
                case "CIRCLE":
                    {
                        shape = new ShapeTypes[type](arguments[1]);
                        break;
                    }
                case "RECTANGLE":
                    {
                        shape = new ShapeTypes[type](arguments[1], arguments[2]);
                        break;
                    }
            }

            return shape;
        }
    };
});


// var Circle = thin.use("shape.Circle");
var ShapeFactory = thin.use("ShapeFactory");
// alert(ShapeFactory.getShape("CIRCLE", 5).area());
// alert(ShapeFactory.getShape("RECTANGLE", 3, 4).area());

/**
 * DOM数据绑定
 */
thin.define('Person', [], function () {
    function Person() {
        this.name = 'Tom';
        this.age = 25
    }

    Person.prototype.groupUp = function () {
        this.age++;
    }

    return Person;
})


function parseElement(element, vm) {
    var model = vm;

    if (element.getAttribute('vm-model')) {
        model = bindModel(element.getAttribute('vm-model'));
    }

    for (var i = 0; i < element.attributes.length; i++) {
        parseAttribute(element, element.attributes[i], model);
    }

    for (var i = 0; i < element.children.length; i++) {
        parseElement(element.children[i], model);
    }
}

function bindModel(modelName) {
    thin.log('model:' + modelName);

    var model = thin.use(modelName, true);
    var instance = new model();

    return instance;
}

function parseAttribute(element, attr, model) {
    if (attr.name.indexOf('vm-') === 0) {
        var type = attr.name.slice(3);

        switch (type) {
            case 'init':
                bindInti(element, attr.value, model);
                break;
            case 'vaule':
                bindValue(element, attr.value, model);
                break;
            case "click":
                bindClick(element, attr.value, model);
                break;
            case "enable":
                bindEnable(element, attr.value, model, true);
                break;
            case "disable":
                bindEnable(element, attr.value, model, false);
                break;
            case "visible":
                bindVisible(element, attr.value, model, true);
                break;
            case "invisible":
                bindVisible(element, attr.value, model, false);
                break;
            case "element":
                model[attr.value] = element;
                break;
        }
    }
}

function bindValue(element, key, vm) {
    thin.log('binding value:' + key);

    vm.$watch(key, function (value, oldValue) {
        element.value = value || '';
    })

    element.onkeyup = function () {
        vm[key] = element.value;
    }

    element.onpaste = function () {
        vm[key] = element.value;
    }
}