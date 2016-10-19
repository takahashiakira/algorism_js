const App = {
  data: {},
  searchs: {},
  sorts: {}
};


// data
App.data.Array = Array;
App.data.LinkedList = (() => {
  class Cell {
    constructor (data, link) {
      this.data = data || null;
      this.link = link || null;
    }
  }
  class LinkedList {
    constructor (args) {
      let cp = new Cell();
      this.top = cp;
      args.forEach((item) => {
        cp.link = new Cell(item);
        cp = cp.link;
      });
    }
    _nth (n) {
      let cp = this.top;
      let i = -1;
      while(cp !== null){
        if(n === i) { return cp; }
        cp = cp.link;
        i += 1;
      }
      return null;
    }
    at (n) {
      let cp = this._nth(n);
      if(cp) { return cp.data; }
      return null;
    }
    insert (n, x) {
      let cp = this._nth(n - 1);
      if (cp) {
        cp.link = new Cell(x, cp.link);
        return x;
      }
      return null;
    }
    remove (n) {
      let cp = this._nth(n - 1);
      if (cp && cp.link) {
        cp.link = cp.link.link;
        return cp.link.data;
      }
      return null;
    }
    each (func) {
      let cp = this.top.link;
      while (cp !== null) {
        func(cp.data);
        cp = cp.link;
      }
    }
    isEmpty () {
      return this.top.link === null;
    }
    toArray () {
      let ary = [];
      this.each((x) => { ary.push(x); });
      return ary;
    }
    toString () {
      return '(' + this.toArray().join(', ') + ')';
    }
  }
  return LinkedList;
})();
App.data.Hashtable = Object;
App.data.Tree = class Tree {
  constructor (list) {
    if (list.length < 2) {
      this.value = list[0];
      return this;
    }
    this.value = list[0];
    list.splice(0, 1);
    if (list.length < 2) { return this; }
    const leftList = [];
    const rightList = [];
    const lengthList = [];
    let num =  list.length;
    while (num > 1) {
      num = Math.floor(num / 2);
      lengthList.push(num);
    }
    let i = lengthList.length - 1;
    list.forEach((val) => {
      if (leftList.length < lengthList[i]) {
        leftList.push(val);
      } else if (rightList.length < lengthList[i]) {
        rightList.push(val);
      }
      if (rightList.length >= lengthList[i]) { i--; }
    });
    this.childNodeLeft = new App.data.Tree(leftList);
    this.childNodeRight = new App.data.Tree(rightList);
  }
};
App.data.Stack = class Stack {
  constructor (){
    this.__a = [];
  }
  push (o) {
    this.__a.push(o);
  }
  pop () {
    if ( this.__a.length > 0 ) { return this.__a.pop(); }
    return null;
  }
  size () {
    return this.__a.length;
  }
  toArray () {
    return this.__a;
  }
  toString () {
    return '[' + this.__a.join(',') + ']';
  }
};
App.data.Queue = class Queue {
  constructor () {
    this.__a = [];
  }
  enqueue (o) {
    this.__a.push(o);
  }
  dequeue () {
    if( this.__a.length > 0 ) { return this.__a.shift(); }
    return null;
  }
  size () {
    return this.__a.length;
  }
  toArray () {
    return this.__a;
  }
  toString () {
    return '[' + this.__a.join(',') + ']';
  }
};

// Search
App.searchs.linearSearch = (list, key) => {
  for (let i = 0; i < list.length; i++) {
    if (key === list[i]) { return i; }
  }
  return null;
};

App.searchs.sequentialSearch = (list, key) => {
  for (let i = 0, l = list.length; i < l; i++) {
    if (list[i] === key) { return i; }
  }
  return -1;
};

App.searchs.binarySearch = (list, key) => {
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (key === list[mid]) {
      return mid;
    } else if (key < list[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return false;
};


// Sort
App.sorts.bubbleSort = (list) => {
  let tmp;
  list.forEach(() => {
    list.forEach((val, i) => {
      if (list[i - 1] > val) {
        // ソート
        tmp = val;
        list[i] = list[i - 1];
        list[i - 1] = tmp;
      }
    });
  });
  return list;
};

App.sorts.mergeSort = (list) => {
  const merge = (mList1, mList2) => {
    const a  = [];
    let i = 0;
    let j = 0;
    // ソート
    while (i < mList1.length && j < mList2.length) {
      const tmp = (mList1[i] < mList2[j]) ? mList1[i++] : mList2[j++];
      a.push(tmp);
    }
    const left = mList1.slice(i, mList1.length);
    const right = mList2.slice(j, mList2.length);
    return a.concat(left).concat(right);
  };
  if (list.length < 2) { return list; }
  // 配列を2要素になるまで再起で2分割してそれぞれをソート
  const left = App.sorts.mergeSort(list.slice(0, list.length / 2));
  const right = App.sorts.mergeSort(list.slice(list.length / 2, list.length));
  return merge(left, right);
};

App.sorts.quickSort = (list) => {
  const sort = (start, end) => {
    // 再帰出口
    if(start >= end) { return; }
    let left = start;
    let right = end;
    const reference = list[Math.round((left + right) / 2)];
    // left = (0 -> list.length-1) と増やし、一方で right = (list.length-1 -> 0) と減少。
    // 最終的にleftとrightは同じindexになるか、交差すれば終了。
    while (left < right) {
      if (list[left] >= reference) {
        while (right > left) {
          if (list[right] <= reference) {
            // ソート
            let tmp = list[left];
            list[left] = list[right];
            list[right] = tmp;
            right--;
            break;
          }
          right--;
        }
      }
      left++;
    }
    if (list[right] > reference) {
      sort(start, right - 1);
      sort(right, end);
    } else if (list[right] < reference) {
      sort(start, right);
      sort(right + 1, end);
    } else {
      // list[right]がreferenceと同じ値の時
      sort(start, right - 1);
      sort(right + 1, end);
    }
  };
  sort(0, list.length - 1);
  return list;
};



const keySample = 0;
const listSample = [8, 2, 7, 1, -1, -2, 0, 3, 4, 6, 10, 9, 5];

const array = new App.data.Array();
array.push(1);
array.push(2);
array.push(3);

const linkedList = new App.data.LinkedList([1, 2, 3]);
// const linkedList_first = linkedList._nth(0);

const hashtable = new App.data.Hashtable();
hashtable.key1 = 1;
hashtable.key2 = 2;
hashtable.key3 = 3;

const stack = new App.data.Stack();
stack.push(1);
stack.push(2);
stack.push(3);

const queue = new App.data.Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

const tree = new App.data.Tree([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

const linearSearch_result = App.searchs.linearSearch(listSample, keySample);
const sequentialSearch_result = App.searchs.sequentialSearch(listSample, keySample);
const binarySearch_result = App.searchs.binarySearch(listSample, keySample);
const bubbleSort_result = App.sorts.bubbleSort(listSample);
const mergeSort_result = App.sorts.mergeSort(listSample);
const quickSort_result = App.sorts.quickSort(listSample);

console.log(array);
console.log(linkedList.toArray());
console.log(hashtable);
console.log(stack.toArray());
console.log(queue.toArray());
console.log(tree);

console.log(linearSearch_result);
console.log(sequentialSearch_result);
console.log(binarySearch_result);
console.log(bubbleSort_result);
console.log(mergeSort_result);
console.log(quickSort_result);
