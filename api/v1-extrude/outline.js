import { Assembly } from '@jsxcad/api-v1-shapes';
import { Shape } from '@jsxcad/api-v1-shape';
import { outline as outlineGeometry } from '@jsxcad/geometry-tagged';

export const outline = (
  shape,
  { includeFaces = true, includeHoles = true } = {}
) =>
  Assembly(
    ...outlineGeometry(
      shape.toGeometry(),
      includeFaces,
      includeHoles
    ).map((outline) => Shape.fromGeometry(outline))
  );

const outlineMethod = function ({
  includeFaces = true,
  includeHoles = true,
} = {}) {
  return outline(this, { includeFaces, includeHoles });
};

const withOutlineMethod = function ({
  includeFaces = true,
  includeHoles = true,
} = {}) {
  return this.with(outline(this, { includeFaces, includeHoles }));
};

Shape.prototype.outline = outlineMethod;
Shape.prototype.withOutline = withOutlineMethod;

export default outline;
