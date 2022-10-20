import {
  load as loadGeometry,
  loadNonblocking as loadNonblockingGeometry,
} from '@jsxcad/geometry';
import { logInfo, read, readNonblocking } from '@jsxcad/sys';

import Shape from './Shape.js';

export const load = async (path) => {
  logInfo('api/shape/load', path);

  const walk = async (data) => {
    if (typeof data !== 'object') {
      return data;
    }
    if (data instanceof Array) {
      const walked = [];
      for (let nth = 0; nth < data.length; nth++) {
        walked[nth] = await walk(data[nth]);
      }
      return walked;
    }
    if (data.geometry) {
      return Shape.fromGeometry(await loadGeometry(data.geometry));
    }
    const walked = {};
    for (const key of Object.keys(data)) {
      walked[key] = await walk(data[key]);
    }
    return walked;
  };
  const rawData = await read(path);
  const data = await walk(rawData);
  return data;
};

export const loadGeometryNonblocking = (path) => {
  logInfo('api/shape/loadNonblocking', path);

  const walk = (data) => {
    if (typeof data !== 'object') {
      return data;
    }
    if (data instanceof Array) {
      const walked = [];
      for (let nth = 0; nth < data.length; nth++) {
        walked[nth] = walk(data[nth]);
      }
      return walked;
    }
    if (data.geometry) {
      return Shape.fromGeometry(loadNonblockingGeometry(data.geometry));
    }
    const walked = {};
    for (const key of Object.keys(data)) {
      walked[key] = walk(data[key]);
    }
    return walked;
  };
  const data = walk(readNonblocking(path));
  return data;
};
