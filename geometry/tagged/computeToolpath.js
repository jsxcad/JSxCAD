import KdBush from 'kdbush';
import { fuse } from './fuse.js';
import { getQuery } from '../graph/getQuery.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { inset } from './inset.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import { outline } from './outline.js';
import { section } from './section.js';
import { taggedToolpath } from './taggedToolpath.js';

const X = 0;
const Y = 1;
const Z = 2;

export const computeToolpath = (geometry, toolDiameter = 1, jumpHeight = 1) => {
  const toolRadius = toolDiameter / 2;
  const toolpath = [];

  let at = [0, 0, 0];

  const computeDistance = ([x, y, z]) => {
    const dX = x - at[X];
    const dY = y - at[Y];
    const cost = Math.sqrt(dX * dX + dY * dY) - z * 1000000;
    return cost;
  };

  {
    const seen = new Set();
    let pendingEdges = 0;
    const points = [];

    const sections = section(geometry, identityMatrix);
    const fusedArea = fuse([sections]);
    const insetArea = inset(fusedArea, toolRadius);

    {
      const { isInteriorPoint, release } = getQuery(insetArea);
      const [minPoint, maxPoint] = measureBoundingBox(sections);
      const z = 0;
      const sqrt3 = Math.sqrt(3);
      const width = maxPoint[X] - minPoint[X];
      const offsetX = (maxPoint[X] + minPoint[X]) / 2 - width / 2;
      const height = maxPoint[Y] - minPoint[Y];
      const offsetY = (maxPoint[Y] + minPoint[Y]) / 2 - height / 2;
      const columns = width / ((sqrt3 / 2) * toolRadius) + 1;
      const rows = height / (toolRadius * 0.75);
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = offsetX + (i + (j % 2 ? 0.5 : 0)) * sqrt3 * toolRadius;
          const y = offsetY + j * toolRadius * 0.75;
          // FIX: We need to produce an affinity with each distinct contiguous area.
          if (isInteriorPoint(x, y, z)) {
            const point = [x, y, z];
            point.type = 'fill';
            const edge = [point, point];
            // FIX: This should form an edge to any point within a tool-radius in the same contiguous area.
            points.push([edge[0], edge]);
            pendingEdges += 1;
          }
        }
      }
      release();
    }

    for (const { segments } of outline(insetArea)) {
      for (const edge of segments) {
        // CHECK: Do outline segments have duplicates still?
        // Deduplicate edges.
        {
          const forward = JSON.stringify(edge);
          if (seen.has(forward)) {
            continue;
          } else {
            seen.add(forward);
          }
          const backward = JSON.stringify([...edge].reverse());
          if (seen.has(backward)) {
            continue;
          } else {
            seen.add(backward);
          }
        }
        const start = [...edge[0]];
        start.type = 'edge';
        const end = [...edge[1]];
        end.type = 'edge';
        const path = [start, end];
        points.push([start, path], [end, path]);
        pendingEdges += 1;
      }
    }

    const kd = new KdBush(
      points,
      (p) => p[0][0],
      (p) => p[0][1]
    );

    const jump = (to) => {
      if (to[X] === at[X] && to[Y] === at[Y]) {
        return;
      }
      const up = [at[X], at[Y], jumpHeight];
      toolpath.push({ op: 'jump', from: [...at], to: [...up] });

      const across = [to[X], to[Y], jumpHeight];
      toolpath.push({ op: 'jump', from: [...up], to: [...across] });

      at = across;
    };

    const cut = (to) => {
      if (to[X] === at[X] && to[X] === at[Y] && to[Z] === at[Z]) {
        return;
      }
      toolpath.push({ op: 'cut', from: [...at], to: [...to] });
      at = to;
    };

    try {
      while (pendingEdges > 0) {
        const [x, y] = at;
        for (let range = 1; range < Infinity; range *= 2) {
          let bestStart;
          let bestEdge;
          let bestDistance = Infinity;
          for (const index of kd.within(x, y, range)) {
            const [start, edge] = points[index];
            if (edge.planned) {
              continue;
            }
            const distance = computeDistance(start);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestEdge = edge;
              bestStart = start;
            }
          }
          if (bestDistance === Infinity) {
            // No target within range, so expand the range.
            continue;
          }
          pendingEdges -= 1;
          bestEdge.planned = true;
          const bestEnd = bestEdge[0] === bestStart ? bestEdge[1] : bestEdge[0];
          if (
            (bestEnd.type === 'fill' || at.type === 'fill') &&
            bestDistance <= toolDiameter
          ) {
            cut(bestEnd); // cut across
          } else {
            jump(bestStart); // jump to the start x, y
            cut(bestStart); // may need to drill down to the start z
            cut(bestEnd); // cut across
          }
          break;
        }
      }
    } catch (error) {
      throw error;
    }

    jump([0, 0, 0]);
  }

  return taggedToolpath({}, toolpath);
};
