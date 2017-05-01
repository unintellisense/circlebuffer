import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer reverse tests', () => {
  it('rotateLeft buffer', () => {
    chai.assert.deepEqual(new CircularBuffer(3, [1, 2, 3]).rotateLeft(2).toArray(), [3, 1, 2]);
    chai.assert.deepEqual(new CircularBuffer(3, [1, 2, 3]).rotateLeft().toArray(), [2, 3, 1]);    
  })
})