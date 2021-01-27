import { outline, toDisjointGeometry } from '@jsxcad/geometry-tagged';

import { equals } from '@jsxcad/math-vec3';
import { getEdges } from '@jsxcad/geometry-path';
import { toToolFromTags } from '@jsxcad/algorithm-tool';

const X = 0;
const Y = 1;
const Z = 2;

/** Checks for equality, ignoring z. */
const equalsXY = ([aX, aY], [bX, bY]) => equals([aX, aY, 0], [bX, bY, 0]);

/** Checks for equality, ignoring x and y */
const equalsZ = ([, , aZ], [, , bZ]) => equals([0, 0, aZ], [0, 0, bZ]);

// FIX: This is actually GRBL.
export const toGcode = async (
  geometry,
  {
    topZ = 0,
    jumpHeight = 1,
    definitions,
    calibrateLaserPower = 0,
    m4Wait = 0,
  } = {}
) => {
  const jumpZ = topZ + jumpHeight;

  const codes = [];
  const _ = undefined;

  // CHECK: Perhaps this should be a more direct modeling of the GRBL state?
  const state = {
    // Where is the tool
    position: [0, 0, 0],
    // How 'fast' the tool is running (rpm or power).
    speed: 0,
    laserMode: false,
  };

  const emit = (code) => codes.push(code);

  // Runs each axis at maximum velocity until matches, so may make dog-legs.
  const rapid = (
    x = state.position[X],
    y = state.position[Y],
    z = state.position[Z],
    f = state.tool.feedRate
  ) => {
    emit(`G0 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)}`);
    state.position = [x, y, z];
  };

  // Straight motion at set speed.
  const cut = (
    x = state.position[X],
    y = state.position[Y],
    z = state.position[Z],
    f = state.tool.feedRate
  ) => {
    setSpeed(state.tool.cutSpeed);
    emit(
      `G1 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)} F${f.toFixed(3)}`
    );
    state.position = [x, y, z];
  };

  const setSpeed = (value) => {
    if (state.speed !== value) {
      if (Math.sign(state.speed) !== Math.sign(value)) {
        if (value === 0) {
          // Stop
          emit('M5');
        } else if (value < 0) {
          // Reverse
          emit('M4');
          if (m4Wait > 0) {
            emit(`G4 P${m4Wait}`); // A little pause for the laser to wake up.
          }
        } else {
          // Forward
          emit('M3');
        }
      }
      emit(`S${Math.abs(value).toFixed(3)}`);
      state.speed = value;
    }
  };

  // Only use constant laser for calibration.
  const enableLaserMode = () => {
    if (state.laserMode !== true) {
      emit('$32=1');
      state.laserMode = true;
    }
  };

  const disableLaserMode = () => {
    if (state.laserMode !== true) {
      emit('$32=0');
      state.laserMode = false;
    }
  };

  const toolChange = (tool) => {
    if (state.tool && state.tool.type !== tool.type) {
      throw Error(
        `Unsupported tool type change: ${state.tool.type} to ${tool.type}`
      );
    }
    if (state.tool && state.tool.diameter !== tool.diameter) {
      throw Error(
        `Unsupported tool diameter change: ${state.tool.diameter} to ${tool.diameter}`
      );
    }
    // Accept tool change.
    state.tool = tool;
    switch (state.tool.type) {
      case 'laser':
        enableLaserMode();
        break;
      case 'spindle':
        disableLaserMode();
        break;
      default:
        throw Error(`Unknown tool: ${state.tool.type}`);
    }
  };

  /*
  const pause = () => {
    emit('M0');
  };

  const dwell = (seconds) => {
    emit(`G4 P${seconds * 1000}`);
  };
  */

  const raise = () => {
    rapid(_, _, jumpZ); // up
  };

  const jump = (x, y, speed = state.tool.jumpSpeed) => {
    raise();
    setSpeed(speed);
    rapid(x, y, jumpZ); // across
    rapid(x, y, topZ); // down
  };

  const park = () => {
    jump(0, 0, 0);
  };

  const useMetric = () => emit('G21');

  useMetric();

  if (calibrateLaserPower > 0) {
    emit('$32=0');
    emit('M3');
    emit(`S${calibrateLaserPower.toFixed(3)}`);
    emit('G1 X0 Y0 Z0 F1000');
    emit('M0');
    emit('M3');
  }

  // FIX: Should handle points as well as paths.
  for (const { tags, paths } of outline(toDisjointGeometry(geometry))) {
    toolChange(toToolFromTags('grbl', tags, definitions));
    for (const path of paths) {
      for (const [start, end] of getEdges(path)) {
        if (!equalsXY(start, state.position)) {
          // We assume that we can plunge or raise vertically without issue.
          // This avoids raising before plunging.
          // FIX: This whole approach is essentially wrong, and needs to consider if the tool can plunge or not.
          jump(...start);
        }
        if (!equalsZ(start, state.position)) {
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
