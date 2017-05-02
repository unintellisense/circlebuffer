import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('iterator  tests', () => {

  it('every items', () => {
    var tmp = new CircularBuffer(4, [1, 2, 3, 4]);
    chai.assert.ok(tmp.every(function (a) {
      return ~~a === a;
    }));

    chai.assert.ifError(tmp.every(function (a) {
      return a < 4;
    }));
  });

  it('foreach', () => {
    let tmp = new CircularBuffer(5, [0, 2, 4, 6, 8]);

    tmp.forEach((val, idx) => {
      chai.assert.equal(val, idx * 2);
    })
  })

  it('some', () => {
    let tmp = new CircularBuffer(5, [1, 2, 3, 4, 5]);

    chai.assert.equal(tmp.some((val, idx) => val > 6), false);
    chai.assert.equal(tmp.some((val, idx) => val > 1), true);
    chai.assert.equal(new CircularBuffer(5, [7]).some((val, idx) => val > 6), true);
  })

  it('calculate sum', () => {
    let tmp = new CircularBuffer(4, [1, 2, 3, 4]);
    chai.assert.equal(tmp.sum(), 10);
  })

  it('Calculate sum on zero items', () => {
    let tmp = new CircularBuffer(10);
    chai.assert.equal(tmp.sum(), 0);
  })

  it('Calculate average', () => {
    let tmp = new CircularBuffer(4, [1, 2, 3, 4]);
    chai.assert.equal(tmp.avg(), 2.5);
  })
  it('Calculate average on zero items(devision by zero)', () => {
    let tmp = new CircularBuffer(10);
    chai.assert.equal(tmp.avg(), 0);
  })


  it('Calculate median even buffer length', () => {
    let tmp = new CircularBuffer(4, [1, 2, 3, 4]);
    chai.assert.equal(tmp.median(), 2.5);
  })
  it('Calculate median uneven buffer length', () => {
    let tmp = new CircularBuffer(3, [1, 2, 3]);
    chai.assert.equal(tmp.median(), 2);
  })
  it('Calculate median on zero items(devision by zero)', () => {
    let tmp = new CircularBuffer(10);
    chai.assert.equal(tmp.median(), 0);
  })



})