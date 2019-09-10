import { fromShapefile } from './fromShapefile';
import fs from 'fs';
import test from 'ava';

const { readFile } = fs.promises;

test('Boolean Properties', async t => {
  const shp = await readFile('boolean-property.shp');
  const dbf = await readFile('boolean-property.dbf');
  const data = await fromShapefile({}, shp, dbf);
  t.deepEqual(data, { 'assemble': [{ 'points': [[1, 2]] }, { 'points': [[3, 4]] }, { 'points': [[5, 6]] }, { 'points': [[7, 8]] }, { 'points': [[9, 10]] }, { 'points': [[11, 12]] }, { 'points': [[13, 14]] }, { 'points': [[15, 16]] }, { 'points': [[17, 18]] }] });
  return data;
});
