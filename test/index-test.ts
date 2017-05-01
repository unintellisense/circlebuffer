import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';

const assert = chai.assert;

describe('circularBuffer index tests', () => {

  it('indexOf', () => {
    assert.equal(new CircularBuffer(3, [1, 2, 3]).indexOf(2), 1);
    assert.equal(new CircularBuffer(3, ['a', 'b', 'c']).indexOf('c'), 2);
    assert.equal(new CircularBuffer<number | string>(3, [1, 2, 3]).indexOf('1'), -1);
    assert.equal(new CircularBuffer(3, [1, 2, 3]).indexOf(4), -1);
  })

  it('lastIndexOf', () => {
    assert.equal(new CircularBuffer(3, [1, 2, 3]).lastIndexOf(2), 1);
    assert.equal(new CircularBuffer(3, ['a', 'b', 'c']).lastIndexOf('c'), 2);
    assert.equal(new CircularBuffer<number | string>(3, [1, 2, 3]).lastIndexOf('1'), -1);
    assert.equal(new CircularBuffer(3, [1, 2, 3]).lastIndexOf(4), -1);
  })

})

describe('sortedIndex', () => {

  describe('works with simple sorted case', () => {
    let buffer: CircularBuffer<number>
    beforeEach(() => buffer = new CircularBuffer(5, [1, 3, 5, 7, 11]))

    it('no iterator provided', () => {
      assert.equal(buffer.sortedIndex(-1), 0);
      assert.equal(buffer.sortedIndex(1.5), 1);
    })

    it('returns index of existing items', () => {
      assert.equal(buffer.sortedIndex(1), 0);
      assert.equal(buffer.sortedIndex(5), 2);
      assert.equal(buffer.sortedIndex(11), 4);
    })

    it('around the corner', () => {
      assert.equal(buffer.sortedIndex(-1), 0);
      assert.equal(buffer.sortedIndex(12), 4);
    })

    it('takes an iterator', () => {
      var buffer = new CircularBuffer(5, [7, 5, 11, 3, 1]);
      function iter(a, b) {
        return Math.abs(a - 8) - Math.abs(b - 8);
      }
      assert.equal(buffer.sortedIndex(6, iter), 1);
    })
  })

  describe('non-full circular buffer', () => {
    let buffer: CircularBuffer<number>
    beforeEach(() => buffer = new CircularBuffer(20, [1, 2, 3, 4, 5, 6, 7, 8]))

    it('works with partially complete buffers', () => {
      assert.equal(buffer.sortedIndex(3), 2);
      assert.equal(buffer.sortedIndex(8), 7);
    })


    it('can determine postion in a fixed length buffer', () => {
      assert.equal(buffer.sortedIndex(0), 0);
      assert.equal(buffer.sortedIndex(1), 0);
      assert.equal(buffer.sortedIndex(3), 2);
      assert.equal(new CircularBuffer(20, [1, 2, 3, 4, 5, 6, 7, 8]).sortedIndex(10), 8);
    });




  })
})