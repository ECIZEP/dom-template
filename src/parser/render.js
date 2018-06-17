import htmlparser from 'htmlparser';
import { S_IFIFO } from 'constants';

function isnot (element) {
    return element.data.trim() !== '';
}

let isFor = false;
let forVariables = [];

function clean (AST) {
    AST = AST.filter(isnot);
    AST.forEach((element, index, array) => {
        if (element.type === 'tag'){
            if (element.children instanceof Array) {
                element.children = clean(element.children);    
            }
        }
    });
    return AST;
}


function genText (data) {
    let str = '_v(';
    let startIndex = 0;
    let reg = /\{\{(.*?)\}\}/g;
    let result = null;
    while ((result = reg.exec(data)) !== null) {
        str += '"' + data.slice(startIndex, result.index) + '" + ';
        // 对于for循环
        if (isFor && forVariables.some((element) => element === result[1].split('.')[0])) {
            str += '_s(' + result[1] + ') + ';
        } else {
            str += '_s(_vm.' + result[1] + ') + ';
        }
        startIndex = result.index + result[0].length;
    }
    str += '"' + data.slice(startIndex) + '")';
    return str;
}

let body = `  var _vm = this;
  _c = _vm._createVNode;
  _s = _vm._toString;
  _v = _vm._createTextVNode;
  _l = _vm._listFor;
  return _c("div", [
    `;

function renderGen (AST, tabs) {
    AST.forEach((element, index, array) => {
        if (index !== 0) {
            // 不是第一个就换行
            body += ',\n' + tabs;
        }
        if (element.type === 'text') {
            body += genText(element.data);
        } else if (element.type === 'tag') {
            if (processFor(element, tabs)) {
                return ;
            }
            if (element.attribs) {
                body += '_c("'+ element.name +'", ' + JSON.stringify(element.attribs);
            } else {
                body += '_c("'+ element.name +'"';
            }
            if (element.children) {
                body += ', [\n' + tabs + '  ';
                renderGen(element.children, tabs + '  ');
                body += '\n' + tabs + '])';
            } else {
                body += ')';
            }
        }
    });
}

let forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
function processFor (element, tabs) {
    for (let prop in element.attribs) {
        /* if (element.name === 'li') {
            console.log(element);
            for (let test in element.attribs) {
                console.log(test);
            }
        } */
        if (prop === 'v-for') {
            // 获取for 参数名称
            isFor = true;
            let result = forAliasRE.exec(element.attribs[prop]);
            delete element.attribs[prop];
            forVariables.push(result[1]);
            body += '_l(_vm.' + result[2] + ', function (' + result[1] + ') {'
                + '\n' + tabs + '  return ';
            if (element.attribs) {
                body += '_c("'+ element.name +'", ' + JSON.stringify(element.attribs);
            } else {
                body += '_c("'+ element.name +'"';
            }
            if (element.children) {
                body += ', [\n' + tabs + '     ';
                renderGen(element.children, tabs + '  ');
                body += '\n' + tabs + '  ])';
            } else {
                body += ')';
            }
            body += '\n' + tabs + '})';
            isFor = false;
            forVariables = [];
            return true;
        } else {
            return false;
        }
    }
}

export function genRenderFunc (template) {
    let handler = new htmlparser.DefaultHandler(function (error, dom) {
    });
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(template);
    let tabs = "    ";
    let AST = handler.dom;
    // optimize ast
    AST = clean(AST);
    console.log('AST语法树：', AST);
    renderGen(AST, tabs);
    body += '\n  ])';
    return new Function(body);
}