(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VDom"] = factory();
	else
		root["VDom"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "VNode", {
  enumerable: true,
  get: function get() {
    return _vnode.default;
  }
});
Object.defineProperty(exports, "diff", {
  enumerable: true,
  get: function get() {
    return _diff.default;
  }
});
Object.defineProperty(exports, "patch", {
  enumerable: true,
  get: function get() {
    return _patch.patch;
  }
});

var _vnode = _interopRequireDefault(__webpack_require__(3));

var _diff = _interopRequireDefault(__webpack_require__(4));

var _patch = __webpack_require__(6);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = VNode;

/**
 * 
 * @param {String} tagName 
 * @param {Object} props 
 * @param {Array} children 
 */
function VNode(tagName, props, children) {
  this.tagName = tagName;
  this.props = props || {};
  this.children = children || [];
  this.key = props ? props.key : void 666;

  if (props instanceof Array) {
    this.children = props;
    this.props = {};
  }

  var count = 0;

  if (this.children) {
    var self = this;
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
  var el = document.createElement(this.tagName),
      props = this.props;

  for (var propName in props) {
    var propValue = props[propName];
    el.setAttribute(propName, propValue);
  }

  var children = this.children;
  children.forEach(function (child) {
    var childEl = child instanceof VNode ? child.render() : document.createTextNode(child);
    el.appendChild(childEl);
  });
  return el;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = diff;

var _listDiff = __webpack_require__(5);

var _patch = __webpack_require__(6);

function diff(newTree, oldTree) {
  var index = 0;
  var patches = {};
  dfsWalk(newTree, oldTree, patches, index);
  return patches;
}
/**
 * 
 * @param {VNode} newNode 
 * @param {VNode} oldNode 
 * @param {Array} patches 
 * @param {Number} index 
 */


function dfsWalk(newNode, oldNode, patches, index) {
  var currentPatches = [];

  if (newNode === null) {// remove oldNode,do nothing
  } else if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      currentPatches.push({
        type: _patch.PATCH.TEXT,
        content: newNode
      });
    }
  } else if (newNode.tagName === oldNode.tagName && newNode.key === oldNode.key) {
    // 标签一样，并且key一致，比较属性值
    var propsPatches = diffProps(newNode, oldNode);
    propsPatches ? currentPatches.push({
      type: _patch.PATCH.PROPS,
      props: propsPatches
    }) : void 666; // 比较子元素，得到从old --> new 的步骤
    // 如果key都是 undefined，diffList无法优化重排

    var diffChildren = (0, _listDiff.diffList)(newNode.children, oldNode.children, "key"); // newChildren是对应oldNode.children序列的新元素，

    var newChildren = diffChildren.newChildren; // 子元素需要重新排序，把重排的步骤压入
    // key:undefined的情况，此处diffChildren.moves为空，按最坏的情况处理，递归进子节点一个一个修改Text

    diffChildren.moves.length > 0 ? currentPatches.push({
      type: _patch.PATCH.REORDER,
      moves: diffChildren.moves
    }) : void 666; // 深度优先递归

    var leftNode = null;
    var currentIndex = index;
    oldNode.children.forEach(function (child, i) {
      // 深度优先记录下标
      currentIndex = leftNode && leftNode.count ? currentIndex + leftNode.count + 1 : currentIndex + 1; // 这里只需要比newNode和oldNode共同拥有的子元素，old的删除，新的直接插
      // 共同有的child比较差异，避免大的DOM操作

      dfsWalk(newChildren[i], child, patches, currentIndex);
      leftNode = child;
    });
  } else {
    // different node replace
    currentPatches.push({
      type: _patch.PATCH.REPLACE,
      node: newNode
    });
  }

  currentPatches.length > 0 ? patches[index] = currentPatches : void 666;
}

function diffProps(newNode, oldNode) {
  var propsPatches = {},
      count = 0,
      newProps = newNode.props,
      oldProps = oldNode.props; // first find out the common but changed props

  for (var key in oldProps) {
    if (newProps[key] !== oldProps[key]) {
      count++;
      propsPatches[key] = newProps[key];
    }
  } // find out new props


  for (var _key in newProps) {
    if (!oldProps.hasOwnProperty(_key)) {
      count++;
      propsPatches[_key] = newProps[_key];
    }
  }

  if (count === 0) {
    return null;
  }

  return propsPatches;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* O(N)的复杂度解决同一层级上子元素的重排问题
* var oldList = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }, { id: "e" }];
* var newList = [{ id: "b" }, { id: "a" }, { id: "b" }, { id: "e" }, { id: "f" }];
* 使用插入或者删除，从oldList到newList的变换，尽量复用原有元素
* 不是最优的方法，最优复杂度太高了，对于DOM操作O(N)的这个算法已经OK
// moves: [ 
//   {index: 3, type: 0}, 
//   {index: 0, type: 1, item: {id: "c"}},  
//   {index: 0, type: 0},  
//   {index: 4, type: 1, item: {id: "f"}} 
//  ] 
*/

