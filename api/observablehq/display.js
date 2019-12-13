import { Shape } from '@jsxcad/api-v1';
import { staticDisplay } from '@jsxcad/ui-threejs';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

export const display = (shape, { view, page = {} } = {}) => {
  const { width = 1024, height = 512 } = page;
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry());
  const { canvas } = staticDisplay({ view, threejsGeometry },
                                   { offsetWidth: width, offsetHeight: height });
  return canvas;
};

const displayMethod = function (...args) { return display(this, ...args); };

Shape.prototype.display = displayMethod;

export default display;
