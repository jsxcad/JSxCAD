import { fromShapefile } from './fromShapefile';
import fs from 'fs';
import test from 'ava';

const { readFile } = fs.promises;

test('Boolean Properties', async t => {
  const shp = await readFile('boolean-property.shp');
  const dbf = await readFile('boolean-property.dbf');
  const data = await fromShapefile({}, shp, dbf);
console.log(`QQ/1: ${JSON.stringify(data)}`);
  t.deepEqual(data, {"assembly":[{"points":[[1,2,0]],"tags":[]},{"points":[[3,4,0]],"tags":[]},{"points":[[5,6,0]],"tags":[]},{"points":[[7,8,0]],"tags":[]},{"points":[[9,10,0]],"tags":[]},{"points":[[11,12,0]],"tags":[]},{"points":[[13,14,0]],"tags":[]},{"points":[[15,16,0]],"tags":[]},{"points":[[17,18,0]],"tags":[]}],"tags":[]});
  return data;
});
