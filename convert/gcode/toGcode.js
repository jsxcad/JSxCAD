import { getNonVoidPaths, toKeptGeometry } from '@jsxcad/geometry-tagged';

import { equals } from '@jsxcad/math-vec3';
import { getEdges } from '@jsxcad/geometry-path';

const X = 0;
const Y = 1;
const Z = 2;

/** Checks for equality, ignoring z. */
const equalsXY = ([aX, aY], [bX, bY]) => equals([aX, aY, 0], [bX, bY, 0]);

/** Checks for equality, ignoring x and y */
const equalsZ = ([, , aZ], [, , bZ]) => equals([0, 0, aZ], [0, 0, bZ]);

// https://shapeokoenthusiasts.gitbook.io/shapeoko-cnc-a-to-z/feeds-and-speeds-basics
// For a 3.175 mm tool
// soft plastic 0.05 ~ 0.13, soft wood 0.025 ~ 0.065, hard wood 0.013 ~ 0.025.
const fromMaterialToChipLoad = (material) => {
  switch (material) {
    case 'soft plastic':
      return 0.08;
    case 'soft wood':
      return 0.045;
    case 'hard wood':
      return 0.019;
    case 'unknown':
    default:
      return 0.05;
  }
};

const computeFeedRate = ({
  toolDiameter = 3.175,
  material = 'unknown',
  chipLoad = fromMaterialToChipLoad(material),
  fluteCount = 1,
  rpm = 7000,
  maxFeedRate = 800,
}) => Math.min(fluteCount * chipLoad * rpm, maxFeedRate);

export const toGcode = async (
  geometry,
  {
    origin = [0, 0, 0],
    topZ = 0,
    maxFeedRate = 800,
    minCutZ = -1,
    cutDepth = 0.1,
    material,
    jumpHeight = 1,
    toolDiameter,
    chipLoad,
    fluteCount,
    rpm = 7000,
    feedRate = computeFeedRate({
      toolDiameter,
      chipLoad,
      fluteCount,
      material,
      rpm,
      maxFeedRate,
    }),
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

  // Runs each axis at maximum velocity until matches, so may make dog-legs.
  const rapid = (
    x = position[X],
    y = position[Y],
    z = position[Z],
    f = feedRate
  ) => {
    emit(`G0 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)}`);
    position = [x, y, z];
  };

  // Straight motion at set speed.
  const cut = (
    x = position[X],
    y = position[Y],
    z = position[Z],
    f = feedRate
  ) => {
    emit(
      `G1 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)} F${f.toFixed(3)}`
    );
    position = [x, y, z];
  };

  const toolOn = () => (rpm > 0 ? emit(`M3 S${rpm.toFixed(3)}`) : emit(`M5`));
  const toolOff = () => emit('M5');

  const raise = () => {
    rapid(_, _, jumpZ); // up
  };

  const jump = (x, y) => {
    raise();
    rapid(x, y, jumpZ); // across
    rapid(x, y, topZ); // down
  };

  const park = () => {
    rapid(_, _, jumpZ); // up
    toolOff();
    rapid(0, 0, jumpZ); // across
    rapid(0, 0, topZ); // home
  };

  const useMetric = () => emit('G21');

  useMetric();
  raise();
  toolOn();

  for (const { paths } of getNonVoidPaths(toKeptGeometry(geometry))) {
    for (const path of paths) {
      for (const [start, end] of getEdges(path)) {
        if (start[Z] < minCutZ) {
          throw Error(`Attempting to cut below minCutZ`);
        }
        if (!equalsXY(start, position)) {
          // We assume that we can plunge or raise vertically without issue.
          // This avoids raising before plunging.
          // FIX: This whole approach is essentially wrong, and needs to consider if the tool can plunge or not.
          jump(...start);
        }
        if (!equalsZ(start, position)) {
          cut(...start); // cut down
        }
        cut(...end); // cut across
      }
    }
  }

  park();

  codes.push(``);
  return new TextEncoder('utf8').encode(codes.join('\n'));
};