/**
 * 
 * @param {Array} newList 
 * @param {Array} oldList 
 * @param {Object} key, must be offered ,otherwise it goes wrong
 */
function diffList(newList, oldList, key) {
  var newListMap = makeKeyIndexAndFree(newList, key),
      oldListMap = makeKeyIndexAndFree(oldList, key),
      newFree = newListMap.free,
      oldKeyIndex = oldListMap.keyIndex,
      newKeyIndex = newListMap.keyIndex,
      i = 0,
      freeIndex = 0,
      // 根据oldList的序号，找到newList中key对应的新的节点
  newChildren = [],
      // 记录操作的对象数组，type-0为删除 1位插入
  moves = []; // 第一步：使用newChildren过滤一遍oldList，把要newList中不存在的节点干掉

  while (i < oldList.length) {
    var item = oldList[i];
    var itemKey = getKeyValue(item, key);

    if (itemKey) {
      if (newKeyIndex.hasOwnProperty(itemKey)) {
        // 新的list里面有这个元素,把最新的push进去
        var newItemIndex = newKeyIndex[itemKey];
        newChildren.push(newList[newItemIndex]);
      } else {
        // 没有的就是要删除的，push 空，占个位置
        newChildren.push(null);
      }
    } else {
      var freeItem = newFree[freeIndex++];
      newChildren.push(freeItem || null);
    }

    i++;
  } // 第二步，前面过滤的节点，将之删除的操作push进moves数组记录


  i = 0;
  var simulateList = newChildren.slice();

  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i);
      simulateList.splice(i, 1);
    } else {
      i++;
    }
  } // 第三步，找出需要插入的元素
  // 遍历一遍newList，同时对比simulate，按序


  i = 0;
  var j = 0;

  while (i < newList.length) {
    var _item = newList[i];

    var _itemKey = getKeyValue(_item, key);

    var simulateItem = simulateList[j];
    var simulateItemKey = getKeyValue(simulateItem, key);

    if (simulateItem) {
      if (simulateItemKey === _itemKey) {
        // 位置和元素都没有变化，不用动
        // key 为undefined时，直接j++ i++,move为空，不操作
        j++;
      } else {
        if (!oldKeyIndex.hasOwnProperty(_itemKey)) {
          // 这是一个不可复用的新元素,patch时render一个新元素
          insert(i, _item);
        } else {
          // 乱序的旧元素，算法对于这种情况的处理没有用到动规的思想，所以最后的结果不是最好的情况
          var nextSimulateKey = getKeyValue(simulateList[j + 1], key);

          if (nextSimulateKey === _itemKey) {
            // 简单的判断下，simulate下一个节点和我一样
            // 思考下，这里为什么是i
            remove(i);
            simulateList.splice(j++, 1);
          } else {
            // 这种情况插入，不过会在patch时复用
            insert(i, _item);
          }
        }
      }
    } else {
      // 什么样的情况代码会跑到这里？
      insert(i, _item);
    }

    i++;
  }

  function remove(i) {
    moves.push({
      type: "remove",
      index: i
    });
  }

  function insert(i, item) {
    moves.push({
      type: "insert",
      index: i,
      item: item
    });
  }

  return {
    moves: moves,
    newChildren: newChildren
  };
}
/**
 * 取出对象的元素key所对应的下标
 * 没有下标的放入free中
 * @param {Array} list 
 * @param {String} key 
 */


function makeKeyIndexAndFree(list, key) {
  var keyIndex = {};
  var free = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var itemKey = getKeyValue(item, key);

    if (itemKey) {
      // key索引对应值存在，将这个值当做keyIndex的索引，值为i
      keyIndex[itemKey] = i;
    } else {
      // key索引没有，放入free中
      free.push(item);
    }
  }

  return {
    keyIndex: keyIndex,
    free: free
  };
}

