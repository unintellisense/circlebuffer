import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer push tests', () => {
  it('push items', () => {

    let tmp = new CircularBuffer<number>(3);
    tmp.push([1, 2, 3]);
    chai.assert.deepEqual(tmp['data'], [1, 2, 3]);
    tmp.push(4);
    chai.assert.deepEqual(tmp['data'], [4, 2, 3]);

  })

  it('push properties', () => {
    let tmp = new CircularBuffer<number>(3);
    tmp.push([1, 2]);
    chai.assert.equal(tmp['length'], 2);
    chai.assert.equal(tmp['start'], 0);
    chai.assert.equal(tmp['end'], 1);
  })

})