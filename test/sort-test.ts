import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer sort tests', () => {
  it('sort items', () => {
    let tmp = new CircularBuffer(5, [7, 4, 5, 2, 1]);
    tmp.sort(function (a, b) { return a - b; });
    chai.assert.deepEqual(tmp.toArray(), [1, 2, 4, 5, 7]);

    let tmp2 = new CircularBuffer(3, ['a', 'c', 'b']);
    tmp2.sort();
    chai.assert.deepEqual(tmp2.toArray(), ['a', 'b', 'c']);

  })
})