import { Group } from './Group.js';
import { Hershey } from './Hershey.js';
import { Segments } from './Segment.js';
import { align } from './align.js';
import { bb } from './bb.js';
import { cut } from './cut.js';
import { getInverseMatrices } from './tagged/getInverseMatrices.js';
import { ghost } from './ghost.js';
import { hasColor } from './hasColor.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import { section } from './section.js';
import { transform } from './transform.js';
import { translate } from './translate.js';

const X = 0;
const Y = 1;

export const Gauge = (
  geometry,
  refs,
  offset = 5,
  length = 0,
  color = 'green'
) => {
  const gauges = [];
  for (const ref of refs) {
    const { local, global } = getInverseMatrices(ref);
    const bounds = measureBoundingBox(section(transform(geometry, local)));
    if (bounds === undefined) {
      continue;
    }
    const [min, max] = bounds;
    const left = min[X];
    const right = max[X];
    const back = max[Y];
    const width = right - left;
    const base = back - length;
    const offsetBase = back + offset;
    const lines = Segments([
      [
        [left, base, 0],
        [left, offsetBase, 0],
      ],
      [
        [right, base, 0],
        [right, offsetBase, 0],
      ],
      [
        [left, offsetBase, 0],
        [right, offsetBase, 0],
      ],
    ]);
    const text = translate(
      align(
        Hershey(`${width.toFixed(1).replace(/\.0+$/, '')}`, width * 0.05),
        'xy'
      ),
      [(left + right) / 2, back + offset, 0]
    );
    const box = bb(text, offset);
    gauges.push(
      transform(Group([text, cut(lines, [box], { noGhost: true })]), global)
    );
  }
  return ghost(hasColor(Group(gauges), color));
};

export const gauge = (geometry, refs, offset, length, color) =>
  Group([geometry, Gauge(geometry, refs, offset, length, color)]);
