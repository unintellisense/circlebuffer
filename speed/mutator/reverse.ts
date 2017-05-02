import { CircularBuffer } from '../../src/circularBuffer';
import { test } from '../test';

const SIZE = 1e5;

let cb = new CircularBuffer<number>(SIZE),
    arr = [],
    i: number;

for (i = SIZE; i > 0; i--) {
    arr.push(i);
    cb.push(i);
}

test('reverse - CBuffer', function () {
    cb.reverse();
});

test('reverse - Array  ', function () {
    arr.reverse();
});
