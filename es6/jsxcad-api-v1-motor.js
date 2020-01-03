import { Cylinder, Cube } from './jsxcad-api-v1-shapes.js';
import { union, intersection, difference } from './jsxcad-api-v1-shape.js';

/**
 *
 * # Micro Gear Motor
 *
 * ::: illustration { "view": { "position": [40, 40, 80], "target": [-15, -15, 0] } }
 * ```
 * MicroGearMotor()
 * ```
 * :::
 *
 **/

const FlatShaft = ({ diameter, length, flatLength, flatOffset, play }) =>
  difference(
    Cylinder({ diameter: diameter + play,
               height: length + play * 2 }),
    Cube(diameter + play * 2, diameter + play * 2, flatLength)
        .move(diameter - 0.5, 0, (length - flatLength) / -2 + flatOffset));

const Motor = ({ play, motorWidth }) =>
  intersection(Cylinder({ diameter: 12 + play, height: 15 + play }),
               Cube(10 + play * 2, motorWidth + play * 2, 15));

const Terminal = () => Cube(5, 12, 2);

const Gearbox = ({ play, motorWidth }) => Cube(10 + play * 2, motorWidth + play * 2, 10).moveZ((15 + 10) / 2);

const MicroGearMotor = ({ play = 0.2, shaftDiameter = 3.2, shaftPlay = 0, motorWidth = 12 } = {}) =>
  union(Motor({ play, motorWidth }),
        Gearbox({ play, motorWidth }),
        FlatShaft({
          diameter: shaftDiameter,
          length: 10 + play * 2,
          flatLength: 7,
          flatOffset: 3,
          play: shaftPlay
        })
            .moveZ((15 + 10) / 2 + 10),
        Terminal()
            .moveZ((15 + 2) / -2));

var MicroGearMotor$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MicroGearMotor: MicroGearMotor,
  'default': MicroGearMotor
});

export default MicroGearMotor$1;
export { MicroGearMotor };
