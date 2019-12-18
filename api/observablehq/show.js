import { Shape } from '@jsxcad/api-v1';
import { staticDisplay } from '@jsxcad/ui-threejs';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

export const show = (shape, { view = { position: [0, 0, 100] }, width = 1024, height = 512 } = {}) => {
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry());
  const { canvas } = staticDisplay({ view, threejsGeometry },
                                   { offsetWidth: width, offsetHeight: height });
  canvas.style = `width: ${width}px; height: ${height}px`;
  return canvas;
};

const showMethod = function (...args) { return show(this, ...args); };

Shape.prototype.show = showMethod;

export default show;
