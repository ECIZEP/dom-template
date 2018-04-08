import Watcher from './watcher';

let uid = 0;

function Dep () {
    this.id = uid++;
    this.subs = [];
}

Dep.target = null;

Dep.prototype = {
    addSub (sub) {
        this.subs.push(sub);
    },

    removeSub (sub) {
        let index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },

    depend () {
        Dep.target.addDep(this);
    },

    notify () {
        // dep对应的数据有更新，然后通知订阅者watcher去更新视图
        this.subs.forEach(sub => sub.update());
    }
}

export default Dep;