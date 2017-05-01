import { CircularBuffer } from '../src/circularBuffer'
import * as chai from 'chai';


describe('circularBuffer basic tests', () => {

  it('is instantiated', () => {
    chai.assert(new CircularBuffer(1) instanceof CircularBuffer);
    chai.assert(new CircularBuffer(3, [1, 2, 3]) instanceof CircularBuffer);
  });

  it(' has correct data', () => {
    chai.assert.deepEqual(new CircularBuffer<any>(3)['data'], [, ,]);
    chai.assert.deepEqual(new CircularBuffer(3, [1, 2, 3])['data'], [1, 2, 3]);
  })

  it(' has correct end value', () => {
    chai.assert(new CircularBuffer(3)['end'] === 2);
    chai.assert(new CircularBuffer(3, [1, 2, 3])['end'] === 2);
  })

  it(' has correct length value', () => {
    chai.assert(new CircularBuffer(3)['length'] === 0);
    chai.assert(new CircularBuffer(3, [1, 2, 3])['length'] === 3);
  })

  it(' has correct size value', () => {
    chai.assert(new CircularBuffer(3)['size'] === 3);
    chai.assert(new CircularBuffer(3, [1, 2, 3])['size'] === 3);
  })

  it(' has correct start value', () => {
    chai.assert(new CircularBuffer(3)['start'] === 0);
    chai.assert(new CircularBuffer(3, [1, 2, 3])['start'] === 0);
  })

})


