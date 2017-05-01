import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer shift tests', () => {
  it('shift items', () => {

    let tmp = new CircularBuffer<number>(3, [1, 2, 3]);
    chai.assert.equal(tmp.shift(), 1);
    chai.assert.deepEqual(tmp.toArray(), [2, 3]);

    tmp = new CircularBuffer<number>(3, [1, 2, 3]);
    tmp.push(4);
    chai.assert.equal(tmp.shift(), 2);
    chai.assert.deepEqual(tmp.toArray(), [3, 4]);
  })

  it('shift properties', () => {
    let tmp = new CircularBuffer<number>(3, [1, 2, 3]);
    tmp.shift();
    chai.assert.equal(tmp['length'], 2);
    chai.assert.equal(tmp['start'], 1);
    chai.assert.equal(tmp['end'], 2);


    tmp = new CircularBuffer<number>(3, [1, 2, 3]);

    tmp.push(4);
    tmp.shift();
    chai.assert.equal(tmp['length'], 2);
    chai.assert.equal(tmp['start'], 2);
    chai.assert.equal(tmp['end'], 0);
  })

})