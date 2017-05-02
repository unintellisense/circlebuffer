import { CircularBuffer } from '../../src/circularBuffer'
import { test } from '../test';

test('Array', function () {
	new CircularBuffer(4);
});

test('Arguments', function () {
	new CircularBuffer(4, [1, 2, 3, 4]);
});
