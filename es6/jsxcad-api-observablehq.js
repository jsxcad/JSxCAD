import Shape from './jsxcad-api-v1-shape.js';
import { staticDisplay } from './jsxcad-ui-threejs.js';
import { toThreejsGeometry } from './jsxcad-convert-threejs.js';
export * from './jsxcad-api-v1.js';

/* global document */

const toCanvasFromWebglContext = (webgl) => {
  // Derived from https://github.com/Jam3/webgl-to-canvas2d
  const { width, height } = webgl.canvas;
  const inImageData = new Uint8Array(width * height * 4);
  webgl.readPixels(0, 0, width, height, webgl.RGBA, webgl.UNSIGNED_BYTE, inImageData);

  const outCanvas = document.createElement('canvas');
  outCanvas.width = width;
  outCanvas.height = height;
  const outContext = outCanvas.getContext('2d');
  const outImageData = outContext.getImageData(0, 0, width, height);
  outImageData.data.set(new Uint8ClampedArray(inImageData));

  outContext.putImageData(outImageData, 0, 0);
  outContext.translate(0, height);
  outContext.scale(1, -1);
  outContext.drawImage(outCanvas, 0, 0);
  outContext.setTransform(1, 0, 0, 1, 0, 0);

  return outCanvas;
};

const view = async (shape, path, { view, width = 256, height = 128 } = {}) => {
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry());
  const { renderer } = await staticDisplay({ view, threejsGeometry },
                                           { offsetWidth: width, offsetHeight: height });
  const canvas = toCanvasFromWebglContext(renderer.getContext());
  canvas.style = `width: ${width}px; height: ${height}px`;
  renderer.forceContextLoss();
  return canvas;
};

// Work around the name collision in destructuring.
const buildView = async (...args) => view(...args);

const bigViewMethod = async function (path, { width = 512, height = 256, view = { position: [100, -100, 100] } } = {}) { return buildView(this, path, { width, height, view }); };
const bigTopViewMethod = async function (path, { width = 512, height = 256, view = { position: [0, 0, 100] } } = {}) { return buildView(this, path, { width, height, view }); };
const viewMethod = async function (path, { width = 256, height = 128, view = { position: [100, -100, 100] } } = {}) { return buildView(this, path, { width, height, view }); };
const topViewMethod = async function (path, { width = 256, height = 128, view = { position: [0, 0, 100] } } = {}) { return buildView(this, path, { width, height, view }); };
const frontViewMethod = async function (path, { width = 256, height = 128, view = { position: [0, -100, 0] } } = {}) { return buildView(this, path, { width, height, view }); };

Shape.prototype.view = viewMethod;
Shape.prototype.bigView = bigViewMethod;
Shape.prototype.topView = topViewMethod;
Shape.prototype.bigTopView = bigTopViewMethod;
Shape.prototype.frontView = frontViewMethod;
