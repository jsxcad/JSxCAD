import { reallyQuantizeForSpace } from './reallyQuantizeForSpace.js';
import test from 'ava';

test('Quantization happens.', (t) => {
  t.not(reallyQuantizeForSpace(Math.PI), Math.PI);
  t.is(reallyQuantizeForSpace(Math.PI), 3.14159);
});
