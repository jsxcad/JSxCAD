/* global document */

import { orbitDisplay } from './orbitDisplay';
import { staticDisplay } from './staticDisplay';
import { toThreejsGeometry } from './toThreejsGeometry';

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