function getKeyValue(item, key) {
  if (!item || !key) {
    return void 666;
  } else {
    return typeof key === 'string' ? item[key] : void 6969;
  }
}

exports.diffList = diffList;
/*var oldList = [{id: "a"}, {id: "b"}, {id: "c"}, {id: "d"}, {id: "e"}]
var newList = [{id: "c"}, {id: "a"}, {id: "b"}, {id: "e"}, {id: "f"}]
 
var moves = diffList(newList, oldList, "id")
// `moves` is a sequence of actions (remove or insert):  
// type 0 is removing, type 1 is inserting 
// moves: [ 
//   {index: 3, type: 0}, 
//   {index: 0, type: 1, item: {id: "c"}},  
//   {index: 3, type: 0},  
//   {index: 4, type: 1, item: {id: "f"}} 
//  ] 
 
console.log(JSON.stringify(moves.moves));

moves.moves.forEach(function(move) {
  if (move.type === 0) {
    oldList.splice(move.index, 1) // type 0 is removing 
  } else {
    oldList.splice(move.index, 0, move.item) // type 1 is inserting 
  }
})
 
// now `oldList` is equal to `newList` 
// [{id: "c"}, {id: "a"}, {id: "b"}, {id: "e"}, {id: "f"}] 
console.log(oldList)*/

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);

var _util = _interopRequireDefault(__webpack_require__(7));

var PATCH = {
  REPLACE: 'replace',
  REORDER: 'reorder',
  PROPS: 'props',
  TEXT: 'text'
};

function patch(dom, patches) {
  var walker = {
    index: 0
  };
  dfsWalker(dom, patches, walker);
}

function dfsWalker(dom, patches, walker) {
  var currentPatches = patches[walker.index];
  var length = dom.childNodes ? dom.childNodes.length : 0; // 依旧深度遍历，和diff的深度遍历技巧不一样，这次不用计算count，使用了对象--引用

  for (var i = 0; i < length; i++) {
    walker.index++;
    dfsWalker(dom.childNodes[i], patches, walker);
  } // 等子元素patch后patch, 否则出错


  if (currentPatches) {
    applyPatched(dom, currentPatches);
  }
}

function applyPatched(dom, currentPatches) {
  currentPatches.forEach(function (patch) {
    switch (patch.type) {
      case PATCH.REPLACE:
        var newNode = typeof patch.node === 'string' ? document.createTextNode(patch.node) : patch.node.render();
        dom.parentNode.replaceChild(newNode, dom);
        break;

      case PATCH.REORDER:
        reorderChildNodes(dom, patch.moves);
        break;

      case PATCH.PROPS:
        var props = patch.props;

        for (var key in props) {
          if (typeof props[key] === 'undefined') {
            dom.removeAttribute(key);
          } else {
            _util.default.setAttr(dom, key, props[key]);
          }
        }

        break;

      case PATCH.TEXT:
        dom.nodeValue = patch.content;
        break;
    }
  });
}

function reorderChildNodes(dom, moves) {
  var staticChildNodes = [].slice.call(dom.childNodes);
  var map = {};
  staticChildNodes.forEach(function (child) {
    var keyValue = child.getAttribute("key");

    if (keyValue) {
      map[keyValue] = child;
    }
  });
  moves.forEach(function (move) {
    var index = move.index;

    if (move.type === "remove") {
      dom.removeChild(dom.childNodes[index]);
      staticChildNodes.splice(index, 1);
    } else if (move.type === 'insert') {
      var key = move.item.key; // 元素复用， 因为递归时是先更新子元素，所以此处复用的子元素已经是最新的

      var insertNode = map[key] ? map[key] : typeof move.item === 'string' ? document.createTextNode(move.item) : move.item.render();
      staticChildNodes.splice(index, 0, insertNode);
      dom.insertBefore(insertNode, dom.childNodes[index] || null);
    }
  });
}

exports.PATCH = PATCH;
exports.patch = patch;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Util = {};

Util.setAttr = function (node, key, value) {
  switch (key) {
    case 'style':
      node.style.cssText = value;
      break;

    case 'value':
      var tagName = node.tagName || '';
      tagName = tagName.toLowerCase();

      if (tagName === 'input' || tagName === 'textarea') {
        node.value = value;
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value);
      }

      break;

    default:
      node.setAttribute(key, value);
      break;
  }
};

var _default = Util;
exports.default = _default;

/***/ })
/******/ ]);
});