import { boot } from '@jsxcad/sys';
import test from 'ava';
import { toPdf } from './toPdf.js';

test.beforeEach(async (t) => {
  await boot();
});

const triangle = [
  [1, 0, 0],
  [-0.4999999999999998, 0.8660254037844387, 0],
  [-0.5000000000000004, -0.8660254037844385, 0],
];

test('Triangle', async (t) => {
  // A surface is a set of paths.
  const pdf = await toPdf({
    tags: ['color/blue'],
    type: 'paths',
    paths: [triangle],
  });
  t.is(
    new TextDecoder('utf8').decode(pdf),
    [
      '%PDF-1.5',
      '1 0 obj << /Pages 2 0 R /Type /Catalog >> endobj',
      '2 0 obj << /Count 1 /Kids [ 3 0 R ] /Type /Pages >> endobj',
      '3 0 obj <<',
      '  /Contents 4 0 R',
      '  /MediaBox [ -15.590551171 -16.628103496 17.007874005 16.628103496 ]',
      '  /TrimBox [ -1.417322834 -2.454875159 2.834645668 2.454875159 ]',
      '  /Parent 2 0 R',
      '  /Type /Page',
      '>>',
      'endobj',
      '4 0 obj << >>',
      'stream',
      '0.096000000 w',
      '0.000000000 0.000000000 1.000000000 RG',
      '3.834645668 1.000000000 m',
      '-0.417322834 3.454875159 l',
      '-0.417322834 -1.454875159 l',
      'h',
      'S',
      'endstream',
      'endobj',
      'trailer << /Root 1 0 R /Size 4 >>',
      '%%EOF',
    ].join('\n')
  );
});

test('Triangle with a custom page size', async (t) => {
  // A surface is a set of paths.
  const pdf = await toPdf(
    { type: 'paths', paths: [triangle] },
    { size: [100, 200] }
  );
  t.is(
    new TextDecoder('utf8').decode(pdf),
    [
      '%PDF-1.5',
      '1 0 obj << /Pages 2 0 R /Type /Catalog >> endobj',
      '2 0 obj << /Count 1 /Kids [ 3 0 R ] /Type /Pages >> endobj',
      '3 0 obj <<',
      '  /Contents 4 0 R',
      '  /MediaBox [ -15.590551171 -16.628103496 17.007874005 16.628103496 ]',
      '  /TrimBox [ -1.417322834 -2.454875159 2.834645668 2.454875159 ]',
      '  /Parent 2 0 R',
      '  /Type /Page',
      '>>',
      'endobj',
      '4 0 obj << >>',
      'stream',
      '0.096000000 w',
      '0.000000000 0.000000000 0.000000000 RG',
      '3.834645668 1.000000000 m',
      '-0.417322834 3.454875159 l',
      '-0.417322834 -1.454875159 l',
      'h',
      'S',
      'endstream',
      'endobj',
      'trailer << /Root 1 0 R /Size 4 >>',
      '%%EOF',
    ].join('\n')
  );
});
