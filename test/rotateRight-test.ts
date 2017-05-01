import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer reverse tests', () => {
  it('rotateRight buffer', () => {
    chai.assert.deepEqual(new CircularBuffer(3, [1, 2, 3]).rotateRight(2).toArray(), [2, 3, 1]);
    chai.assert.deepEqual(new CircularBuffer(3, [1, 2, 3]).rotateRight().toArray(), [3, 1, 2]);

  })
})