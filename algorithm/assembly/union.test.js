import { fromPolygons as solidFromPolygons, translate as translateSolid } from '@jsxcad/algorithm-solid';
import { rotateZ as rotateSurface, scale as scaleSurface } from '@jsxcad/algorithm-surface';
import { unitCubePolygons, unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { test } from 'ava';
import { toPdf } from '@jsxcad/convert-pdf';
import { toSolid } from './toSolid';
import { toStl } from '@jsxcad/convert-stl';
import { toZ0Surface } from './toZ0Surface';
import { union } from './union';
import { writeFileSync } from 'fs';

test('Surface', t => {
  const unioned = union({ assembly: [{ z0Surface: [unitSquarePolygon] }] },
                        { z0Surface: scaleSurface([0.8, 0.8, 0.8], rotateSurface(Math.PI / 2, [unitRegularTrianglePolygon])) });

  writeFileSync('union.test.surface.pdf', toPdf({}, toZ0Surface({}, unioned)));
  t.deepEqual(canonicalize(unioned),
              { 'assembly': [{ 'z0Surface': [[[-0.69282, -0.4, 0], [-0.5, -0.4, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, -0.4, 0], [0.69282, -0.4, 0], [0.5, -0.06603, 0], [0.5, 0.5, 0], [0.17321, 0.5, 0], [0, 0.8, 0], [-0.1732, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.06603, 0]]] }] });
});

test('Solid', t => {
  const unioned = union({ solid: translateSolid([0.0, 0.0, 0.0], solidFromPolygons({}, unitCubePolygons)) },
                        { solid: translateSolid([0.2, 0.2, 0.2], solidFromPolygons({}, unitCubePolygons)) },
                        { solid: translateSolid([0.4, 0.4, 0.4], solidFromPolygons({}, unitCubePolygons)) });

  writeFileSync('union.test.solid.stl', toStl({}, toSolid({}, unioned)));
  t.deepEqual(canonicalize(unioned),
              {});
});
