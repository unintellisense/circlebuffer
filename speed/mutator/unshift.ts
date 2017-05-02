import { CircularBuffer } from '../../src/circularBuffer';
import { test } from '../test';

const SIZE = 1e5;

let cb = new CircularBuffer<number>(SIZE),
	arr = [];

test('unshift 1e5 - CBuffer', function () {
	cb.empty();
}, function () {
	var i = SIZE;
	while (cb.unshift(i), --i >= 0);
});

test('unshift 1e5 - Array  ', function () {
	arr.length = 0;
}, function () {
	var i = SIZE;
	while (arr.unshift(i), --i >= 0);
});
