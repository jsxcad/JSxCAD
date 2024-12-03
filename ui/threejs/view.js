/* global FileReader */

import FileReaderForNode from 'filereader-ponyfill';
import { isNode } from '@jsxcad/sys';
import { orbitDisplay } from './orbitDisplay.js';
import { staticDisplay } from '@jsxcad/convert-threejs';

const UP = [0, 0.0001, 1];

export const staticView = async (
  shape,
  {
    target = [0, 0, 0],
    position = [0, 0, 0],
    up = UP,
    width = 256,
    height = 128,
    withAxes = false,
    withGrid = false,
    definitions,
    canvas,
  } = {}
) => {
  const { canvas: rendererCanvas } = await staticDisplay(
    {
      view: { target, position, up },
      canvas,
      geometry: await shape.toDisplayGeometry(),
      withAxes,
      withGrid,
      definitions,
    },
    { offsetWidth: width, offsetHeight: height }
  );
  return rendererCanvas;
};

const getFileReader = () =>
  isNode ? new FileReaderForNode.FileReaderAsync() : new FileReader();

export const dataUrl = async (shape, options) => {
  const canvas = await staticView(shape, options);
  const blob = await canvas.convertToBlob();
  const dataUrl = await new Promise((resolve, reject) => {
    const fileReader = getFileReader();
    fileReader.addEventListener('load', () => resolve(fileReader.result));
    fileReader.addEventListener('error', () =>
      reject(new Error('readAsDataURL failed'))
    );
    fileReader.readAsDataURL(blob);
  });
  return dataUrl;
};

export const image = async (shape, options) => {
  const image = document.createElement('img');
  const dataUrl = (await staticView(shape, options)).toDataURL('png');
  image.src = dataUrl;
  return image;
};

export const orbitView = async (
  shape,
  { target, position, up = UP, width = 256, height = 128, definitions } = {}
) => {
  const container = document.createElement('div');
  container.style = `width: ${width}px; height: ${height}px`;

  const geometry = await shape.toDisplayGeometry();
  const view = { target, position, up };

  await orbitDisplay({ geometry, view, definitions }, container);
  return container;
};
