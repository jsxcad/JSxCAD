import UPNG from 'upng-js';
import gl from 'gl';
import { staticDisplay } from './staticDisplay.js';

const extractPixels = (context) => {
  const width = context.drawingBufferWidth;
  const height = context.drawingBufferHeight;
  const frameBufferPixels = new Uint8Array(width * height * 4);
  context.readPixels(
    0,
    0,
    width,
    height,
    context.RGBA,
    context.UNSIGNED_BYTE,
    frameBufferPixels
  );
  // The framebuffer coordinate space has (0, 0) in the bottom left, whereas images usually
  // have (0, 0) at the top left. Vertical flipping follows:
  const pixels = new Uint8Array(width * height * 4);
  for (let fbRow = 0; fbRow < height; fbRow += 1) {
    let rowData = frameBufferPixels.subarray(
      fbRow * width * 4,
      (fbRow + 1) * width * 4
    );
    let imgRow = height - fbRow - 1;
    pixels.set(rowData, imgRow * width * 4);
  }
  return { width, height, pixels };
};

export const renderPng = async (
  { view = {}, geometry, withAxes = false, withGrid = false, definitions } = {},
  page
) => {
  const width = page.offsetWidth;
  const height = page.offsetHeight;
  const context = gl(width, height, { preserveDrawingBuffer: true });
  const canvas = {
    width,
    height,
    addEventListener: (event) => {},
    removeEventListener: (event) => {},
    getContext: () => context,
  };
  const { renderer } = await staticDisplay(
    { view, canvas, context, definitions, geometry, withAxes, withGrid },
    page
  );
  const { pixels } = extractPixels(renderer.getContext());
  return UPNG.encode([pixels], width, height, 256);
};
