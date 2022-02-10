import {
  dot as computeDot,
  equals,
  distance as measureDistance,
  subtract,
} from '@jsxcad/math-vec3';

import KdBush from 'kdbush';
import { computeHash } from '@jsxcad/sys';
import { fuse } from './fuse.js';
import { getNonVoidSegments } from './getNonVoidSegments.js';
import { getQuery } from '../graph/getQuery.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { inset } from './inset.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import { outline } from './outline.js';
import { section } from './section.js';
import { taggedToolpath } from './taggedToolpath.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { toSegments } from './toSegments.js';

const X = 0;
const Y = 1;

export const computeToolpath = (
  geometry,
  {
    toolDiameter = 1,
    jumpHeight = 1,
    stepCost = toolDiameter * -2,
    turnCost = -2,
    neighborCost = -2,
    stopCost = 30,
    candidateLimit = 1,
    subCandidateLimit = 1,
  }
) => {
  const startTime = new Date();
  let lastTime = startTime;
  const time = (msg) => {
    const now = new Date();
    console.log(
      `${msg}: ${((now - startTime) / 1000).toFixed(2)} ${(
        (now - lastTime) /
        1000
      ).toFixed(2)}`
    );
    lastTime = now;
  };
  const toolRadius = toolDiameter / 2;

  {
    let points = [];

    const concreteGeometry = toConcreteGeometry(geometry);
    const sections = section(concreteGeometry, [identityMatrix]);
    const fusedArea = fuse([sections]);
    const insetArea = inset(fusedArea, toolRadius);

    // Surfaces
    {
      // The hexagon diameter is the tool radius.
      const { isInteriorPoint, release } = getQuery(insetArea);
      const [minPoint, maxPoint] = measureBoundingBox(sections);
      const z = 0;
      const sqrt3 = Math.sqrt(3);
      const width = maxPoint[X] - minPoint[X];
      const offsetX = (maxPoint[X] + minPoint[X]) / 2 - width / 2;
      const height = maxPoint[Y] - minPoint[Y];
      const offsetY = (maxPoint[Y] + minPoint[Y]) / 2 - height / 2;
      const columns = width / (sqrt3 * 0.5 * toolRadius) + 1;
      const rows = height / (toolRadius * 0.75);
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
          // const x = offsetX + (i + (j % 2 ? 0.5 : 0)) * sqrt3 * toolRadius;
          // const y = offsetY + j * toolRadius * 0.75;
          const x = offsetX + (i + (j % 2) * 0.5) * toolRadius * sqrt3 * 0.5;
          const y = offsetY + j * toolRadius * 0.75;
          // FIX: We need to produce an affinity with each distinct contiguous area.
          if (isInteriorPoint(x, y, z)) {
            const point = { start: [x, y, z], isFill: true, fillNeighbors: [] };
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
          link(point, index[i - 1][j]);
          link(point, index[i][j - 1]);
          if (j % 2) {
            link(point, index[i + 1][j - 1]);
          } else {
            link(point, index[i - 1][j - 1]);
          }
        }
      }
      release();
    }
    time('QQ/computeToolpath/Surfaces');

    // Profiles
    for (const [start, end] of toSegments(outline(insetArea)).segments) {
      points.push({ start: start, end: { end: end, type: 'required' } });
      points.push({ start: end, note: 'segment end' });
    }
    time('QQ/computeToolpath/Profiles');

    // Grooves
    // FIX: These should be sectioned segments.
    for (const { segments } of getNonVoidSegments(concreteGeometry)) {
      for (const [start, end] of segments) {
        points.push({ start, end: { end, type: 'required' } });
        points.push({ start: end, note: 'groove end' });
      }
    }
    time('QQ/computeToolpath/Grooves');

    const compareCoord = (a, b) => {
      const dX = a[X] - b[X];
      if (dX !== 0) {
        return dX;
      }
      return a[Y] - b[Y];
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
    time('QQ/computeToolpath/Fold');

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
    time('QQ/computeToolpath/Index');

    const jump = (toolpath, from, to) =>
      toolpath.push({ op: 'jump', from: from, to: to });

    const cut = (toolpath, from, to) => toolpath.push({ op: 'cut', from, to });

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
      if ((candidate.at.isFill || target.isFill) && distance < toolDiameter) {
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
      if (candidate.length % 1000 === 0) {
        time(`QQ/computeToolpath/Candidate/${candidate.length}`);
      }
      const nextCandidates = [];
      let nextCandidatesConsidered = 0;
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
          const [x, y] = candidate.at.start;
          for (let range = 2; range < Infinity; range *= 2) {
            const destinations = kd.within(x, y, range);
            for (const destination of destinations) {
              nextCandidatesConsidered += 1;
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
            if (range > 4) {
              console.log(`QQ/range: ${range}`);
            }
          }
        }
      } catch (error) {
        console.log(error.stack);
        throw error;
      }
      if (nextCandidates.length === 0) {
        time('QQ/computeToolpath/Candidate/completed');
        // We have computed a total toolpath.
        // Note that we include the imaginary seed point.
        const history = [];
        for (let node = candidate; node; node = node.last) {
          history.push(node.toolpath);
        }
        const toolpath = [];
        while (history.length > 0) {
          toolpath.push(...history.pop());
        }
        return taggedToolpath({}, toolpath);
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
