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
  });

  describe('supports classic repetitive item case', () => {
    let buffer: CircularBuffer<number>
    beforeEach(() => buffer = new CircularBuffer(10, [0, 0, 0, 1, 1, 2, 2, 3, 3, 7]))

    it('supports repetitive item', () => {
      assert.equal(buffer.sortedIndex(3), 7);
      assert.equal(buffer.sortedIndex(5), 9);
    })
  })

  describe('mid circular case', () => {
    let buffer: CircularBuffer<number>
    beforeEach(() => {
      buffer = new CircularBuffer(5, [-1, 0, 1, 3, 5]);
      buffer.push([7, 9]);
      return buffer;
    });

    it('simple circular buffer', () => {
      assert.equal(buffer.sortedIndex(0), 0);
      assert.equal(buffer.sortedIndex(2), 1);
      assert.equal(buffer.sortedIndex(4), 2);
      assert.equal(buffer.sortedIndex(7), 3);
      assert.equal(buffer.sortedIndex(8), 4);
      assert.equal(buffer.sortedIndex(10), 4);
    });
    it('circular buffer on the pivot', () => {
      assert.equal(buffer.sortedIndex(4.999), 2);
      assert.equal(buffer.sortedIndex(5), 2);
      assert.equal(buffer.sortedIndex(6), 3);
    });
    it('returns index of existing item', () => {
      assert.equal(buffer.sortedIndex(7), 3);
    });
  });

  describe('almost sorted data cases (1 item out of place)', () => {
    let buffer: CircularBuffer<number>
    beforeEach(() => {
      buffer = new CircularBuffer(7, [-3, -1, 0, 1, 3, 5, 7]);
      buffer.push([7, 9, 11, 13, 15, 17]);
      return buffer;
    })
    it('single item out of place', () => {
      assert.equal(buffer.sortedIndex(0), 0);
      assert.equal(buffer.sortedIndex(17), 6);
    })
  })
})