import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer reverse tests', () => {
  it('reverse buffer', () => {
    chai.assert.deepEqual(new CircularBuffer(3, [1, 2, 3]).reverse()['data'], [3, 2, 1]);
    chai.assert.deepEqual(new CircularBuffer(4, [1, 2, 3, 4]).reverse()['data'], [4, 3, 2, 1]);    
  })
})