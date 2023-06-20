/*
import Shape from './Shape.js';
import { toShapes } from './toShapes.js';

export const toShapesGeometries = Shape.registerMethod(
  'toShapesGeometries',
  (value) => async (shape) => {
    const shapes = await toShapes(value)(shape);
    const geometries = [];
    for (const shape of shapes) {
      if (shape instanceof Promise) {
        throw Error('promise');
      }
      geometries.push(await shape.toGeometry());
    }
    return geometries;
  }
);
*/
