import {
  fromTranslateToTransform,
  withAabbTreeQuery,
} from '@jsxcad/algorithm-cgal';
import { isSegments, isTypeGhost } from './type.js';

import KdBush from 'kdbush';
import { computeHash } from '@jsxcad/sys';
import { eachSegment } from '../eachSegment.js';
import { fuse } from '../fuse.js';
import { inset } from '../inset.js';
import { linearize } from './linearize.js';
import { measureBoundingBox } from '../measureBoundingBox.js';
import { section } from '../section.js';
import { taggedSegments } from './taggedSegments.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { transformCoordinate } from '../transform.js';

const X = 0;
const Y = 1;

const measureDistance = (
  [ax = 0, ay = 0, az = 0],
  [bx = 0, by = 0, bz = 0]
) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};
const computeDot = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) =>
  ax * bx + ay * by + az * bz;
const equals = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) =>
  ax === bx && ay === by && az === bz;
const subtract = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax - bx,
  ay - by,
  az - bz,
];

export const computeToolpath = (
  geometry,
  {
    speed,
    feedrate,
    jumpHeight = 1,
    toolDiameter = 1,
    stepCost = toolDiameter * -2,
    turnCost = -2,
    neighborCost = -2,
    stopCost = 30,
    candidateLimit = 1,
    subCandidateLimit = 1,
    radialCutDepth = toolDiameter / 4,
    z = 0,
  }
) => {
  const toolRadius = toolDiameter / 2;
  const toolSpacing = radialCutDepth * 2;

  {
    let points = [];

    const concreteGeometry = toConcreteGeometry(geometry);
    const sections = section(concreteGeometry, [
      { type: 'points', matrix: fromTranslateToTransform(0, 0, z) },
    ]);
    const fusedArea = fuse(sections);
    const insetArea = inset(fusedArea, toolRadius);

    // Surfaces
    withAabbTreeQuery(
      linearize(insetArea, ({ type }) =>
        ['graph', 'polygonsWithHoles'].includes(type)
      ),
      (query) => {
        // The hexagon diameter is the tool radius.
        const isInteriorPoint = (x, y, z) => {
          return query.isIntersectingSegmentApproximate(
            x,
            y,
            z - 1,
            x,
            y,
            z + 1
          );
        };
        const bounds = measureBoundingBox(sections);
        if (!bounds) {
          return;
        }
        const [minPoint, maxPoint] = bounds;
        // const z = 0;
        const sqrt3 = Math.sqrt(3);
        const width = maxPoint[X] - minPoint[X];
        const offsetX = (maxPoint[X] + minPoint[X]) / 2 - width / 2;
        const height = maxPoint[Y] - minPoint[Y];
        const offsetY = (maxPoint[Y] + minPoint[Y]) / 2 - height / 2;
        const columns = width / (sqrt3 * 0.5 * toolSpacing) + 1;
        const rows = height / (toolSpacing * 0.75);
        const index = [];
        for (let i = 0; i < columns; i++) {
          index[i] = [];
        }
        const link = (point, neighbor) => {
          if (neighbor) {
            point.fillNeighbors.push(neighbor);
            neighbor.fillNeighbors.push(point);
          }
        };
        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            const x = offsetX + (i + (j % 2) * 0.5) * toolSpacing * sqrt3 * 0.5;
            const y = offsetY + j * toolSpacing * 0.75;
            // FIX: We need to produce an affinity with each distinct contiguous area.
            if (isInteriorPoint(x, y, z)) {
              const point = {
                start: [x, y, z],
                isFill: true,
                fillNeighbors: [],
              };
              index[i][j] = point;
              points.push(point);
            }
          }
        }
        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            const point = index[i][j];
            if (!point) {
              continue;
            }
            if (i >= 1) {
              link(point, index[i - 1][j]);
            }
            if (j >= 1) {
              link(point, index[i][j - 1]);
            }
            if (j % 2) {
              link(point, index[i + 1][j - 1]);
            } else {
              link(point, index[i - 1][j - 1]);
            }
          }
        }
      }
    );

    // Profiles
    eachSegment(insetArea, ([start, end]) => {
      points.push({ start: start, end: { end: end, type: 'required' } });
      points.push({ start: end, note: 'segment end' });
    });

    // Grooves
    // FIX: These should be sectioned segments.
    for (const { matrix, segments } of linearize(
      concreteGeometry,
      (geometry) => isSegments(geometry) && isTypeGhost(geometry)
    )) {
      for (const [localStart, localEnd] of segments) {
        const start = transformCoordinate(localStart, matrix);
        const end = transformCoordinate(localEnd, matrix);
        points.push({ start, end: { end, type: 'required' } });
        points.push({ start: end, note: 'groove end' });
      }
    }

    const compareCoord = ([aX = 0, aY = 0], [bX = 0, bY = 0]) => {
      const dX = aX - bX;
      if (dX !== 0) {
        return dX;
      }
      return aY - bY;
    };

    const compareStart = (a, b) => compareCoord(a.start, b.start);

    // Fold the individual points and edges together.
    {
      points.sort(compareStart);
      const consolidated = [];
      let last;
      for (const point of points) {
        if (last === undefined || !equals(last.start, point.start)) {
          last = point;
          if (last.end) {
            last.ends = [last.end];
            delete last.end;
          }
          consolidated.push(point);
          continue;
        } else {
          if (point.isFill) {
            last.isFill = true;
          }
        }
        if (point.end) {
          if (!last.ends) {
            last.ends = [];
          }
          last.ends.push(point.end);
          delete point.end;
        }
        if (point.fillNeighbors) {
          if (!last.fillNeighbors) {
            last.fillNeighbors = [];
          }
          last.fillNeighbors.push(...point.fillNeighbors);
        }
      }
      points = consolidated;
      for (const point of points) {
        if (
          !point.ends &&
          !point.fillNeighbors &&
          point.note !== 'groove end'
        ) {
          throw Error(`Lonely consolidated point: ${JSON.stringify(point)}`);
        }
      }
    }

    const pointByHash = new Map();

    // Set up an index from start to point, and have the ends share identity with the starts.
    for (const point of points) {
      pointByHash.set(computeHash(point.start), point);
    }

    // Now that we have, e.g.
    // [{ start: [x, y, z], isFill: true, ends: [{ end: [x, y, z], type }] }]
    // we can use a spatial structure to query nearby points.

    const kd = new KdBush(
      points,
      (p) => p.start[X],
      (p) => p.start[Y]
    );

    const jump = (toolpath, from, to) => {};

    const cut = (toolpath, from, to) => toolpath.push([from, to]);

    const considerTargetPoint = (candidates, fulfilled, candidate, target) => {
      if (fulfilled.has(computeHash(target.start))) {
        // This target is already fulfilled.
        return;
      }

      if (!target.ends && !target.fillNeighbors) {
        // This target was already fulfilled, make a note of it.
        fulfilled.add(computeHash(target.start));
        return;
      }

      let cost = candidate.cost;
      if (target.fillNeighbors) {
        for (const neighbor of target.fillNeighbors) {
          if (fulfilled.has(computeHash(neighbor.start))) {
            cost += neighborCost;
          }
        }
      }

      if (candidate.last) {
        const lastDirection = subtract(
          candidate.at.start,
          candidate.last.at.start
        );
        const nextDirection = subtract(target.start, candidate.at.start);
        const dot = computeDot(lastDirection, nextDirection);
        cost += dot * turnCost;
      }

      const distance = measureDistance(candidate.at.start, target.start);
      if (
        (candidate.at.isFill || target.isFill) &&
        distance <= toolSpacing &&
        candidate.at.start.every(isFinite)
      ) {
        // Reaching a fill point fulfills it, but reaching a profile or groove point won't.
        const fulfills = [];
        if (target.isFill) {
          fulfills.push(computeHash(target.start));
        }
        if (candidate.isFill) {
          fulfills.push(computeHash(candidate.at.start));
        }
        cost += stepCost / distance;
        const length = candidate.length + 1;
        // Cutting from a fill point also fulfills it.
        const last = candidate;
        const next = { last, toolpath: [], at: target, cost, length, fulfills };
        cut(next.toolpath, candidate.at.start, target.start); // safe cut across fill.
        candidates.push(next);
        return;
      }

      // This is an unsafe cut -- jump.
      // FIX: This is not a very sensible penalty.
      // cost += distance + stepCost + stopCost * 3;
      cost = stepCost / (distance * 2);
      const length = candidate.length + 1;
      const last = candidate;
      const fulfills = [];
      if (target.isFill) {
        fulfills.push(computeHash(target.start));
      }
      const next = { last, toolpath: [], at: target, cost, length, fulfills };
      jump(next.toolpath, candidate.at.start, [
        candidate.at.start[X],
        candidate.at.start[Y],
        jumpHeight,
      ]);
      jump(
        next.toolpath,
        [candidate.at.start[X], candidate.at.start[Y], jumpHeight],
        [target.start[X], target.start[Y], jumpHeight]
      );
      cut(
        next.toolpath,
        [target.start[X], target.start[Y], jumpHeight],
        target.start
      );
      candidates.push(next);
    };

    const considerTargetEdge = (
      candidates,
      fulfilled,
      candidate,
      target,
      edge
    ) => {
      if (
        fulfilled.has(
          computeHash({ start: candidate.at.start, end: target.start })
        )
      ) {
        // This edge is already fulfilled.
        return;
      }

      let cost = candidate.cost;
      if (target.fillNeighbors) {
        for (const neighbor of target.fillNeighbors) {
          if (fulfilled.has(computeHash(neighbor.start))) {
            cost += neighborCost;
          }
        }
      }

      if (candidate.last) {
        const lastDirection = subtract(
          candidate.at.start,
          candidate.last.at.start
        );
        const nextDirection = subtract(target.start, candidate.at.start);
        const dot = computeDot(lastDirection, nextDirection);
        cost += dot * turnCost;
      }

      const distance = measureDistance(candidate.at.start, target.start);
      const fulfills = [];
      let isFulfilled = true;
      for (const end of candidate.at.ends) {
        const fulfilledEdge = computeHash({
          start: candidate.at.start,
          end: end.end,
        });
        if (equals(target.start, end.end)) {
          cost += stepCost / distance;
          const length = candidate.length + 1;
          fulfills.push(fulfilledEdge);
          const last = candidate;
          const next = {
            last,
            toolpath: [],
            at: target,
            cost,
            length,
            fulfills,
          };
          cut(next.toolpath, candidate.at.start, target.start); // safe cut across known edge.
          candidates.push(next);
        } else {
          if (!fulfilled.has(fulfilledEdge)) {
            isFulfilled = false;
          }
        }
      }
      if (isFulfilled) {
        // All of the candidate edges are now fulfilled, so mark the point as fulfilled.
        fulfills.push(computeHash(candidate.at.start));
      }
    };

    let candidate = {
      at: { start: [0, 0, 0], ends: [] },
      toolpath: [],
      cost: 0,
      length: 0,
    };
    const fulfilled = new Set();
    for (;;) {
      const nextCandidates = [];
      try {
        if (nextCandidates.length < subCandidateLimit && candidate.at.ends) {
          for (const end of candidate.at.ends) {
            const foundPoint = pointByHash.get(computeHash(end.end));
            if (!foundPoint) {
              throw Error(`Cannot find end point ${JSON.stringify(end.end)}`);
            }
            // This is a bit silly -- why aren't we communicating the edge more directly?
            considerTargetEdge(
              nextCandidates,
              fulfilled,
              candidate,
              foundPoint,
              end
            );
          }
        }
        if (
          nextCandidates.length < subCandidateLimit &&
          candidate.at.fillNeighbors
        ) {
          for (const point of candidate.at.fillNeighbors) {
            considerTargetPoint(nextCandidates, fulfilled, candidate, point);
          }
        }
        if (nextCandidates.length < subCandidateLimit) {
          // From this point they're really jumps.
          const [x = 0, y = 0] = candidate.at.start;
          for (let range = 2; range < Infinity; range *= 2) {
            const destinations = kd.within(x, y, range);
            for (const destination of destinations) {
              const point = points[destination];
              if (point === candidate.at) {
                continue;
              }
              considerTargetPoint(nextCandidates, fulfilled, candidate, point);
            }
            if (
              nextCandidates.length >= subCandidateLimit ||
              destinations.length >= points.length
            ) {
              break;
            }
          }
        }
      } catch (error) {
        console.log(error.stack);
        throw error;
      }
      if (nextCandidates.length === 0) {
        // We have computed a total toolpath.
        // Note that we include the imaginary seed point.
        const cuts = [];
        const history = [];
        for (let node = candidate; node; node = node.last) {
          history.push(node.toolpath);
        }
        while (history.length > 0) {
          cuts.push(...history.pop());
        }
        const tags = ['type:toolpath'];
        if (feedrate !== undefined) {
          tags.push(`toolpath:feedrate=${feedrate}`);
        }
        if (speed !== undefined) {
          tags.push(`toolpath:speed=${speed}`);
        }
        return taggedSegments({ tags }, cuts);
      }
      nextCandidates.sort((a, b) => a.cost - b.cost);
      candidate = nextCandidates[0];
      if (candidate.fulfills) {
        for (const hash of candidate.fulfills) {
          fulfilled.add(hash);
        }
      }
    }
  }
};
