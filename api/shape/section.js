import { Shape } from './Shape.js';
import { section as sectionGeometry } from '@jsxcad/geometry';

const baseSection =
  ({ profile = false } = {}, ...orientations) =>
  (shape) => {
    const matrices = [];
    if (orientations.length === 0) {
      matrices.push({ plane: [0, 0, 1, 0] });
    } else {
      for (const item of orientations) {
        const matrix = item.toGeometry().matrix;
        matrices.push({ matrix });
      }
    }
    return Shape.fromGeometry(
      sectionGeometry(shape.toGeometry(), matrices, { profile })
    );
  };

export const section =
  (...orientations) =>
  (shape) =>
    baseSection({ profile: false }, ...orientations)(shape);

Shape.registerMethod('section', section);

export const sectionProfile =
  (...orientations) =>
  (shape) =>
    baseSection({ profile: true }, ...orientations)(shape);

Shape.registerMethod('sectionProfile', sectionProfile);
