import test from 'ava';
import { toPathnameFromUrl } from './toPathnameFromUrl.js';

test('Convert posix file url to absolute path', (t) => {
  const fileUrl = 'file:///JSxCAD/algorithm/cgal/getCgal.js';
  const path = toPathnameFromUrl(fileUrl);
  t.is(path, '/JSxCAD/algorithm/cgal/getCgal.js');
});

test('Convert windows file url to absolute path', (t) => {
  const fileUrl = 'file:///C:/JSxCAD/algorithm/cgal/getCgal.js';
  const path = toPathnameFromUrl(fileUrl);
  t.is(path, 'C:/JSxCAD/algorithm/cgal/getCgal.js');
});
