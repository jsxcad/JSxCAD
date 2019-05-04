import {
  END,
  JUMP_STITCH,
  PAUSE,
  X_ADD_1,
  X_ADD_27,
  X_ADD_3,
  X_ADD_81,
  X_ADD_9,
  X_SUB_1,
  X_SUB_27,
  X_SUB_3,
  X_SUB_81,
  X_SUB_9,
  Y_ADD_1,
  Y_ADD_27,
  Y_ADD_3,
  Y_ADD_81,
  Y_ADD_9,
  Y_SUB_1,
  Y_SUB_27,
  Y_SUB_3,
  Y_SUB_81,
  Y_SUB_9
} from './dst';

import { scale } from '@jsxcad/geometry-paths';

export const createByteFetcher = (bytes) => {
  let bytesRead = 0;
  const byteFetcher = (length) => {
    const fetched = bytes.slice(bytesRead, bytesRead += length);
    return fetched;
  };
  return byteFetcher;
};

export const fetchHeader = (options = {}, fetchBytes) => {
  function readBytes (prefix, field, converter, start, length, flag) {
    let bytes = fetchBytes(length);
    if (field !== '') {
      options[field] = converter(prefix, bytes);
    }
  }

  function asString (prefix, bytes) {
    return Buffer.from(bytes).toString().slice(prefix.length).trim();
  }

  const asNumber = (prefix, bytes) => {
    const number = parseInt(asString(prefix, bytes));
    if (isNaN(number)) {
      return undefined;
    } else {
      return number;
    }
  };

  readBytes('LA:', 'label', asString, 0, 20); // Label
  readBytes('ST:', 'stitchCount', asNumber, 20, 11);
  readBytes('CO:', 'colorCount', asNumber, 31, 7);
  readBytes('+X:', 'positiveX', asNumber, 38, 9);
  readBytes('-X:', 'negativeX', asNumber, 47, 9);
  readBytes('+Y:', 'positiveY', asNumber, 56, 9);
  readBytes('-Y:', 'negativeY', asNumber, 65, 9);
  readBytes('AX:', 'deltaX', asNumber, 74, 10, 'sign');
  readBytes('AY:', 'deltaY', asNumber, 84, 10, 'sign');
  readBytes('MX:', 'previousX', asNumber, 94, 10, 'sign');
  readBytes('MY:', 'previousY', asNumber, 104, 10, 'sign');
  readBytes('PD:', 'previousFile', asNumber, 114, 10);
  readBytes('\x1a   ', '', '', 124, 4); // end of header
  readBytes('', '', '', 128, 384); // block padding

  return options;
};

const fetchStitch = (fetchBytes) => {
  let bytes = fetchBytes(3);
  let r = (bytes[0] << 16) | (bytes[1] << 8) | (bytes[2] << 0);

  let x = 0;
  if (r & X_ADD_81) x += 81;
  if (r & X_SUB_81) x -= 81;
  if (r & X_ADD_27) x += 27;
  if (r & X_SUB_27) x -= 27;
  if (r & X_ADD_9) x += 9;
  if (r & X_SUB_9) x -= 9;
  if (r & X_ADD_3) x += 3;
  if (r & X_SUB_3) x -= 3;
  if (r & X_ADD_1) x += 1;
  if (r & X_SUB_1) x -= 1;

  let y = 0;
  if (r & Y_ADD_81) y += 81;
  if (r & Y_SUB_81) y -= 81;
  if (r & Y_ADD_27) y += 27;
  if (r & Y_SUB_27) y -= 27;
  if (r & Y_ADD_9) y += 9;
  if (r & Y_SUB_9) y -= 9;
  if (r & Y_ADD_3) y += 3;
  if (r & Y_SUB_3) y -= 3;
  if (r & Y_ADD_1) y += 1;
  if (r & Y_SUB_1) y -= 1;

  let flag;
  if ((r & (END | JUMP_STITCH | PAUSE)) === (END | JUMP_STITCH | PAUSE)) {
    flag = 'end';
  } else if ((r & (JUMP_STITCH | PAUSE)) === (JUMP_STITCH | PAUSE)) {
    flag = 'color_change';
  } else if (r & JUMP_STITCH) {
    flag = 'jump';
  } else {
    flag = 'stitch';
  }
  return [x, y, flag];
};

export const fetchStitches = ({ previousX = 0, previousY = 0 }, fetchBytes) => {
  let x = previousX;
  let y = previousY;

  const paths = [];
  let path = [null, [previousX, previousY]];

  const finishPath = () => {
    if (path.length > 2) {
      paths.push(path);
    }
    path = [null];
  };

  for (;;) {
    const [dx, dy, flag] = fetchStitch(fetchBytes);

    x += dx;
    y += dy;

    switch (flag) {
      default:
      case 'end': {
        finishPath();
        return paths;
      }
      case 'color_change': {
        finishPath();
        path.push([x, y]);
        break;
      }
      case 'jump': {
        finishPath();
        break;
      }
      case 'stitch': {
        path.push([x, y]);
      }
    }
  }
};

export const fromDst = async (options = {}, data) => {
  const fetcher = createByteFetcher(data);
  const header = fetchHeader({}, fetcher);
  return { paths: scale([0.1, 0.1, 0.1], fetchStitches(header, fetcher)) };
};
