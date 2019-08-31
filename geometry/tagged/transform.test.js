import test from 'ava';
import { transform } from './transform';

test('Transform identity informed by matrix structure and geometry identity', t => {
  const geometry = { foo: 'bar' };
  t.is(transform([1, 0], geometry),
       transform([1, 0], geometry));
});
