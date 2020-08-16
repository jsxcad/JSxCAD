import fs from 'fs';
import test from 'ava';
import { toGcode } from './toGcode.js';
import { unitRegularTrianglePolygon } from '@jsxcad/data-shape';

const { readFile } = fs.promises;

test('Spindle Triangle', async (t) => {
  const code = await toGcode(
    {
      type: 'paths',
      paths: [unitRegularTrianglePolygon],
    },
    { toolType: 'spindle', spindleRpm: 7000, feedRate: 500 }
  );
  const expected = await readFile('spindle_triangle.gcode', {
    encoding: 'utf8',
  });
  t.deepEqual(new TextDecoder('utf8').decode(code), expected);
});

test('Constant Laser Triangle', async (t) => {
  const code = await toGcode(
    {
      type: 'paths',
      paths: [unitRegularTrianglePolygon],
    },
    { toolType: 'constantLaser', laserPower: 1000, feedRate: 10000 }
  );
  const expected = await readFile('constant_laser_triangle.gcode', {
    encoding: 'utf8',
  });
  t.deepEqual(new TextDecoder('utf8').decode(code), expected);
});

test('Dynamic Laser Triangle', async (t) => {
  const code = await toGcode(
    {
      type: 'paths',
      paths: [unitRegularTrianglePolygon],
    },
    { toolType: 'dynamicLaser', laserPower: 1000, feedRate: 10000 }
  );
  const expected = await readFile('dynamic_laser_triangle.gcode', {
    encoding: 'utf8',
  });
  t.deepEqual(new TextDecoder('utf8').decode(code), expected);
});
