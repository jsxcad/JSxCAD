import { add, equals } from '@jsxcad/math-vec3';
import {
  getNonVoidPaths,
  toKeptGeometry,
  translate,
} from '@jsxcad/geometry-tagged';

import { getEdges } from '@jsxcad/geometry-path';

const X = 0;
const Y = 1;
const Z = 2;

const computeFeedRate = ({
  toolDiameter = 3.175,
  chipLoad = 0.1,
  fluteCount = 1,
  rpm = 7000,
}) => fluteCount * chipLoad * rpm;

export const toGcode = async (
  geometry,
  {
    origin = [0, 0, 0],
    topZ = 0,
    minCutZ = -1,
    cutDepth = 0.1,
    jumpHeight = 1,
    toolDiameter,
    chipLoad,
    fluteCount,
    rpm = 7000,
    feedRate = computeFeedRate({ toolDiameter, chipLoad, fluteCount, rpm }),
  } = {}
) => {
  if (!(feedRate > 0)) {
    throw Error(`Invalid feedRate: ${feedRate}`);
  }
  if (!(rpm > 0)) {
    throw Error(`Invalid rpm: ${rpm}`);
  }
  const jumpZ = topZ + jumpHeight;

  const codes = [];
  const _ = undefined;
  let position = [0, 0, 0];

  const emit = (code) => codes.push(code);

  const to = (
    x = position[X],
    y = position[Y],
    z = position[Z],
    g = 'G1',
    f = feedRate
  ) => {
    emit(
      `${g} X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)} F${f.toFixed(3)}`
    );
    position = [x, y, z];
  };

  // Runs each axis at maximum velocity until matches, so may make dog-legs.
  const rapid = (x, y, z) => to(x, y, z, 'G0');

  // Straight motion at set speed.
  const cut = (x, y, z) => {
    to(x, y, z, 'G1');
  };

  const toolOn = () => (rpm > 0 ? emit(`M3 S${rpm.toFixed(3)}`) : emit(`M5`));
  const toolOff = () => emit('M5');

  const jump = (x, y) => {
    rapid(_, _, jumpZ); // up
    rapid(x, y, jumpZ); // across
    rapid(x, y, topZ); // down
  };

  const home = () => {
    rapid(_, _, jumpZ); // up
    rapid(0, 0, jumpZ); // across
    rapid(0, 0, topZ); // home
  };

  const useMetric = () => emit('G21');

  useMetric();
  toolOn();

  // FIX: This is incorrect -- it should move the geometry down so that the top of the geometry is at the initial cutDepth.
  const keptGeometry = toKeptGeometry(
    translate(add(origin, [0, 0, -cutDepth]), await geometry)
  );
  for (const { paths } of getNonVoidPaths(keptGeometry)) {
    for (const path of paths) {
      for (const [start, end] of getEdges(path)) {
        if (start[Z] < minCutZ) {
          throw Error(`Attempting to cut below minCutZ`);
        }
        if (!equals(start, position)) {
          jump(...start);
          cut(...start); // cut down
        }
        cut(...end); // cut across
      }
    }
  }

  home();

  toolOff();

  codes.push(``);
  return new TextEncoder('utf8').encode(codes.join('\n'));
};
