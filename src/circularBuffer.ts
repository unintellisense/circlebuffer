// converted from https://github.com/trevnorris/cbuffer

export default class CircularBuffer<T> {

  private length: number
  private start: number
  private end: number
  private size: number

  private defaultComparator = (a: T, b: T) => {
    return a == b ? 0 : a > b ? 1 : -1;
  }


  private data: T[]
  public overflow: null | ((t: T, buffer: CircularBuffer<T>) => void)


  constructor(size: number, data?: T[]) {
    // this is the same in either scenario
    if (data && data.length > size) throw new Error('cannot set array smaller than buffer size');
    this.size = size;
    this.length = this.start = 0;
    // set to callback fn if data is about to be overwritten
    this.overflow = null;
    // emulate Array based on passed arguments
    if (data) {
      this.data = new Array(data.length);
      this.end = (this.size) - 1;
      data.forEach(datum => this.push(datum));
    } else {
      this.data = new Array(size);
      this.end = this.size - 1;
    }
  }

  // pop last item
  pop(): T | undefined {
    let item: T;
    if (this.length === 0) return;
    item = this.data[this.end];
    // remove the reference to the object so it can be garbage collected
    delete this.data[this.end];
    this.end = (this.end - 1 + this.size) % this.size;
    this.length--;
    return item;
  }

  // push item to the end
  push(args: T | undefined) {
    if (args === undefined) return;
    let i = 0;

    if (this.overflow && this.length + 1 > this.size) { // will overflow
      this.overflow(this.data[(this.end + 1) % this.size], this);
    }
    this.data[(this.end + 1) % this.size] = args;
    i++;

    // recalculate length
    if (this.length < this.size) {
      if (this.length + i > this.size) this.length = this.size;
      else this.length += i;
    }
    // recalculate end
    this.end = (this.end + i) % this.size;
    // recalculate start
    this.start = (this.size + this.end - this.length + 1) % this.size;
    // return number current number of items in CBuffer
    return this.length;
  }

  // reverse order of the buffer
  reverse() {
    let i = 0,
      tmp;
    for (; i < ~~(this.length * .5); i++) {
      tmp = this.data[(this.start + i) % this.size];
      this.data[(this.start + i) % this.size] = this.data[(this.start + (this.length - i - 1)) % this.size];
      this.data[(this.start + (this.length - i - 1)) % this.size] = tmp;
    }
    return this;
  }

  // rotate buffer to the left by cntr, or by 1
  rotateLeft(cntr?: number) {
    if (!cntr) cntr = 1;
    while (--cntr >= 0) {
      this.push(this.shift());
    }
    return this;
  }

  // rotate buffer to the right by cntr, or by 1
  rotateRight(cntr?: number) {
    if (!cntr) cntr = 1;

    while (--cntr >= 0) {
      this.unshift(this.pop());
    }
    return this;
  }

  // remove and return first item
  shift(): T | undefined {
    let item: T;
    // check if there are any items in CBuff
    if (this.length === 0) return;
    // store first item for return
    item = this.data[this.start];
    // recalculate start of CBuffer
    this.start = (this.start + 1) % this.size;
    // decrement length
    this.length--;
    return item;
  }

  // sort items
  sort(compareFn?: (a: T, b: T) => number) {
    this.data.sort(compareFn || this.defaultComparator);
    this.start = 0;
    this.end = this.length - 1;
    return this;
  }

  // add item to beginning of buffer
  unshift(args: T | undefined) {
    if (args === undefined) return 0;
    let i = 0;

    if (this.overflow && this.length + 1 > this.size) {
      // call overflow function and send data that's about to be overwritten        
      this.overflow(this.data[this.end], this);
    }
    this.data[(this.size + this.start - (i % this.size) - 1) % this.size] = args;
    i++;

    if (this.size - this.length - i < 0) {
      this.end += this.size - this.length - i;
      if (this.end < 0) this.end = this.size + (this.end % this.size);
    }
    if (this.length < this.size) {
      if (this.length + i > this.size) this.length = this.size;
      else this.length += i;
    }

    this.start -= i;
    if (this.start < 0) this.start = this.size + (this.start % this.size);
    return this.length;
  }


  // return index of first matched element
  indexOf(arg: T, idx?: number) {
    if (!idx) idx = 0;
    for (; idx < this.length; idx++) {
      if (this.data[(this.start + idx) % this.size] === arg) return idx;
    }
    return -1;
  }

