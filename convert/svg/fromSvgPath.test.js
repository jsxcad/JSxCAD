import { boot } from '@jsxcad/sys';
import { fromSvgPath } from './fromSvgPath.js';
import fs from 'fs';
import test from 'ava';
import { toSvg } from './toSvg.js';

const { readFile, writeFile } = fs.promises;

test.beforeEach(async (t) => {
  await boot();
});

// TODO: Add colinear point simplification.

test('Parse an open triangle.', async (t) => {
  const svgPath =
    'M200 100 L170.71067810058594 170.71067810058594 L100 200 L29.289321899414062 170.71067810058594 ' +
    'L0 100 L29.289321899414062 29.289321899414062 L100 0 L170.71067810058594 29.289321899414062';
  const geometry = fromSvgPath(new TextEncoder('utf8').encode(svgPath), {
    normalizeCoordinateSystem: true,
  });
  const svg = await toSvg(geometry);
  await writeFile('out.open_path.svg', svg);
  t.is(
    new TextDecoder('utf8').decode(svg),
    await readFile('test.open_path.svg', { encoding: 'utf8' })
  );
});

test('Parse a closed triangle.', async (t) => {
  const svgPath =
    'M200 100 L170.71067810058594 170.71067810058594 L100 200 L29.289321899414062 170.71067810058594 ' +
    'L0 100 L29.289321899414062 29.289321899414062 L100 0 L170.71067810058594 29.289321899414062 Z';
  const geometry = fromSvgPath(new TextEncoder('utf8').encode(svgPath));
  const svg = await toSvg(geometry);
  await writeFile('out.closed_path.svg', svg);
  t.is(
    new TextDecoder('utf8').decode(svg),
    await readFile('test.closed_path.svg', { encoding: 'utf8' })
  );
});

test('Parse a circle with a hole.', async (t) => {
  const svgPath =
    'M 950,81 A 107,107 0 0,1 950,295 A 107,107 0 0,1 950,81 z ' +
    'M 950,139 A 49,49 0 0,0 950,237 A 49,49 0 0,0 950,139 z';
  const geometry = fromSvgPath(new TextEncoder('utf8').encode(svgPath));
  const svg = await toSvg(geometry);
  await writeFile('out.circle_with_hole_path.svg', svg);
  t.is(
    new TextDecoder('utf8').decode(svg),
    await readFile('test.circle_with_hole_path.svg', { encoding: 'utf8' })
  );
});
