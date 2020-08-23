import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry-tagged';

/** Pause after the path is complete, waiting for the user to continue. */

export const pauseAfter = (shape) =>
  Shape.fromGeometry(
    rewriteTags([`toolpath/pause_after`], [], shape.toGeometry())
  );

const pauseAfterMethod = function (...args) {
  return pauseAfter(this, ...args);
};
Shape.prototype.pauseAfter = pauseAfterMethod;

/** Pause before the path is started, waiting for the user to continue. */

export const pauseBefore = (shape) =>
  Shape.fromGeometry(
    rewriteTags([`toolpath/pause_before`], [], shape.toGeometry())
  );

const pauseBeforeMethod = function (...args) {
  return pauseBefore(this, ...args);
};
Shape.prototype.pauseBefore = pauseBeforeMethod;
