import { Cube } from './Cube';
import { Cylinder } from './Cylinder';
import { Triangle } from './Triangle';
import { assemble } from './assemble';
import { assertNumber } from './assert';
import { dispatch } from './dispatch';
import { intersection } from './intersection';
import { lathe } from './lathe';

/**
 *
 * # Threaded Rod
 *
 **/

const buildThread = ({ radius = 1, height = 1, pitch = 1, sides = 16 }) => {
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

const buildRod = ({ radius = 1, height = 1, sides = 16 }) =>
  Cylinder({ radius, height, sides });

const fromRadius = ({ radius = 1, height = 1, pitch = 1, sides = 16, play = 0, bore }) => {
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

export const ThreadedRod = dispatch(
  'ThreadedRod',
  // cube()
  (radius, height = 1, sides = 16, bore) => {
    assertNumber(radius);
    assertNumber(height);
    assertNumber(sides);
    return () => fromRadius({ radius, height, sides, bore });
  });
