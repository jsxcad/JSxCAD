import { canonicalize } from '@jsxcad/geometry-tagged';
import { fromSvgPath } from './fromSvgPath';
import fs from 'fs';
import test from 'ava';
import { toPdf } from '@jsxcad/convert-pdf';

const { readFile } = fs.promises;

// TODO: Add colinear point simplification.

test('Parse an open triangle.', async t => {
  const svgPath = 'M200 100 L170.71067810058594 170.71067810058594 L100 200 L29.289321899414062 170.71067810058594 ' +
                  'L0 100 L29.289321899414062 29.289321899414062 L100 0 L170.71067810058594 29.289321899414062';
  const paths = canonicalize(fromSvgPath(new TextEncoder('utf8').encode(svgPath)));
  t.is(new TextDecoder('utf8').decode(await toPdf(paths)),
       await readFile('test.fromSvgPath.open-polyline.pdf', { encoding: 'utf8' }));
});

test('Parse a closed triangle.', async t => {
  const svgPath = 'M200 100 L170.71067810058594 170.71067810058594 L100 200 L29.289321899414062 170.71067810058594 ' +
                  'L0 100 L29.289321899414062 29.289321899414062 L100 0 L170.71067810058594 29.289321899414062 Z';
  const paths = canonicalize(fromSvgPath(new TextEncoder('utf8').encode(svgPath)));
  t.is(new TextDecoder('utf8').decode(await toPdf(paths)),
       await readFile('test.fromSvgPath.closed-polyline.pdf', { encoding: 'utf8' }));
});

test('Parse a circle with a hole.', async t => {
  const svgPath = 'M 950,81 A 107,107 0 0,1 950,295 A 107,107 0 0,1 950,81 z ' +
                  'M 950,139 A 49,49 0 0,0 950,237 A 49,49 0 0,0 950,139 z';
  const paths = canonicalize(fromSvgPath(new TextEncoder('utf8').encode(svgPath)));
  t.is(new TextDecoder('utf8').decode(await toPdf(paths)),
       await readFile('test.fromSvgPath.circle-hole.pdf', { encoding: 'utf8' }));
});
