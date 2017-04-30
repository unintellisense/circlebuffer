// converted from https://github.com/trevnorris/cbuffer
function defaultComparator(a, b) {
    return a == b ? 0 : a > b ? 1 : -1;
}
var CBuffer = (function () {
    function CBuffer(args) {
        // if no arguments, then nothing needs to be set
        if (args instanceof Array && args.length === 0) {
            throw new Error('Missing Argument: You must pass a valid buffer size');
        }
        // this is the same in either scenario
        this.length = this.start = 0;
        // set to callback fn if data is about to be overwritten
        this.overflow = null;
        // emulate Array based on passed arguments
        if (args.length > 1 || typeof args[0] !== 'number') {
            this.data = new Array(args.length);
            this.end = (this.size = args.length) - 1;
            this.push.apply(this, args);
        }
        else {
            this.data = new Array(args[0]);
            this.end = (this.size = args[0]) - 1;
        }
        // need to `return this` so `return CBuffer.apply` works
        return this;
    }
    // pop last item
    CBuffer.prototype.pop = function () {
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
    CBuffer.prototype.push = function (args) {
        if (args === undefined)
            return;
        var i = 0;
        // check if overflow is set, and if data is about to be overwritten
        if (this.overflow && this.length + args.length > this.size) {
            // call overflow function and send data that's about to be overwritten
            for (; i < this.length + args.length - this.size; i++) {
                this.overflow(this.data[(this.end + i + 1) % this.size], this);
            }
        }
        // push items to the end, wrapping and erasing existing items
        // using arguments variable directly to reduce gc footprint
        for (i = 0; i < args.length; i++) {
            this.data[(this.end + i + 1) % this.size] = args[i];
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
    CBuffer.prototype.reverse = function () {
        var i = 0, tmp;
        for (; i < ~~(this.length / 2); i++) {
            tmp = this.data[(this.start + i) % this.size];
            this.data[(this.start + i) % this.size] = this.data[(this.start + (this.length - i - 1)) % this.size];
            this.data[(this.start + (this.length - i - 1)) % this.size] = tmp;
        }
        return this;
    };
    // rotate buffer to the left by cntr, or by 1
    CBuffer.prototype.rotateLeft = function (cntr) {
        if (typeof cntr === 'undefined')
            cntr = 1;
        if (typeof cntr !== 'number')
            throw new Error("Argument must be a number");
        while (--cntr >= 0) {
            this.push(this.shift());
        }
        return this;
    };
    // rotate buffer to the right by cntr, or by 1
    CBuffer.prototype.rotateRight = function (cntr) {
        if (typeof cntr === 'undefined')
            cntr = 1;
        if (typeof cntr !== 'number')
            throw new Error("Argument must be a number");
        while (--cntr >= 0) {
            this.unshift(this.pop());
        }
        return this;
    };
    // remove and return first item
    CBuffer.prototype.shift = function () {
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
    CBuffer.prototype.sort = function (fn) {
        this.data.sort(fn || defaultComparator);
        this.start = 0;
        this.end = this.length - 1;
        return this;
    };
    // add item to beginning of buffer
    CBuffer.prototype.unshift = function (args) {
        if (args === undefined)
            return 0;
        var i = 0;
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
        this.start -= args.length;
        if (this.start < 0)
            this.start = this.size + (this.start % this.size);
        return this.length;
    };
    // return index of first matched element
    CBuffer.prototype.indexOf = function (arg, idx) {
        if (!idx)
            idx = 0;
        for (; idx < this.length; idx++) {
            if (this.data[(this.start + idx) % this.size] === arg)
                return idx;
        }
        return -1;
    };
    // return last index of the first match
    CBuffer.prototype.lastIndexOf = function (arg, idx) {
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
    CBuffer.prototype.sortedIndex = function (value, comparator, context) {
        comparator = comparator || defaultComparator;
        var isFull = this.length === this.size, low = this.start, high = isFull ? this.length - 1 : this.length;
        // Tricky part is finding if its before or after the pivot
        // we can get this info by checking if the target is less than
        // the last item. After that it's just a typical binary search.
        if (low && comparator.call(context, value, this.data[high]) > 0) {
            low = 0, high = this.end;
        }
        while (low < high) {
            var mid = (low + high) >>> 1;
            if (comparator.call(context, value, this.data[mid]) > 0)
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
    CBuffer.prototype.every = function (callback, context) {
        var i = 0;
        for (; i < this.length; i++) {
            if (!callback.call(context, this.data[(this.start + i) % this.size], i, this))
                return false;
        }
        return true;
    };
    // loop through each item in buffer
    // TODO: figure out how to emulate Array use better
    CBuffer.prototype.forEach = function (callback, context) {
        var i = 0;
        for (; i < this.length; i++) {
            callback.call(context, this.data[(this.start + i) % this.size], i, this);
        }
    };
    // check items agains test until one returns true
    // TODO: figure out how to emuldate Array use better
    CBuffer.prototype.some = function (callback, context) {
        var i = 0;
        for (; i < this.length; i++) {
            if (callback.call(context, this.data[(this.start + i) % this.size], i, this))
                return true;
        }
        return false;
    };
    // calculate the average value of a circular buffer
    CBuffer.prototype.avg = function () {
        return this.length == 0 ? 0 : (this.sum() / this.length);
    };
    // loop through each item in buffer and calculate sum
    CBuffer.prototype.sum = function () {
        var index = this.length;
        var s = 0;
        while (index--)
            s += this.data[index]; // this will runtime error if T is not number
        return s;
    };
    // loop through each item in buffer and calculate median
    CBuffer.prototype.median = function () {
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
    CBuffer.prototype.empty = function () {
        var i = 0;
        this.length = this.start = 0;
        this.end = this.size - 1;
        return this;
    };
    // fill all places with passed value or function
    CBuffer.prototype.fill = function (arg) {
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
    CBuffer.prototype.first = function () {
        return this.data[this.start];
    };
    // return last item in buffer
    CBuffer.prototype.last = function () {
        return this.data[this.end];
    };
    // return specific index in buffer
    CBuffer.prototype.get = function (arg) {
        return this.data[(this.start + arg) % this.size];
    };
    CBuffer.prototype.isFull = function () {
        return this.size === this.length;
    };
    // set value at specified index
    CBuffer.prototype.set = function (idx, arg) {
        return this.data[(this.start + idx) % this.size] = arg;
    };
    // return clean array of values
    CBuffer.prototype.toArray = function () {
        return this.slice();
    };
    // slice the buffer to an arraay
    CBuffer.prototype.slice = function (start, end) {
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
    return CBuffer;
}());
