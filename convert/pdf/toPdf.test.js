import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import { toPdf } from './toPdf';
import { test } from 'ava';

test('Triangle', t => {
  // A polygon is a path.
  const pdf = toPdf({}, { paths: [buildRegularPolygon({ edges: 3 })] });
  t.is(pdf,
       ['%PDF-1.5',
        '1 0 obj << /Pages 2 0 R /Type /Catalog >> endobj',
        '2 0 obj << /Count 1 /Kids [ 3 0 R ] /Type /Pages >> endobj',
        '3 0 obj <<',
        '  /Contents 4 0 R',
        '  /MediaBox [ 0 0 595.275590176 841.889763249 ]',
        '  /Parent 2 0 R',
        '  /Type /Page',
        '>>',
        'endobj',
        '4 0 obj << >>',
        'stream',
        '0.096000000 w',
        '4.251968501 839.434888090 m',
        '0.000000000 841.889763249 l',
        '0.000000000 836.980012932 l',
        'h',
        'S',
        'endstream',
        'endobj',
        'trailer << /Root 1 0 R /Size 4 >>',
        '%%EOF'].join('\n'));
});
