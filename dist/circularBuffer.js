// converted from https://github.com/trevnorris/cbuffer
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defaultComparator(a, b) {
    return a == b ? 0 : a > b ? 1 : -1;
}
var CircularBuffer = (function () {
    function CircularBuffer(size, data) {
        // this is the same in either scenario
        if (data && data.length > size)
            throw new Error('cannot set array smaller than buffer size');
        this.size = size;
        this.length = this.start = 0;
        // set to callback fn if data is about to be overwritten
        this.overflow = null;
        // emulate Array based on passed arguments
        if (data) {
            this.data = new Array(data.length);
            this.end = (this.size) - 1;
            this.push(data);
        }
        else {
            this.data = new Array(size);
            this.end = this.size - 1;
        }
    }
    // pop last item
    CircularBuffer.prototype.pop = function () {
        var item;
        if (this.length === 0)
            return;
        item = this.data[this.end];
        // remove the reference to the object so it can be garbage collected
        delete this.data[this.end];
        this.end = (this.end - 1 + this.size) % this.size;
        this.length--;
        return item;
    };
    // push item to the end
    CircularBuffer.prototype.push = function (args) {
        if (args === undefined)
            return;
        var i = 0;
        if (!(args instanceof Array)) {
            if (this.overflow && this.length + 1 > this.size) {
                this.overflow(this.data[(this.end + 1) % this.size], this);
            }
            this.data[(this.end + 1) % this.size] = args;
            i++;
        }
        else {
            // check if overflow is set, and if data is about to be overwritten
            if (this.overflow && (this.length + args.length) > this.size) {
                // call overflow function and send data that's about to be overwritten
                for (; i < this.length + args.length - this.size; i++) {
                    this.overflow(this.data[(this.end + i + 1) % this.size], this);
                }
            }
            // push items to the end, wrapping and erasing existing items    
            for (i = 0; i < args.length; i++) {
                this.data[(this.end + i + 1) % this.size] = args[i];
            }
        }
        // recalculate length
        if (this.length < this.size) {
            if (this.length + i > this.size)
                this.length = this.size;
            else
                this.length += i;
        }
        // recalculate end
        this.end = (this.end + i) % this.size;
        // recalculate start
        this.start = (this.size + this.end - this.length + 1) % this.size;
        // return number current number of items in CBuffer
        return this.length;
    };
    // reverse order of the buffer
    CircularBuffer.prototype.reverse = function () {
        var i = 0, tmp;
        for (; i < ~~(this.length * .5); i++) {
            tmp = this.data[(this.start + i) % this.size];
            this.data[(this.start + i) % this.size] = this.data[(this.start + (this.length - i - 1)) % this.size];
            this.data[(this.start + (this.length - i - 1)) % this.size] = tmp;
        }
        return this;
    };
    // rotate buffer to the left by cntr, or by 1
    CircularBuffer.prototype.rotateLeft = function (cntr) {
        if (!cntr)
            cntr = 1;
        while (--cntr >= 0) {
            this.push(this.shift());
        }
        return this;
    };
    // rotate buffer to the right by cntr, or by 1
    CircularBuffer.prototype.rotateRight = function (cntr) {
        if (!cntr)
            cntr = 1;
        while (--cntr >= 0) {
            this.unshift(this.pop());
        }
        return this;
    };
    // remove and return first item
    CircularBuffer.prototype.shift = function () {
        var item;
        // check if there are any items in CBuff
        if (this.length === 0)
            return;
        // store first item for return
        item = this.data[this.start];
        // recalculate start of CBuffer
        this.start = (this.start + 1) % this.size;
        // decrement length
        this.length--;
        return item;
    };
    // sort items
    CircularBuffer.prototype.sort = function (compareFn) {
        this.data.sort(compareFn || defaultComparator);
        this.start = 0;
        this.end = this.length - 1;
        return this;
    };
    // add item to beginning of buffer
    CircularBuffer.prototype.unshift = function (args) {
        if (args === undefined)
            return 0;
        var i = 0;
        if (!(args instanceof Array)) {
            if (this.overflow && this.length + 1 > this.size) {
                // call overflow function and send data that's about to be overwritten        
                this.overflow(this.data[this.end], this);
            }
            this.data[(this.size + this.start - (i % this.size) - 1) % this.size] = args;
            i++;
        }
        else {
            // check if overflow is set, and if data is about to be overwritten
            if (this.overflow && this.length + args.length > this.size) {
                // call overflow function and send data that's about to be overwritten
                for (; i < this.length + args.length - this.size; i++) {
                    this.overflow(this.data[this.end - (i % this.size)], this);
                }
            }
            for (i = 0; i < args.length; i++) {
                this.data[(this.size + this.start - (i % this.size) - 1) % this.size] = args[i];
            }
        }
        if (this.size - this.length - i < 0) {
            this.end += this.size - this.length - i;
            if (this.end < 0)
                this.end = this.size + (this.end % this.size);
        }
        if (this.length < this.size) {
            if (this.length + i > this.size)
                this.length = this.size;
            else
                this.length += i;
        }
        this.start -= i;
        if (this.start < 0)
            this.start = this.size + (this.start % this.size);
        return this.length;
    };
    // return index of first matched element
    CircularBuffer.prototype.indexOf = function (arg, idx) {
        if (!idx)
            idx = 0;
        for (; idx < this.length; idx++) {
            if (this.data[(this.start + idx) % this.size] === arg)
                return idx;
        }
        return -1;
    };
    // return last index of the first match
    CircularBuffer.prototype.lastIndexOf = function (arg, idx) {
        if (!idx)
            idx = this.length - 1;
        for (; idx >= 0; idx--) {
            if (this.data[(this.start + idx) % this.size] === arg)
                return idx;
        }
        return -1;
    };
    // return the index an item would be inserted to if this
    // is a sorted circular buffer
    CircularBuffer.prototype.sortedIndex = function (value, comparator) {
        comparator = comparator || defaultComparator;
        var isFull = this.length === this.size, low = this.start, high = isFull ? this.length - 1 : this.length;
        // Tricky part is finding if its before or after the pivot
        // we can get this info by checking if the target is less than
        // the last item. After that it's just a typical binary search.
        if (low && comparator(value, this.data[high]) > 0) {
            low = 0, high = this.end;
        }
        while (low < high) {
            var mid = (low + high) >>> 1;
            if (comparator(value, this.data[mid]) > 0)
                low = mid + 1;
            else
                high = mid;
        }
        return !isFull ? low :
            // http://stackoverflow.com/a/18618273/1517919
            (((low - this.start) % this.length) + this.length) % this.length;
    };
    /* iteration methods */
    // check every item in the array against a test
    CircularBuffer.prototype.every = function (callback) {
        var i = 0;
        for (; i < this.length; i++) {
            if (!callback(this.data[(this.start + i) % this.size], i, this))
                return false;
        }
        return true;
    };
    // loop through each item in buffer
    // TODO: figure out how to emulate Array use better
    CircularBuffer.prototype.forEach = function (callback) {
        var i = 0;
        for (; i < this.length; i++) {
            callback(this.data[(this.start + i) % this.size], i, this);
        }
    };
    // check items agains test until one returns true
    // TODO: figure out how to emuldate Array use better
    CircularBuffer.prototype.some = function (callback) {
        var i = 0;
        for (; i < this.length; i++) {
            if (callback(this.data[(this.start + i) % this.size], i, this))
                return true;
        }
        return false;
    };
    // calculate the average value of a circular buffer
    CircularBuffer.prototype.avg = function () {
        return this.length == 0 ? 0 : (this.sum() / this.length);
    };
    // loop through each item in buffer and calculate sum
    CircularBuffer.prototype.sum = function () {
        var index = this.length;
        var s = 0;
        while (index--)
            s += this.data[index]; // this will runtime error if T is not number
        return s;
    };
    // loop through each item in buffer and calculate median
    CircularBuffer.prototype.median = function () {
        if (this.length === 0)
            return 0;
        var values = this.slice().sort(defaultComparator); // will runtime error if T isnt number
        var half = Math.floor(values.length / 2);
        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    };
    /* utility methods */
    // reset pointers to buffer with zero items
    // note: this will not remove values in cbuffer, so if for security values
    //       need to be overwritten, run `.fill(null).empty()`
    CircularBuffer.prototype.empty = function () {
        var i = 0;
        this.length = this.start = 0;
        this.end = this.size - 1;
        return this;
    };
    // fill all places with passed value or function
    CircularBuffer.prototype.fill = function (arg) {
        var i = 0;
        if (typeof arg === 'function') {
            while (this.data[i] = arg(), ++i < this.size)
                ;
        }
        else {
            while (this.data[i] = arg, ++i < this.size)
                ;
        }
        // reposition start/end
        this.start = 0;
        this.end = this.size - 1;
        this.length = this.size;
        return this;
    };
    // return first item in buffer
    CircularBuffer.prototype.first = function () {
        return this.data[this.start];
    };
    // return last item in buffer
    CircularBuffer.prototype.last = function () {
        return this.data[this.end];
    };
    // return specific index in buffer
    CircularBuffer.prototype.get = function (arg) {
        return this.data[(this.start + arg) % this.size];
    };
    CircularBuffer.prototype.isFull = function () {
        return this.size === this.length;
    };
    // set value at specified index
    CircularBuffer.prototype.set = function (idx, arg) {
        return this.data[(this.start + idx) % this.size] = arg;
    };
    // return clean array of values
    CircularBuffer.prototype.toArray = function () {
        return this.slice();
    };
    // slice the buffer to an arraay
    CircularBuffer.prototype.slice = function (start, end) {
        var size = this.length;
        start = +start || 0;
        if (start < 0) {
            if (start >= end)
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
        var result = Array(size);
        for (var index = 0; index < size; index++) {
            result[index] = this.data[(this.start + start + index) % this.size];
        }
        return result;
    };
    return CircularBuffer;
}());
exports.default = CircularBuffer;
//# sourceMappingURL=circularBuffer.js.map