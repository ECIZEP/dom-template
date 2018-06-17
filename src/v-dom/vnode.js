
/**
 * 
 * @param {String} tagName 
 * @param {Object} props 
 * @param {Array} children 
 */
export default function VNode(tagName, props, children) {
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ? props.key : void 666;

    if (props instanceof Array) {
        this.children = props;
        this.props = {};
    }

    let count = 0;
    if (this.children) {
        let self = this;
        this.children.forEach((child, index) => {
            if (child instanceof Array) {
                this.children.splice(index, 1, ...child);
            }
        })
        this.children.forEach(function (child, index) {
            if (child instanceof VNode) {
                // 元素节点
                count += child.count;
            } else {
                self.children[index] = '' + child;
            }
            count++;
        });
    }
    this.count = count;

}


VNode.prototype.render = function () {
    let el = document.createElement(this.tagName),
        props = this.props;

    for (let propName in props) {
        let propValue = props[propName];
        el.setAttribute(propName, propValue);
    }

    let children = this.children;

    children.forEach(function (child) {
        let childEl;
        if (child instanceof Array) {
            child.forEach(function (deepChild) {
                if (deepChild instanceof VNode) {
                    childEl = deepChild.render();
                } else if (typeof deepChild === 'string') {
                    childEl = document.createTextNode(deepChild);
                } else {
                    throw Error('Type Error, must be VNode or string');
                }
                el.appendChild(childEl);
            })
        } else {
            if (child instanceof VNode) {
                childEl = child.render();
            } else if (typeof child === 'string') {
                childEl = document.createTextNode(child);
            } else {
                throw Error('Type Error, must be VNode or string');
            }
            el.appendChild(childEl);
        }
    });

    return el;
}