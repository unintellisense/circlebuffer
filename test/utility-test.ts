import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';

const assert = chai.assert;

describe('iterator  tests', () => {


  it('empty', () => {
    let tmp = new CircularBuffer(3, [1, 2, 3]);
    tmp.empty();
    assert.equal(tmp['length'], 0);
  })

  it('fill', () => {
    let tmp = new CircularBuffer(3);
    tmp.fill(1);
    assert.deepEqual(tmp.toArray(), [1, 1, 1]);
  })

  it('first', () => {
    let tmp = new CircularBuffer(3, [1, 2, 3]);
    assert.equal(tmp.first(), 1);
  })

  it('last', () => {
    let tmp = new CircularBuffer(3, [1, 2, 3]);
    assert.equal(tmp.last(), 3);
  })

  it('get', () => {
    let tmp = new CircularBuffer(3, [1, 2, 3]);
    assert.equal(tmp.get(2), 3);
  })

  it('set', () => {
    let tmp = new CircularBuffer(3, [1, 2, 3]);
    tmp.set(1, 2);
    assert.equal(tmp.get(1), 2);
  })

  it('toArray', () => {
    assert.ok(new CircularBuffer(1).toArray() instanceof Array);
  })
  it('overflow', () => {

    let tmp = new CircularBuffer(5, [1, 2, 3, 4, 5]);
    let expected: number = 1;
    tmp.overflow = (val, buff) => assert.equal(val, expected)
    tmp.push(6);
    expected++;
    tmp.push(7);
    expected++;
    tmp.push(8);
  })


})