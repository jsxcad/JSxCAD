import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import { test } from 'ava';
import { toPdf } from './toPdf';

test('Triangle', async t => {
  // A polygon is a path.
  const pdf = await toPdf({}, { paths: [buildRegularPolygon({ edges: 3 })] });
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

test('Triangle with a custom page size', async t => {
  // A polygon is a path.
  const pdf = await toPdf({ size: [100, 200] }, { paths: [buildRegularPolygon({ edges: 3 })] });
  t.is(pdf,
       ['%PDF-1.5',
        '1 0 obj << /Pages 2 0 R /Type /Catalog >> endobj',
        '2 0 obj << /Count 1 /Kids [ 3 0 R ] /Type /Pages >> endobj',
        '3 0 obj <<',
        '  /Contents 4 0 R',
        '  /MediaBox [ 0 0 283.464566751 566.929133501 ]',
        '  /Parent 2 0 R',
        '  /Type /Page',
        '>>',
        'endobj',
        '4 0 obj << >>',
        'stream',
        '0.096000000 w',
        '4.251968501 564.474258342 m',
        '0.000000000 566.929133501 l',
        '0.000000000 562.019383184 l',
        'h',
        'S',
        'endstream',
        'endobj',
        'trailer << /Root 1 0 R /Size 4 >>',
        '%%EOF'].join('\n'));
});
