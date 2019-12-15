import { decode } from './signature';
import test from 'ava';

test('Circle.ofApothem', t => {
  const decoded = decode('Circle.ofApothem(apothem:number = 1, { sides:number = 32 }) -> Shape');
  t.deepEqual(decoded,
              {
                operation: { namespace: 'Circle', name: 'ofApothem' },
                args: [{ name: 'apothem', type: 'number', value: '1' }],
                options: [{ name: 'sides', type: 'number', value: '32' }],
                outputType: 'Shape'
              });
});

test('Shape.color', t => {
  const decoded = decode('Shape -> .color(name:string) -> Shape');
  t.deepEqual(decoded,
              {
                inputType: 'Shape',
                operation: { name: 'color', isMethod: true },
                args: [{ name: 'name', type: 'string' }],
                outputType: 'Shape'
              });
});

test('union', t => {
  const decoded = decode('union(shape:Shape, ...shapes:Shape) -> Shape');
  t.deepEqual(decoded,
              {
                operation: { name: 'union' },
                args: [{ name: 'shape', type: 'Shape' }],
                rest: { name: 'shapes', type: 'Shape' },
                outputType: 'Shape'
              });
});

test('output', t => {
  const decoded = decode('Shape -> .writeStl(path:string, { size:number })');
  t.deepEqual(decoded,
              {
                inputType: 'Shape',
                operation: { name: 'writeStl', isMethod: true },
                args: [{ type: 'string', name: 'path' }],
                options: [{ name: 'size', type: 'number' }]
              });
});

test('options and rest', t => {
  const decoded = decode('foo({ size:number }, ...shapes:Shape)');
  t.deepEqual(decoded,
              {
                operation: { name: 'foo' },
                options: [{ name: 'size', type: 'number' }],
                rest: { name: 'shapes', type: 'Shape' }
              });
});
