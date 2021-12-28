import { endTime, logInfo, startTime } from '@jsxcad/sys';
import { getCgal } from './getCgal.js';

export const serializeSurfaceMesh = (mesh) => {
  const timer = startTime('algorithm/cgal/serializeSurfaceMesh');
  const result = getCgal().SerializeSurfaceMesh(mesh, (vertex, numberOfVertices) => {
    throw Error(`Vertex ${vertex} out of range ${numberOfVertices}`);
  });
  const { average, last, sum } = endTime(timer);
  logInfo('algorithm/cgal/serializeSurfaceMesh', `${last} (${sum}) [${average}]`);
  return result;
};
