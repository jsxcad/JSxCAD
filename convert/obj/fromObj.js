import { fromPolygons, taggedGroup } from '@jsxcad/geometry';

import ObjFile from 'obj-file-parser';

export const fromObjSync = (data) => {
  const { models } = new ObjFile(new TextDecoder('utf8').decode(data)).parse();
  const group = [];
  for (const model of models) {
    const { vertices, faces } = model;
    const polygons = [];
    for (const face of faces) {
      const polygon = face.vertices.map(({ vertexIndex }) => {
        const { x, y, z } = vertices[vertexIndex - 1];
        return [x, y, z];
      });
      polygons.push({ points: polygon });
    }
    group.push(fromPolygons({}, polygons));
  }
  return taggedGroup({}, ...group);
};

export const fromObj = async (data) => fromObjSync(data);
