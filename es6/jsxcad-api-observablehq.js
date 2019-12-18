import { Shape } from './jsxcad-api-v1.js';
export * from './jsxcad-api-v1.js';
import { staticDisplay } from './jsxcad-ui-threejs.js';
import { toThreejsGeometry } from './jsxcad-convert-threejs.js';

const view = (shape, { view, width = 256, height = 128 } = {}) => {
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry());
  const { canvas } = staticDisplay({ view, threejsGeometry },
                                   { offsetWidth: width, offsetHeight: height });
  canvas.style = `width: ${width}px; height: ${height}px`;
  return canvas;
};

const viewMethod = function () { return view(this, { view: { position: [100, -100, 100] } }); };
const topViewMethod = function (...args) { return view(this, { view: { position: [0, 0, 100] } }); };

Shape.prototype.view = viewMethod;
Shape.prototype.topView = topViewMethod;
