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

test('Complex', async (t) => {
  const pdf = await toPdf({
    type: 'layers',
    content: [
      {
        type: 'transform',
        matrix: [0.1, 0, 0, 0, 0, -0.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        content: [
          {
            type: 'paths',
            paths: [
              [
                [1, 1, 0],
                [1199, 1, 0],
                [1199, 399, 0],
                [1, 399, 0],
                [1, 1.28847, 0],
              ],
            ],
            tags: ['color/violet'],
          },
        ],
        tags: ['color/violet'],
      },
      {
        type: 'transform',
        matrix: [0.1, 0, 0, 0, 0, -0.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        content: [
          {
            type: 'graph',
            tags: ['color/yellow'],
            graph: {
              isClosed: false,
              isLazy: false,
              edges: [
                { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
                { point: 1, next: 7, twin: 0, facet: -1, face: -1 },
                { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
                { point: 2, next: 1, twin: 2, facet: -1, face: -1 },
                { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
                { point: 0, next: 12, twin: 4, facet: 2, face: 0 },
                { point: 3, next: 8, twin: 7, facet: 1, face: 0 },
                { point: 0, next: 11, twin: 6, facet: -1, face: -1 },
                { point: 0, next: 10, twin: 9, facet: 1, face: 0 },
                { point: 4, next: 5, twin: 8, facet: 2, face: 0 },
                { point: 4, next: 6, twin: 11, facet: 1, face: 0 },
                { point: 3, next: 13, twin: 10, facet: -1, face: -1 },
                { point: 2, next: 9, twin: 13, facet: 2, face: 0 },
                { point: 4, next: 3, twin: 12, facet: -1, face: -1 },
              ],
              points: [
                [400, 100.14496, 0],
                [400, 100, 0],
                [800, 100, 0],
                [400, 300, 0],
                [800, 300, 0],
              ],
              exactPoints: [
                ['400', '3523537535461197/35184372088832', '0'],
                ['400', '100', '0'],
                ['800', '100', '0'],
                ['400', '300', '0'],
                ['800', '300', '0'],
              ],
              faces: [
                {
                  plane: [0, 0, 1, 0],
                  exactPlane: ['0', '0', '127508164449925/2199023255552', '0'],
                },
              ],
              facets: [{ edge: 4 }, { edge: 10 }, { edge: 12 }],
            },
          },
        ],
        tags: ['color/yellow'],
      },
      {
        type: 'transform',
        matrix: [0.1, 0, 0, 0, 0, -0.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        content: [
          {
            type: 'paths',
            paths: [
              [
                [400, 100, 0],
                [800, 100, 0],
                [800, 300, 0],
                [400, 300, 0],
                [400, 100.14496, 0],
              ],
            ],
            tags: ['color/navy'],
          },
        ],
        tags: ['color/navy'],
      },
    ],
  });
  t.is(
    new TextDecoder('utf8').decode(pdf),
    `%PDF-1.5
1 0 obj << /Pages 2 0 R /Type /Catalog >> endobj
2 0 obj << /Count 1 /Kids [ 3 0 R ] /Type /Pages >> endobj
3 0 obj <<
  /Contents 4 0 R
  /MediaBox [ -13.889763771 -127.275590471 354.047243871 13.889763771 ]
  /TrimBox [ 0.283464567 -113.102362133 339.874015534 -0.283464567 ]
  /Parent 2 0 R
  /Type /Page
>>
endobj
4 0 obj << >>
stream
0.096000000 w
1.000000000 1.000000000 0.000000000 rg
1.000000000 1.000000000 0.000000000 RG
227.771653400 -27.346456675 m
227.771653400 -84.039370025 l
114.385826700 -84.039370025 l
114.385826700 -27.387547699 l
114.385826700 -27.346456675 l
h
f
0.933333333 0.509803922 0.933333333 RG
1.283464567 0.716535433 m
340.874015534 0.716535433 l
340.874015534 -112.102362133 l
1.283464567 -112.102362133 l
1.283464567 0.634764410 l
h
S
0.000000000 0.000000000 0.501960784 RG
114.385826700 -27.346456675 m
227.771653400 -27.346456675 l
227.771653400 -84.039370025 l
114.385826700 -84.039370025 l
114.385826700 -27.387547699 l
h
S
endstream
endobj
trailer << /Root 1 0 R /Size 4 >>
%%EOF`
  );
});
