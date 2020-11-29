import { fromShapefile } from './fromShapefile.js';
import fs from 'fs';
import test from 'ava';

const { readFile } = fs.promises;

test('Boolean Properties', async (t) => {
  const shp = await readFile('boolean-property.shp');
  const dbf = await readFile('boolean-property.dbf');
  const data = await fromShapefile(shp, dbf);
  t.deepEqual(data, {
    type: 'assembly',
    content: [
      {
        type: 'points',
        points: [[1, 2, 0]],
        tags: ['user/shapefile/foo/null'],
      },
      {
        type: 'points',
        points: [[3, 4, 0]],
        tags: ['user/shapefile/foo/true'],
      },
      {
        type: 'points',
        points: [[5, 6, 0]],
        tags: ['user/shapefile/foo/true'],
      },
      {
        type: 'points',
        points: [[7, 8, 0]],
        tags: ['user/shapefile/foo/false'],
      },
      {
        type: 'points',
        points: [[9, 10, 0]],
        tags: ['user/shapefile/foo/false'],
      },
      {
        type: 'points',
        points: [[11, 12, 0]],
        tags: ['user/shapefile/foo/true'],
      },
      {
        type: 'points',
        points: [[13, 14, 0]],
        tags: ['user/shapefile/foo/true'],
      },
      {
        type: 'points',
        points: [[15, 16, 0]],
        tags: ['user/shapefile/foo/false'],
      },
      {
        type: 'points',
        points: [[17, 18, 0]],
        tags: ['user/shapefile/foo/false'],
      },
    ],
    tags: [],
  });
});
