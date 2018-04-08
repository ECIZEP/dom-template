import MVVM from './observer/index';
import {
    VNode,
    diff,
    patch
} from './v-dom/index';

let vm = new MVVM({
    data: {
        title: 'AGE',
        title2: 'hah',
    },
    template: document.getElementById('container').innerHTML
});

vm.$mount(document.getElementById('app'));
console.log(vm._render);
console.log(vm._vnode);
console.log(vm);
setTimeout(() => {
    vm.title = 'sdfas';
}, 2000);
