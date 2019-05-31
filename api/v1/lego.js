import { assemble } from './assemble';
import { cube } from './cube';
import { cylinder } from './cylinder';
import { union } from './union';

/**
 *
 * # Lego
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * lego.stud()
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * lego.socket()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * lego.studSheet()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, -20] } }
 * ```
 * lego.socketSheet().drop('void')
 * ```
 * :::
 * FIX: Does not drop deep 'void'.
 * ::: illustration { "view": { "position": [20, 20, -30] } }
 * ```
 * assemble(cube(8, 8, 3.2).above().as('plate'),
 *          lego.socket().above().as('socket'))
 *   .drop('void')
 * ```
 * :::
 *
 **/

export const stud = ({ diameter = 5, height = 1.8, play = 0.1, faces = 32 } = {}) => {
  const top = 0.5;
  const expansion = 0.2;
  return assemble(cylinder({ diameter: diameter - play - expansion, height: height }).translate(0, 0, height / 2),
                  cylinder({ diameter: diameter - play, height: top }).translate(0, 0, height - top / 2)
  );
};

export const plate = () => cube(8, 8, 3.2);

export const studSheet = ({ width = 32, length = 32, height = 1.8, studDiameter = 5, studHeight = 1.8, studFaces = 32, studMarginX = 0, studMarginY = 0, play = 0.1 } = {}) => {
  const studs = [];
  for (let x = 4 + studMarginX; x < width - studMarginX; x += 8) {
    for (let y = 4 + studMarginY; y < length - studMarginY; y += 8) {
      studs.push(stud().translate([x - width / 2, y - length / 2, height / 2]));
    }
  }
  return assemble(cube(width - play * 2, length - play * 2, height), ...studs);
};

export const socket = ({ diameter = 5.1, height = 1.8, gripRingHeight = 0.4, gripRingContraction = 0.1, faces = 32, play = 0.0 } = {}) => {
  // A stud is theoretically 1.7 mm tall.
  // We introduce a grip-ring from 0.5 to 1.2 mm (0.7 mm in height)
  const bottom = 0.5;
  const topHeight = height - gripRingHeight - bottom;
  return union(
    // flaired top
    cylinder({ diameter: (diameter + play), height: topHeight }).translate([0, 0, topHeight / 2 + bottom + gripRingHeight]),
    // grip ring
    cylinder({ diameter: (diameter + play) - gripRingContraction, height: gripRingHeight }).translate([0, 0, gripRingHeight / 2 + bottom]),
    // flaired base
    cylinder({ diameter: (diameter + play), height: bottom }).translate([0, 0, bottom / 2]));
};

export const socketSheet = ({ width = 32, length = 32, height = 1.8, play = 0.1, studMarginX = 0, studMarginY = 0, stud = {} } = {}) => {
  const sockets = [];
  for (let x = 4 + studMarginX; x < width - studMarginX; x += 8) {
    for (let y = 4 + studMarginY; y < length - studMarginY; y += 8) {
      sockets.push(socket(stud).translate(x - width / 2, y - length / 2, height / -2));
    }
  }
  return assemble(cube(width - play * 2, length - play * 2, height),
                  assemble(...sockets).as('void'));
};

export const lego = {
  stud,
  socket,
  studSheet,
  socketSheet
};
