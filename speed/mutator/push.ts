
import { CircularBuffer } from '../../src/circularBuffer';
import { test } from '../test';

const SIZE = 1e5;

let cb = new CircularBuffer<number>(SIZE),
	arr: number[] = [];


test('push 1e5 - CBuffer', function () {
	cb.empty();
}, function () {
	var i = SIZE;
	while (cb.push(i * 0.1), --i >= 0);
});

test('push 1e5 - Array  ', function () {
	arr.length = 0;
}, function () {
	var i = SIZE;
	while (arr.push(i * 0.1), --i >= 0);
});
