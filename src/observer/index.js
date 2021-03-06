import Watcher from './watcher'
import observer from './observer'
import {
    genRenderFunc
} from '../parser/render';
import {
    VNode,
    diff,
    patch
} from '../v-dom/index'

export default function MVVM (options) {
    this.$options = options;
    if (options.template) {
        this._render = genRenderFunc(options.template);
    } else if (options.render) {
        this._render = options.render;
    }
    this._data = this.$options.data;
    var self = this;
    // 数据代理 vm._data => vm.data 方便访问
    Object.keys(this.$options.data).forEach(key => {
        this._proxy(key);
    });
    observer(this._data);
}

MVVM.prototype = {
    $watch (expression, callback) {
        new Watcher(this, expression, callback);
    },

    _proxy (key) {
        let self = this;
        Object.defineProperty(this, key, {
            configurable: false,
            enumerable: true,
            get() {
                return self._data[key];
            },
            set(value) {
                self._data[key] = value;
            }
        });
    },
    _update (VNodes) {
        console.log('旧节点树:', this._vnode);
        console.log('新节点树:', VNodes);
        let patches = diff(VNodes, this._vnode);
        console.log('更新步骤', patches);
        patch(this.el.childNodes[0], patches);
        this._vnode = VNodes;
    },
    $mount (el) {
        this.el = el;
        if (el.childNodes.length === 0) {
            let emptyNode = document.createTextNode('');
            el.appendChild(emptyNode);
            new Watcher(this, () => {
                this._update(this._render());
            }, () => {
                this._update(this._render());
            })
        }
    }
}

MVVM.prototype._createVNode = function (tagName, props, children) {
    return new VNode(tagName, props, children);
}
MVVM.prototype._createTextVNode = function (text) {
    // 生成文本VNode
    return text.toString();
};

MVVM.prototype._toString = function (text) {
    return text.toString();
}

MVVM.prototype._listFor = function (array, renderFunc) {
    let VNodes = [];
    for (let item of array) {
        let VNode = renderFunc.call(this, item);
        VNodes.push(VNode);
    }
    return VNodes;
}