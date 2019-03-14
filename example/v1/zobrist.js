import { cube, union, writeStl } from '@jsxcad/api-v1';

/**
* A zobrist is a pattern within a 3x3x3 grid, with letters on the medial faces, a dot on the lower face, and a smile
* on the upper face. The patterns used are fully connected, and have a maximum height of two cubes.
* We can represent the patterns using an array of strings, like so
* " l " +
* "bl " +
* "u  "
* Where 'l' shows a block in the lower position, 'u' in the upper, and 'b' shows blocks in both lower and upper
* posiions.
*/

const unitZobristCube = cube({ roundRadius: 0.03, resolution: 80 });
const zobristCube = () => unitZobristCube;

const zobrist = (pattern) => {
  const cubes = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      switch (pattern[x + y * 3]) {
        case 'l': cubes.push(zobristCube().translate([x, y, 0]));
          break;
        case 'u': cubes.push(zobristCube().translate([x, y, 1]));
          break;
        case 'b': cubes.push(zobristCube().translate([x, y, 0]));
          cubes.push(zobristCube().translate([x, y, 1]));
          break;
        default: continue;
      }
    }
  }
  return union(cubes);
};

writeStl({ path: '/tmp/zobrist.stl' },
         zobrist(' l ' +
                 'bl ' +
                 'u  ').scale([30, 30, 30]));
