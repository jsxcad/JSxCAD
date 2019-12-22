import { Shape } from '@jsxcad/api-v1';
import { staticDisplay } from '@jsxcad/ui-threejs';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

export const view = (shape, { view, width = 256, height = 128 } = {}) => {
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry());
  const { canvas } = staticDisplay({ view, threejsGeometry },
                                   { offsetWidth: width, offsetHeight: height });
  canvas.style = `width: ${width}px; height: ${height}px`;
  return canvas;
};

// Work around the name collision in destructuring.
const buildView = (...args) => view(...args);

const bigViewMethod = function ({ width = 512, height = 256, view = { position: [100, -100, 100] } } = {}) { return buildView(this, { width, height, view }); };
const bigTopViewMethod = function ({ width = 512, height = 256, view = { position: [0, 0, 100] } } = {}) { return buildView(this, { width, height, view }); };
const viewMethod = function ({ width = 256, height = 128, view = { position: [100, -100, 100] } } = {}) { return buildView(this, { width, height, view }); };
const topViewMethod = function ({ width = 256, height = 128, view = { position: [0, 0, 100] } } = {}) { return buildView(this, { width, height, view }); };
const frontViewMethod = function ({ width = 256, height = 128, view = { position: [0, -100, 0] } } = {}) { return buildView(this, { width, height, view }); };

Shape.prototype.view = viewMethod;
Shape.prototype.bigView = bigViewMethod;
Shape.prototype.topView = topViewMethod;
Shape.prototype.bigTopView = bigTopViewMethod;
Shape.prototype.frontView = frontViewMethod;

export default view;
