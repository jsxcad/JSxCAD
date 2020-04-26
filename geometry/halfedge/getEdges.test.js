import fromPolygons from './fromPolygons';
import getEdges from './getEdges';
import test from 'ava';

test('Simple', t => {
  const loops = fromPolygons([['a', 'b', 'c', 'd']], _ => _);
  const polygon = [];
  for (const edge of getEdges(loops[0])) {
    polygon.push(edge.start);
  }
  t.deepEqual(polygon, ['a', 'b', 'c', 'd']);
});
