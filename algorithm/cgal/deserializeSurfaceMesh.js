import { endTime, logInfo, startTime } from '@jsxcad/sys';
import { getCgal } from './getCgal.js';

export const deserializeSurfaceMesh = (text) => {
  const timer = startTime('algorithm/cgal/deserializeSurfaceMesh');
  const result = getCgal().DeserializeSurfaceMesh(text);
  const { average, last, sum } = endTime(timer);
  logInfo('algorithm/cgal/deserializeSurfaceMesh', `${last} (${sum}) [${average}]`);
  return result;
};
