import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';

const assert = chai.assert;

describe('iterator  tests', () => {
  let buffer: CircularBuffer<number>

  beforeEach(() => buffer = new CircularBuffer(5, [1, 3, 5, 7, 11]))

  it('no arguments returns array of data', () => {
    assert.deepEqual(buffer.slice(), [1, 3, 5, 7, 11]);
  })
  it('handles postive start and end indexs', () => {
    assert.deepEqual(buffer.slice(0), [1, 3, 5, 7, 11]);
    assert.deepEqual(buffer.slice(0, 3), [1, 3, 5]);
    assert.deepEqual(buffer.slice(1, 3), [3, 5]);
  })
  it('handles negative start and end indexs', () => {
    assert.deepEqual(buffer.slice(-2), [7, 11]);
    assert.deepEqual(buffer.slice(0, -2), [1, 3, 5]);
  })
  it('handles indexes outside of the buffer size', () => {
    assert.deepEqual(buffer.slice(0, 10), [1, 3, 5, 7, 11]);
    assert.deepEqual(buffer.slice(0, -7), []);
    assert.deepEqual(buffer.slice(-10), [1, 3, 5, 7, 11]);
  })

})

describe('handles circular cases', () => {
  let buffer: CircularBuffer<number>;
  before(() => {
    buffer = new CircularBuffer(5, [-1, 0, 1, 3, 5]);
    buffer.push([7, 9]);
    return buffer;
  })

  it('handles circular cases', () => {
    assert.deepEqual(buffer.slice(), [1, 3, 5, 7, 9]);
    assert.deepEqual(buffer.slice(0), [1, 3, 5, 7, 9]);
    assert.deepEqual(buffer.slice(1, 3), [3, 5]);
    assert.deepEqual(buffer.slice(-3), [5, 7, 9]);
    assert.deepEqual(buffer.slice(-4, -1), [3, 5, 7]);
    assert.deepEqual(buffer.slice(-1, 1), []);
    assert.deepEqual(buffer.slice(-4, -4), []);
    assert.deepEqual(buffer.slice(-4, -5), []);
  })
})