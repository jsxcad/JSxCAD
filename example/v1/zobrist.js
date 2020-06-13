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

const zobristSpecifications = [
  {
    name: 'A',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [2, 0, 0],
      [2, 0, 1],
    ],
    color: 'red',
  },
  {
    name: 'B',
    positions: [
      [0, 0, 1],
      [1, 0, 1],
      [1, 1, 1],
      [2, 1, 1],
      [2, 1, 0],
    ],
    color: 'yellow',
    rotation: [[1, 1, 1], [1, 0, 0], 180],
  },
  {
    name: 'C',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [2, 0, 0],
      [2, 1, 0],
      [2, 1, 1],
    ],
    color: 'yellow',
  },
  {
    name: 'D',
    positions: [
      [0, 0, 0],
      [2, 0, 1],
      [1, 0, 0],
      [2, 1, 0],
      [2, 0, 0],
    ],
    color: 'yellow',
  },
  {
    name: 'E',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [2, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
    ],
    color: 'yellow',
  },
  {
    name: 'F',
    positions: [
      [0, 1, 0],
      [1, 1, 0],
      [2, 1, 0],
      [2, 0, 0],
      [2, 0, 1],
    ],
    color: 'blue',
  },
  {
    name: 'G',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 1],
      [2, 0, 1],
    ],
    color: 'blue',
    rotation: [[1, 1, 1], [1, 0, 0], 90],
  },
  {
    name: 'H',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [2, 0, 0],
      [0, 0, 1],
    ],
    color: 'blue',
  },
  {
    name: 'I',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
      [2, 1, 0],
    ],
    color: 'yellow',
  },
  {
    name: 'J',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [2, 1, 0],
      [2, 1, 1],
    ],
    color: 'red',
  },
  {
    name: 'K',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
      [2, 1, 1],
    ],
    color: 'blue',
  },
  {
    name: 'L',
    positions: [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
      [1, 0, 1],
      [2, 0, 1],
    ],
    color: 'red',
  },
  {
    name: 'M',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 1],
      [2, 0, 0],
    ],
    color: 'red',
  },
  {
    name: 'N',
    positions: [
      [0, 0, 0],
      [0, 0, 1],
      [1, 0, 1],
      [2, 0, 1],
      [2, 1, 1],
    ],
    color: 'blue',
    rotation: [[1, 1, 1], [1, 0, 0], 180],
  },
  {
    name: 'O',
    positions: [
      [0, 0, 0],
      [0, 0, 1],
      [1, 0, 0],
      [2, 0, 0],
      [2, 1, 0],
    ],
    color: 'red',
  },
  {
    name: 'R',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
    ],
    color: 'green',
  },
  {
    name: 'S',
    positions: [
      [0, 0, 0],
      [0, 0, 1],
      [1, 0, 0],
      [1, 1, 0],
    ],
    color: 'white',
  },
  {
    name: 'T',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [2, 0, 0],
      [2, 1, 0],
    ],
    color: 'green',
  },
  {
    name: 'U',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [2, 0, 0],
    ],
    color: 'green',
  },
  {
    name: 'V',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [2, 1, 0],
    ],
    color: 'white',
  },
  {
    name: 'W',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 1],
    ],
    color: 'white',
  },
  {
    name: 'Z',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ],
    color: 'white',
  },
  {
    name: '2',
    positions: [
      [0, 0, 0],
      [1, 0, 0],
    ],
    color: 'white',
  },
  { name: '1', positions: [[0, 0, 0]], color: 'white' },
];

// const unitZobristCube = cube({ roundRadius: 0.03, resolution: 80 });
// const unitZobristCube = cube({ roundRadius: 0.03, resolution: 20 });
// const unitZobristCube = cube({ roundRadius: 0.03, resolution: 30 });
// const unitZobristCube = cube({ roundRadius: 0.03, resolution: 25 });
const unitZobristCube = cube({ roundRadius: 0.03, resolution: 5 });

const zobristCube = ({ name, positions, color, rotation }) =>
  union(...positions.map((position) => unitZobristCube.translate(position)));

const zobristCubes = (specifications) => {
  const cubes = [];
  for (let nth = 0; nth < zobristSpecifications.length; nth++) {
    const x = nth % 8;
    const y = Math.floor(nth / 8);
    cubes.push(
      zobristCube(zobristSpecifications[nth]).translate([x * 5, y * 5])
    );
  }
  return union(...cubes);
};

const scaledCubes = zobristCubes().scale([10, 10, 10]);

await scaledCubes.writeStl('tmp/zobrist.stl');
await scaledCubes.writeThreejsPage({
  view: { position: [0, 0, 120], path: 'tmp/zobrist.html' },
});
