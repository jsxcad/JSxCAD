import UPNG from 'upng-js';
import gl from 'gl';
import * as fs from 'fs';
import { RGBAFormat, UnsignedByteType, WebGLRenderer, WebGLRenderTarget } from '@jsxcad/algorithm-threejs';
import { staticDisplay } from './staticDisplay.js';

const extractPixels = (context) => {
  const width = context.drawingBufferWidth;
  const height = context.drawingBufferHeight;
  const frameBufferPixels = new Uint8Array(width * height * 4);
  context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, frameBufferPixels);
  // The framebuffer coordinate space has (0, 0) in the bottom left, whereas images usually
  // have (0, 0) at the top left. Vertical flipping follows:
  const pixels = new Uint8Array(width * height * 4);
  for (let fbRow = 0; fbRow < height; fbRow += 1) {
    let rowData = frameBufferPixels.subarray(fbRow * width * 4, (fbRow + 1) * width * 4);
    let imgRow = height - fbRow - 1;
    pixels.set(rowData, imgRow * width * 4);
  }
  return { width, height, pixels };
};

const toP3 = ({width, height, pixels}) => {
  const headerContent = `P3\n# http://netpbm.sourceforge.net/doc/ppm.html\n${width} ${height}\n255\n`;
  const bytesPerPixel = pixels.length / width / height;
  const rowLen = width * bytesPerPixel;

  let output = headerContent;
  for (let i = 0; i < pixels.length; i += bytesPerPixel) {
    // Break output into rows
    if (i > 0 && i % rowLen === 0) {
      output += "\n";
    }

    for (let j = 0; j < 3; j += 1) {
      // This is super inefficient but hey
      output += pixels[i + j] + " ";
    }
  }

  return output;
};

const createRenderer = ({height, width}) => {
  // THREE expects a canvas object to exist, but it doesn't actually have to work.
  const canvas = {
    width,
    height,
    addEventListener: event => {},
    removeEventListener: event => {},
  };

  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: "high-performance",
    context: gl(width, height, {
      preserveDrawingBuffer: true,
    }),
  });

  const context = gl(width, height, { preserveDrawingBuffer: true });

  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default PCFShadowMap

  return renderer;
};

export const makeThumbnail = async (geometry, { width = 512, height = 512 } = {}) => {
  const canvas = {
    width,
    height,
    addEventListener: event => {},
    removeEventListener: event => {},
  };

  // const renderer = createRenderer({ width, height });

  const context = gl(width, height, { preserveDrawingBuffer: true });

  const { renderer } = await staticDisplay({ canvas, geometry, context }, { offsetWidth: width, offsetHeight: height })

  const image = extractPixels(renderer.getContext());
  fs.writeFileSync("test.ppm", toP3(image));
  fs.writeFileSync("test.png", new Uint8Array(UPNG.encode([image.pixels], width, height, 256)));
};

makeThumbnail(
      {
        type: 'graph',
        matrix: [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          '1 0 0 0 0 1 0 0 0 0 1 0 1',
        ],
        tags: [],
        graph: {
          serializedSurfaceMesh:
            '8\n5/2 -5/2 -5/2 2500 -2500 -2500\n5/2 5/2 -5/2 2500 2500 -2500\n-5/2 5/2 -5/2 -2500 2500 -2500\n-5/2 -5/2 -5/2 -2500 -2500 -2500\n5/2 -5/2 5/2 2500 -2500 2500\n5/2 5/2 5/2 2500 2500 2500\n-5/2 5/2 5/2 -2500 2500 2500\n-5/2 -5/2 5/2 -2500 -2500 2500\n\n12\n3 1 0 2\n3 0 3 2\n3 4 5 6\n3 7 4 6\n3 4 1 5\n3 1 4 0\n3 5 2 6\n3 2 5 1\n3 6 3 7\n3 3 6 2\n3 7 0 4\n3 0 7 3\n',
          hash: 'UCgf2fUqrPTO4gYcPFdTu4QfRSwO/zuPLAeB0P643sg=',
        },
      }
      );