  // return last index of the first match
  lastIndexOf(arg: T, idx?: number) {
    if (!idx) idx = this.length - 1;
    for (; idx >= 0; idx--) {
      if (this.data[(this.start + idx) % this.size] === arg) return idx;
    }
    return -1;
  }

  // return the index an item would be inserted to if this
  // is a sorted circular buffer
  sortedIndex(value: T, comparator?: (a: T, b: T) => number) {
    comparator = comparator || this.defaultComparator;
    let isFull = this.length === this.size,
      low = this.start,
      high = isFull ? this.length - 1 : this.length;

    // Tricky part is finding if its before or after the pivot
    // we can get this info by checking if the target is less than
    // the last item. After that it's just a typical binary search.
    if (low && comparator(value, this.data[high]) > 0) {
      low = 0, high = this.end;
    }

    while (low < high) {
      let mid = (low + high) >>> 1;
      if (comparator(value, this.data[mid]) > 0) low = mid + 1;
      else high = mid;
    }
    return !isFull ? low :
      // http://stackoverflow.com/a/18618273/1517919
      (((low - this.start) % this.length) + this.length) % this.length;
  }

  /* iteration methods */
  // check every item in the array against a test
  every(callback: (val: T, idx?: number, buff?: CircularBuffer<T>) => boolean) {
    let i = 0;
    for (; i < this.length; i++) {
      if (!callback(this.data[(this.start + i) % this.size], i, this))
        return false;
    }
    return true;
  }

  // loop through each item in buffer
  // TODO: figure out how to emulate Array use better
  forEach(callback: (val: T, idx: number, buff: CircularBuffer<T>) => void) {
    let i = 0;
    for (; i < this.length; i++) {
      callback(this.data[(this.start + i) % this.size], i, this);
    }
  }

  // check items agains test until one returns true
  // TODO: figure out how to emuldate Array use better
  some(callback: (val: T, idx: number, buff: CircularBuffer<T>) => boolean) {
    let i = 0;
    for (; i < this.length; i++) {
      if (callback(this.data[(this.start + i) % this.size], i, this))
        return true;
    }
    return false;
  }

  // calculate the average value of a circular buffer
  avg(): number {
    return this.length == 0 ? 0 : (this.sum() / this.length);
  }

  // loop through each item in buffer and calculate sum
  sum(): number {
    let index = this.length;
    let s = 0;
    while (index--) s += <any>this.data[index]; // this will runtime error if T is not number
    return s;
  }

  // loop through each item in buffer and calculate median
  median(): number {
    if (this.length === 0)
      return 0;
    let values = <any[]>this.slice().sort(this.defaultComparator); // will runtime error if T isnt number
    let half = Math.floor(values.length / 2);
    if (values.length % 2)
      return values[half];
    else
      return (values[half - 1] + values[half]) / 2.0;
  }

  /* utility methods */
  // reset pointers to buffer with zero items
  // note: this will not remove values in cbuffer, so if for security values
  //       need to be overwritten, run `.fill(null).empty()`
  empty() {
    let i = 0;
    this.length = this.start = 0;
    this.end = this.size - 1;
    return this;
  }

  // fill all places with passed value or function
  fill(arg: T) {
    let i = 0;
    if (typeof arg === 'function') {
      while (this.data[i] = arg(), ++i < this.size);
    } else {
      while (this.data[i] = arg, ++i < this.size);
    }
    // reposition start/end
    this.start = 0;
    this.end = this.size - 1;
    this.length = this.size;
    return this;
  }

  // return first item in buffer
  first() {
    return this.data[this.start];
  }

  // return last item in buffer
  last() {
    return this.data[this.end];
  }

  // return specific index in buffer
  get(arg: number) {
    return this.data[(this.start + arg) % this.size];
  }

  isFull() {
    return this.size === this.length;
  }

  // set value at specified index
  set(idx: number, arg: T) {
    return this.data[(this.start + idx) % this.size] = arg;
  }

  // return clean array of values
  toArray() {
    return this.slice();
  }

  // slice the buffer to an arraay
  slice(start?: number, end?: number): T[] {
    let size = this.length;

    start = +start! || 0;

    if (start < 0) {
      if (start >= end!)
        return [];
      start = (-start > size) ? 0 : size + start;
    }

    if (end == null || end > size)
      end = size;
    else if (end < 0)
      end += size;
    else
      end = +end || 0;

    size = start < end ? end - start : 0;

    let result = Array(size);
    for (let index = 0; index < size; index++) {
      result[index] = this.data[(this.start + start + index) % this.size];
    }
    return result;
  }




}



