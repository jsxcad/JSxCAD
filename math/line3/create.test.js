import { create } from './create.js';
import test from 'ava';

test('line3: create() should return a line3 with initial values', (t) => {
  const obs = create();
  const point = [0, 0, 0];
  const unit = [0, 0, 1];
  t.deepEqual(obs, [point, unit]);
});
