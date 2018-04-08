import htmlparser from 'htmlparser';

function isnot (element) {
    return element.data.trim() !== '';
}

function clean (AST) {
    AST = AST.filter(isnot);
    AST.forEach((element, index, array) => {
        if (element.type === 'tag'){
            element.children = clean(element.children);
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
        str += '_s(_vm.' + result[1] + ') + ';
        startIndex = result.index + result[0].length;
    }
    str += '"' + data.slice(startIndex) + '")';
    return str;
}

let body = `  console.log(this);
  var _vm = this;
  _c = _vm._c;
  _s = _vm._s;
  _v = _vm._v;
  return _c("div", [
    `;

function renderGen (AST, tabs) {
    AST.forEach((element, index, array) => {
        if (index !== 0) {
            body += ',\n' + tabs;
        }
        if (element.type === 'text') {
            body += genText(element.data);
        } else if (element.type === 'tag') {
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

export function genRenderFunc (template) {
    let handler = new htmlparser.DefaultHandler(function (error, dom) {
    });
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(template);
    let tabs = "    ";
    let AST = handler.dom;
    // optimize ast
    AST = clean(AST);
    console.log(AST);
    renderGen(AST, tabs);
    body += '\n  ])';
    return new Function(body);
}