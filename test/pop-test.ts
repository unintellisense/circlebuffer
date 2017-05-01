import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer pop tests', () => {
  it('pop items', () => {

    let tmp = new CircularBuffer(3, [1, 2, 3]);
    chai.assert.equal(tmp.pop(), 3);

    tmp = new CircularBuffer(3, [1, 2, 3]);
    tmp.pop();
    chai.assert.deepEqual(tmp.toArray(), [1, 2]);

    tmp = new CircularBuffer<number>(3);
    chai.assert.isUndefined(tmp.pop());

  })

  it('pop properties', () => {
    let tmp = new CircularBuffer(3, [1, 2, 3]);
    tmp.pop();
    chai.assert.equal(tmp['end'], 1);
    chai.assert.equal(tmp['length'], 2);
  })

})