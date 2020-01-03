import { Cylinder, Cube } from './jsxcad-api-v1-shapes.js';
import { assemble, Shape } from './jsxcad-api-v1-shape.js';

const Stud =
    (diameter = 5, height = 1.8,
     {
       play = 0.1,
       top = 0.5,
       expansion = 0.2
     } = {}) =>
      Cylinder.ofDiameter(diameter - play - expansion, height)
          .moveZ(height / 2)
          .with(Cylinder.ofDiameter(diameter - play, top)
              .moveZ(height - top / 2));

const StudSheet =
    (width = 32, length = 32, height = 1.8,
     {
       studDiameter = 5,
       studHeight = 1.8,
       studFaces = 32,
       studMarginX = 0,
       studMarginY = 0,
       play = 0.1
     } = {}) => {
      const studs = [];
      for (let x = 4 + studMarginX; x < width - studMarginX; x += 8) {
        for (let y = 4 + studMarginY; y < length - studMarginY; y += 8) {
          studs.push(Stud()
              .move(x - width / 2,
                    y - length / 2,
                    height / 2));
        }
      }
      return Cube(width - play * 2, length - play * 2, height)
          .with(...studs);
    };

const Socket =
    (diameter = 5.1, height = 1.8,
     {
       gripRingHeight = 0.4,
       gripRingContraction = 0.1,
       play = 0.0
     } = {}) => {
      // A stud is theoretically 1.7 mm tall.
      // We introduce a grip-ring from 0.5 to 1.2 mm (0.7 mm in height)
      const bottom = 0.5;
      const topHeight = height - gripRingHeight - bottom;
      return assemble(
        // flaired top
        Cylinder.ofDiameter(diameter + play, topHeight)
            .moveZ(topHeight / 2 + bottom + gripRingHeight),
        // grip ring
        Cylinder.ofDiameter(diameter + play - gripRingContraction, gripRingHeight)
            .moveZ(gripRingHeight / 2 + bottom),
        // flaired base
        Cylinder.ofDiameter(diameter + play, bottom)
            .moveZ(bottom / 2));
    };

const SocketSheet =
    (width = 32, length = 32, height = 1.8,
     {
       play = 0.1,
       studMarginX = 0,
       studMarginY = 0
     } = {}) => {
      const sockets = [];
      // We use a clipping box to give play on the perimeter.
      const box = Cube(width - play * 2, length - play * 2, height);
      for (let x = 4 + studMarginX; x < width - studMarginX; x += 8) {
        for (let y = 4 + studMarginY; y < length - studMarginY; y += 8) {
          sockets.push(
            Cube(8, 8, height)
                .with(Socket().moveZ(height / -2).drop())
                .move(x - width / 2, y - length / 2));
        }
      }
      return assemble(...sockets)
          .clip(box)
          .moveZ(height / -2);
    };

const AxleProfile = () =>
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

var Lego = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Stud: Stud,
  StudSheet: StudSheet,
  Socket: Socket,
  SocketSheet: SocketSheet,
  AxleProfile: AxleProfile
});

export default Lego;
export { AxleProfile, Socket, SocketSheet, Stud, StudSheet };