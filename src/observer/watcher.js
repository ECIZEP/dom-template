import Dep from './dep'

function Watcher (vm, expOrFn, callback) {
    this.callback = callback;
    this.vm = vm;
    this.callback = callback;
    // watcher监听的属性的Id
    this.depIds = {};
    if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
    } else {
        this.expression = expOrFn;
        this.getter = this.getVMVal;
    }
    // 把值备份下，以便缓冲变化
    this.oldValue = this.get();
}

Watcher.prototype = {
    update () {
        this.callback();
    },

    addDep (dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            // 添加订阅者
            dep.addSub(this);
            // 该属性的依赖列表
            this.depIds[dep.id] = dep;
        }
    },

    get () {
        Dep.target = this;
        // 求值的过程会触发监听数据的getter, 为了使之访问到watch
        let value = this.getter();
        // 访问完了，置空
        Dep.target = null;
        return value;
    },

    getVMVal () {
        let expression = this.expression.split('.');
        let value = this.vm;
        expression.forEach(function (curVal) {
            // 这里取值的过程，会调用到每一个数据的get，根据getter里面的闭包
            // 从而访问到数据的dep,调用dep.depend
            // 属性dep.depend, 进一步调用到Watch的addDep，让watcher添加进去
            value = value[curVal];
        });
        return value;
    }
}

export default Watcher;