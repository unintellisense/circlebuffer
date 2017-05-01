import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer unshift tests', () => {
  it('unshift items', () => {
    let tmp = new CircularBuffer<number>(8);

    tmp.unshift([1, 2, 3, 4, 5, 6, 7, 8]);
    chai.assert.deepEqual(tmp['data'], [8, 7, 6, 5, 4, 3, 2, 1]);

    tmp.unshift(99);
    chai.assert.deepEqual(tmp['data'], [8, 7, 6, 5, 4, 3, 2, 99]);

    tmp.unshift([11, 22])
    chai.assert.deepEqual(tmp['data'], [8, 7, 6, 5, 4, 22, 11, 99]);
  })

  it('unshift properties', () => {
    let tmp = new CircularBuffer<number>(3);
    tmp.unshift([1, 2]);
    chai.assert.equal(tmp['length'], 2);
    chai.assert.equal(tmp['start'], 1);
    chai.assert.equal(tmp['end'], 2);
  })

})