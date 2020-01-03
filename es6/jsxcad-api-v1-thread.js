import { Cube, Cylinder, Triangle } from './jsxcad-api-v1-shapes.js';
import { assemble, intersection } from './jsxcad-api-v1-shape.js';
import { lathe } from './jsxcad-api-v1-extrude.js';

/**
 *
 * # Threaded Rod
 *
 **/

const buildThread = ({ radius = 1, height = 1, pitch = 1, sides = 16 } = {}) => {
  const thread = lathe({ loops: (height / pitch) + 2, loopOffset: pitch, sides },
                       Triangle()
                           .scale(pitch)
                           .rotateZ(90)
                           .move(0, radius));
  return intersection(Cube.fromCorners([0, -(radius + pitch), -(radius + pitch)],
                                       [height, radius + pitch, radius + pitch]),
                      thread.move(-pitch, 0, 0))
      .rotateY(-90)
      .center();
};

const buildRod = ({ radius = 1, height = 1, sides = 16 } = {}) =>
  Cylinder({ radius, height, sides });

const ofRadius = ({ radius = 1, height = 1, pitch = 1, sides = 16, play = 0, bore } = {}) => {
  const rod = assemble(
    buildThread({ radius: radius - play, height, pitch, sides }),
    buildRod({ radius: radius - play, height, sides }));
  if (bore) {
    return assemble(
      bore().drop(),
      rod.nocut());
  } else {
    return rod;
  }
};

const ThreadedRod = (...args) => ofRadius(...args);
ThreadedRod.ofRadius = ofRadius;

const api = { ThreadedRod };

export default api;
export { ThreadedRod };
