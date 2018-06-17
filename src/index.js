import MVVM from './observer/index';

let vm = new MVVM({
    data: {
        title: 'Virtual DOM 测试（旧视图）',
        array: ['苹果', '西瓜', '香蕉'],
        tableArray: [{
            name: 'AAAA',
            age: 12,
            reputation: 200
        }, {
            name: 'DDDD',
            age: 33,
            reputation: 3000
        }, {
            name: 'CCCC',
            age: 21,
            reputation: 99
        }, {
            name: 'BBBB',
            age: 20,
            reputation: 20
        }, {
            name: 'FFFF',
            age: 49,
            reputation: 521
        }]
    },
    template: document.getElementById('container').innerHTML
});

vm.$mount(document.getElementById('app'));
console.log(vm._render);
window.vm = vm;
setTimeout(() => {
    vm.title = 'sdfas';
    
}, 2000);
