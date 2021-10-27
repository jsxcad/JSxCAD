import { outline, toDisjointGeometry } from '@jsxcad/geometry';

import KdBush from 'kdbush';

const TOOL_TYPES = ['dynamicLaser', 'constantLaser', 'plotter', 'spindle'];

const X = 0;
const Y = 1;
const Z = 2;

// FIX: This is actually GRBL.
export const toGcode = async (
  geometry,
  tool,
  { definitions, doPlan = true } = {}
) => {
  if (!tool) {
    throw Error('Tool not defined: Expected { grbl: {} }');
  }
  if (!tool.grbl) {
    throw Error('Non GRBL tool not supported: Expected { grbl: {} }');
  }
  if (!TOOL_TYPES.includes(tool.grbl.type)) {
    throw Error(
      `Tool type ${
        tool.grbl.type
      } not supported: Expected { grbl: { type: [${TOOL_TYPES.join(', ')}] } }`
    );
  }
  if (!tool.grbl.feedRate) {
    throw Error(
      `Tool feedRate not defined: Expected { grbl: { feedRate: <integer> } }`
    );
  }

  // const topZ = 0;
  const codes = [];

  // CHECK: Perhaps this should be a more direct modeling of the GRBL state?
  const state = {
    // Where is the tool
    x: 0,
    y: 0,
    z: 0,
    // How 'fast' the tool is running (rpm or power).
    s: 0,
    f: 0,
  };

  const emit = (code) => codes.push(code);

  const value = (v) => {
    let s = v.toFixed(3);
    // This could be more efficient.
    while (s.includes('.') && (s.endsWith('0') || s.endsWith('.'))) {
      s = s.substring(0, s.length - 1);
    }
    return s;
  };

  const pX = (x = state.x) => {
    if (x !== state.x) {
      return ` X${value(x)}`;
    } else {
      return '';
    }
  };

  const pY = (y = state.y) => {
    if (y !== state.y) {
      return ` Y${value(y)}`;
    } else {
      return '';
    }
  };

  const pZ = (z = state.z) => {
    if (z !== state.z) {
      return ` Z${value(z)}`;
    } else {
      return '';
    }
  };

  // Rapid Linear Motion
  const cG0 = ({
    x = state.x,
    y = state.y,
    z = state.z,
    f = state.f,
    s = state.s,
  } = {}) => {
    const code = `G0${pX(x)}${pY(y)}${pZ(z)}`;
    if (code === 'G0') {
      return;
    }
    emit(code);
    state.x = x;
    state.y = y;
    state.z = z;
  };

  // Cut
  const cG1 = ({
    x = state.x,
    y = state.y,
    z = state.z,
    f = state.f,
    s = state.s,
  } = {}) => {
    const code = `G1${pX(x)}${pY(y)}${pZ(z)}`;
    if (code === 'G1') {
      return;
    }
    emit(code);
    state.x = x;
    state.y = y;
    state.z = z;
  };

  const cS = ({ s = state.s } = {}) => {
    if (s !== state.s) {
      emit(`S${value(s)}`);
      state.s = s;
    }
  };

  const cF = ({ f = state.f } = {}) => {
    if (f !== state.f) {
      emit(`F${value(f)}`);
      state.f = f;
    }
  };

  /*
  // Pause
  const cPause = () => {
    emit('M0');
  };
*/

  const cut = ({ x, y, z }) => {
    cG1({ x, y, z });
  };

  const jump = ({ x, y }) => {
    if (x === state.x && y === state.y) {
      return;
    }
    cG0({ z: state.tool.jumpZ });
    cG0({ x, y });
  };

  const stop = () => {
    if (state.m !== 5 && state.tool.cutSpeed) {
      emit('M5');
      state.m = 5;
    }
  };

  const start = () => {
    if (state.m !== 3 && state.tool.cutSpeed) {
      emit('M3');
      state.m = 3;
    }
  };

  const park = () => {
    jump({ x: 0, y: 0 });
    stop();
  };

  const useMetric = () => emit('G21');

  useMetric();

  const computeDistance = ([x, y, z]) => {
    const dX = x - state.x;
    const dY = y - state.y;
    const cost = Math.sqrt(dX * dX + dY * dY) - z * 1000000;
    return cost;
  };

  state.tool = tool.grbl;

  cF({ f: state.tool.feedRate });
  cS({ s: state.tool.cutSpeed });
  start();

  {
    const seen = new Set();
    let pendingEdges = 0;
    const points = [];
    for (const { segments } of outline(toDisjointGeometry(geometry))) {
      for (const edge of segments) {
        // CHECK: Do outline segments have duplicates still?
        // Deduplicate edges.
        {
          const forward = JSON.stringify(edge);
          if (seen.has(forward)) {
            continue;
          } else {
            seen.add(forward);
          }
          const backward = JSON.stringify([...edge].reverse());
          if (seen.has(backward)) {
            continue;
          } else {
            seen.add(backward);
          }
        }
        points.push([edge[0], edge]);
        points.push([edge[1], edge]);
        pendingEdges += 1;
      }
    }

    const kd = new KdBush(
      points,
      (p) => p[0][0],
      (p) => p[0][1]
    );

    while (pendingEdges > 0) {
      const { x, y } = state;
      for (let range = 1; range < Infinity; range *= 2) {
        let bestStart;
        let bestEdge;
        let bestDistance = Infinity;
        for (const index of kd.within(x, y, range)) {
          const [start, edge] = points[index];
          if (edge.planned) {
            continue;
          }
          const distance = computeDistance(start);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestEdge = edge;
            bestStart = start;
          }
        }
        if (bestDistance === Infinity) {
          continue;
        }
        pendingEdges -= 1;
        bestEdge.planned = true;
        const bestEnd = bestEdge[0] === bestStart ? bestEdge[1] : bestEdge[0];
        jump({ x: bestStart[X], y: bestStart[Y] }); // jump to the start x, y
        cut({ x: bestStart[X], y: bestStart[Y], z: bestStart[Z] }); // may need to drill down to the start z
        cut({ x: bestEnd[X], y: bestEnd[Y], z: bestEnd[Z] }); // cut across
        break;
      }
    }
  }

  park();

  codes.push('');
  return new TextEncoder('utf8').encode(codes.join('\n'));
};
