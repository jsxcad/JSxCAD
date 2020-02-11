/* global document */

import { orbitDisplay, staticDisplay } from '@jsxcad/ui-threejs';

import Shape from '@jsxcad/api-v1-shape';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

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

export const staticView = async (shape, { target, position, up, width = 256, height = 128 } = {}) => {
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry());
  const { renderer } = await staticDisplay({ view: { target, position, up }, threejsGeometry },
                                           { offsetWidth: width, offsetHeight: height });
  const canvas = toCanvasFromWebglContext(renderer.getContext());
  canvas.style = `width: ${width}px; height: ${height}px`;
  renderer.forceContextLoss();
  return canvas;
};

export const dataUrl = async (...args) => (await staticView(...args)).toDataURL('png');

export const image = async (...args) => {
  const image = document.createElement('img');
  const dataUrl = (await staticView(...args)).toDataURL('png');
  image.src = dataUrl;
  return image;
};

export const orbitView = async (shape, { target, position, up, width = 256, height = 128 } = {}) => {
  const container = document.createElement('div');
  container.style = `width: ${width}px; height: ${height}px`;

  const geometry = shape.toKeptGeometry();
  const view = { target, position, up };

  await orbitDisplay({ geometry, view }, container);
  return container;
};

const bigViewMethod = async function ({ width = 512, height = 256, position = [100, -100, 100] } = {}) { return staticView(this, { width, height, position }); };
const bigTopViewMethod = async function ({ width = 512, height = 256, position = [0, 0, 100] } = {}) { return staticView(this, { width, height, position }); };
const viewMethod = async function ({ width = 256, height = 128, position = [100, -100, 100] } = {}) { return staticView(this, { width, height, position }); };
const topViewMethod = async function ({ width = 256, height = 128, position = [0, 0, 100] } = {}) { return staticView(this, { width, height, position }); };
const frontViewMethod = async function ({ width = 256, height = 128, position = [0, -100, 0] } = {}) { return staticView(this, { width, height, position }); };

Shape.prototype.view = viewMethod;
Shape.prototype.bigView = bigViewMethod;
Shape.prototype.topView = topViewMethod;
Shape.prototype.bigTopView = bigTopViewMethod;
Shape.prototype.frontView = frontViewMethod;

const bigDataUrlMethod = async function ({ width = 512, height = 256, position = [100, -100, 100] } = {}) { return dataUrl(this, { width, height, position }); };
const bigTopDataUrlMethod = async function ({ width = 512, height = 256, position = [0, 0, 100] } = {}) { return dataUrl(this, { width, height, position }); };
const dataUrlMethod = async function ({ width = 256, height = 128, position = [100, -100, 100] } = {}) { return dataUrl(this, { width, height, position }); };
const topDataUrlMethod = async function ({ width = 256, height = 128, position = [0, 0, 100] } = {}) { return dataUrl(this, { width, height, position }); };
const frontDataUrlMethod = async function ({ width = 256, height = 128, position = [0, -100, 0] } = {}) { return dataUrl(this, { width, height, position }); };

Shape.prototype.dataUrl = dataUrlMethod;
Shape.prototype.bigDataUrl = bigDataUrlMethod;
Shape.prototype.topDataUrl = topDataUrlMethod;
Shape.prototype.bigTopDataUrl = bigTopDataUrlMethod;
Shape.prototype.frontDataUrl = frontDataUrlMethod;

const bigImageMethod = async function ({ width = 512, height = 256, position = [100, -100, 100] } = {}) { return image(this, { width, height, position }); };
const bigTopImageMethod = async function ({ width = 512, height = 256, position = [0, 0, 100] } = {}) { return image(this, { width, height, position }); };
const imageMethod = async function ({ width = 256, height = 128, position = [100, -100, 100] } = {}) { return image(this, { width, height, position }); };
const topImageMethod = async function ({ width = 256, height = 128, position = [0, 0, 100] } = {}) { return image(this, { width, height, position }); };
const frontImageMethod = async function ({ width = 256, height = 128, position = [0, -100, 0] } = {}) { return image(this, { width, height, position }); };

Shape.prototype.image = imageMethod;
Shape.prototype.bigImage = bigImageMethod;
Shape.prototype.topImage = topImageMethod;
Shape.prototype.bigTopImage = bigTopImageMethod;
Shape.prototype.frontImage = frontImageMethod;

const orbitViewMethod = async function ({ width = 512, height = 512, position = [0, -100, 0] } = {}) { return orbitView(this, { width, height, position }); };
const bigOrbitViewMethod = async function ({ width = 1024, height = 1024, position = [0, -100, 0] } = {}) { return orbitView(this, { width, height, position }); };

Shape.prototype.orbitView = orbitViewMethod;
Shape.prototype.bigOrbitView = bigOrbitViewMethod;

export default staticView;
