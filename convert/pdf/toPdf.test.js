import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import test from 'ava';
import { toPdf } from './toPdf';

test('Triangle', async t => {
  // A surface is a set of paths.
  const pdf = await toPdf({ tags: ['color/blue'], paths: buildRegularPolygon(3).z0Surface });
  t.is(pdf,
       ['%PDF-1.5',
        '1 0 obj << /Pages 2 0 R /Type /Catalog >> endobj',
        '2 0 obj << /Count 1 /Kids [ 3 0 R ] /Type /Pages >> endobj',
        '3 0 obj <<',
        '  /Contents 4 0 R',
        '  /MediaBox [ 0.000000000 0.000000000 595.275590176 841.889763249 ]',
        '  /TrimBox [ 14.173228338 14.173228338 581.102361839 827.716534912 ]',
        '  /Parent 2 0 R',
        '  /Type /Page',
        '>>',
        'endobj',
        '4 0 obj << >>',
        'stream',
        '0.096000000 w',
        '0.000000000 0.000000000 1.000000000 RG',
        '300.472440756 420.944881625 m',
        '296.220472254 423.399756783 l',
        '296.220472254 418.490006466 l',
        'h',
        'S',
        'endstream',
        'endobj',
        'trailer << /Root 1 0 R /Size 4 >>',
        '%%EOF'].join('\n'));
});

test('Triangle with a custom page size', async t => {
  // A surface is a set of paths.
  const pdf = await toPdf({ paths: buildRegularPolygon(3).z0Surface }, { size: [100, 200] });
  t.is(pdf,
       ['%PDF-1.5',
        '1 0 obj << /Pages 2 0 R /Type /Catalog >> endobj',
        '2 0 obj << /Count 1 /Kids [ 3 0 R ] /Type /Pages >> endobj',
        '3 0 obj <<',
        '  /Contents 4 0 R',
        '  /MediaBox [ 0.000000000 0.000000000 283.464566751 566.929133501 ]',
        '  /TrimBox [ 14.173228338 14.173228338 269.291338413 552.755905164 ]',
        '  /Parent 2 0 R',
        '  /Type /Page',
        '>>',
        'endobj',
        '4 0 obj << >>',
        'stream',
        '0.096000000 w',
        '0.000000000 0.000000000 0.000000000 RG',
        '144.566929043 283.464566751 m',
        '140.314960542 285.919441909 l',
        '140.314960542 281.009691592 l',
        'h',
        'S',
        'endstream',
        'endobj',
        'trailer << /Root 1 0 R /Size 4 >>',
        '%%EOF'].join('\n'));
});
