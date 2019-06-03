import { cube } from './cube';
import { cylinder } from './cylinder';
import { difference } from './difference';
import { intersection } from './intersection';
import { union } from './union';

/**
 *
 * # Micro Gear Motor
 *
 * ::: illustration { "view": { "position": [40, 40, 80], "target": [-15, -15, 0] } }
 * ```
 * microGearMotor()
 * ```
 * :::
 *
 **/

const flatShaft = ({ diameter, length, flatLength, flatOffset, play }) =>
  difference(
    cylinder({ diameter: diameter + play,
               height: length + play * 2 }),
    cube(diameter + play * 2, diameter + play * 2, flatLength)
        .translate([diameter - 0.5, 0, (length - flatLength) / -2 + flatOffset]));

const motor = ({ play, motorWidth }) =>
  intersection(cylinder({ diameter: 12 + play, height: 15 + play }),
               cube(10 + play * 2, motorWidth + play * 2, 15));

const terminal = () => cube(5, 12, 2);

const gearbox = ({ play, motorWidth }) => cube(10 + play * 2, motorWidth + play * 2, 10).translate(0, 0, (15 + 10) / 2);

export const microGearMotor = ({ play = 0.2, shaftDiameter = 3.2, shaftPlay = 0, motorWidth = 12 } = {}) =>
  union(motor({ play, motorWidth }),
        gearbox({ play, motorWidth }),
        flatShaft({ diameter: shaftDiameter, length: 10 + play * 2, flatLength: 7, flatOffset: 3, play: shaftPlay }).translate([0, 0, (15 + 10) / 2 + 10]),
        terminal().translate([0, 0, (15 + 2) / -2]));
