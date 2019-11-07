import { Cube } from './Cube';
import { Cylinder } from './Cylinder';
import { Shape } from './Shape';
import { assemble } from './assemble';

/**
 *
 * # Lego
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Lego.stud()
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Lego.socket()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Lego.studSheet()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, -20] } }
 * ```
 * Lego.socketSheet()
 * ```
 * :::
 * FIX: Does not drop deep 'void'.
 * ::: illustration { "view": { "position": [20, 20, -30] } }
 * ```
 * assemble(Cube(8, 8, 3.2).above().as('plate'),
 *          Lego.socket().above().as('socket'))
 * ```
 * :::
 *
 **/

export const stud = ({ diameter = 5, height = 1.8, play = 0.1, faces = 32 } = {}) => {
  const top = 0.5;
  const expansion = 0.2;
  return assemble(Cylinder({ diameter: diameter - play - expansion, height: height }).translate(0, 0, height / 2),
                  Cylinder({ diameter: diameter - play, height: top }).translate(0, 0, height - top / 2)
  );
};

export const plate = () => Cube(8, 8, 3.2);

export const studSheet = ({ width = 32, length = 32, height = 1.8, studDiameter = 5, studHeight = 1.8, studFaces = 32, studMarginX = 0, studMarginY = 0, play = 0.1 } = {}) => {
  const studs = [];
  for (let x = 4 + studMarginX; x < width - studMarginX; x += 8) {
    for (let y = 4 + studMarginY; y < length - studMarginY; y += 8) {
      studs.push(stud().translate([x - width / 2, y - length / 2, height / 2]));
    }
  }
  return assemble(Cube(width - play * 2, length - play * 2, height), ...studs);
};

export const socket = ({ diameter = 5.1, height = 1.8, gripRingHeight = 0.4, gripRingContraction = 0.1, faces = 32, play = 0.0 } = {}) => {
  // A stud is theoretically 1.7 mm tall.
  // We introduce a grip-ring from 0.5 to 1.2 mm (0.7 mm in height)
  const bottom = 0.5;
  const topHeight = height - gripRingHeight - bottom;
  return assemble(
    // flaired top
    Cylinder({ diameter: (diameter + play), height: topHeight }).translate([0, 0, topHeight / 2 + bottom + gripRingHeight]),
    // grip ring
    Cylinder({ diameter: (diameter + play) - gripRingContraction, height: gripRingHeight }).translate([0, 0, gripRingHeight / 2 + bottom]),
    // flaired base
    Cylinder({ diameter: (diameter + play), height: bottom }).translate([0, 0, bottom / 2]));
};

export const socketSheet = ({ width = 32, length = 32, height = 1.8, play = 0.1, studMarginX = 0, studMarginY = 0, stud = {} } = {}) => {
  const sockets = [];
  for (let x = 4 + studMarginX; x < width - studMarginX; x += 8) {
    for (let y = 4 + studMarginY; y < length - studMarginY; y += 8) {
      sockets.push(assemble(
        Cube(8, 8, height).above(),
        socket(stud).drop())
          .translate(x - width / 2, y - length / 2, height / -2));
    }
  }
  return assemble(...sockets);
};

export const axleProfile = () =>
  Shape.fromPathToSurface(
    [[2.24, 0.80, 0.00],
     [0.80, 0.80, 0.00],
     [0.80, 2.24, 0.00],
     [0.00, 2.4, 0.00],
     [-0.80, 2.24, 0.00],
     [-0.80, 0.80, 0.00],
     [-2.24, 0.80, 0.00],
     [-2.4, 0.00, 0.00],
     [-2.24, -0.80, 0.00],
     [-0.80, -0.80, 0.00],
     [-0.80, -2.24, 0.00],
     [0.00, -2.40, 0.00],
     [0.80, -2.24, 0.00],
     [0.80, -0.80, 0.00],
     [2.24, -0.80, 0.00],
     [2.4, 0.00, 0.00]]);

export const Lego = {
  stud,
  socket,
  studSheet,
  socketSheet,
  axleProfile
};
