import {
  Box3,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Geometry,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  Points,
  PointsMaterial,
  Vector2,
  Vector3,
  VertexColors,
} from 'three';

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';

import { buildMeshMaterial } from './material.js';
import { setColor } from './color.js';
import { toPlane } from '@jsxcad/math-poly3';

const toName = (geometry) => {
  if (geometry.tags !== undefined && geometry.tags.length >= 1) {
    for (const tag of geometry.tags) {
      if (tag.startsWith('user/')) {
        return tag.substring(5);
      }
    }
  }
};

// FIX: Found it somewhere -- attribute.
const applyBoxUVImpl = (geom, transformMatrix, bbox, bboxMaxSize) => {
  const coords = [];
  coords.length = (2 * geom.attributes.position.array.length) / 3;

  if (geom.attributes.uv === undefined) {
    geom.setAttribute('uv', new Float32BufferAttribute(coords, 2));
  }

  // maps 3 verts of 1 face on the better side of the cube
  // side of the cube can be XY, XZ or YZ
  const makeUVs = (v0, v1, v2) => {
    // pre-rotate the model so that cube sides match world axis
    v0.applyMatrix4(transformMatrix);
    v1.applyMatrix4(transformMatrix);
    v2.applyMatrix4(transformMatrix);

    // get normal of the face, to know into which cube side it maps better
    let n = new Vector3();
    n.crossVectors(v1.clone().sub(v0), v1.clone().sub(v2)).normalize();

    n.x = Math.abs(n.x);
    n.y = Math.abs(n.y);
    n.z = Math.abs(n.z);

    let uv0 = new Vector2();
    let uv1 = new Vector2();
    let uv2 = new Vector2();
    // xz mapping
    if (n.y > n.x && n.y > n.z) {
      uv0.x = (v0.x - bbox.min.x) / bboxMaxSize;
      uv0.y = (bbox.max.z - v0.z) / bboxMaxSize;

      uv1.x = (v1.x - bbox.min.x) / bboxMaxSize;
      uv1.y = (bbox.max.z - v1.z) / bboxMaxSize;

      uv2.x = (v2.x - bbox.min.x) / bboxMaxSize;
      uv2.y = (bbox.max.z - v2.z) / bboxMaxSize;
    } else if (n.x > n.y && n.x > n.z) {
      uv0.x = (v0.z - bbox.min.z) / bboxMaxSize;
      uv0.y = (v0.y - bbox.min.y) / bboxMaxSize;

      uv1.x = (v1.z - bbox.min.z) / bboxMaxSize;
      uv1.y = (v1.y - bbox.min.y) / bboxMaxSize;

      uv2.x = (v2.z - bbox.min.z) / bboxMaxSize;
      uv2.y = (v2.y - bbox.min.y) / bboxMaxSize;
    } else if (n.z > n.y && n.z > n.x) {
      uv0.x = (v0.x - bbox.min.x) / bboxMaxSize;
      uv0.y = (v0.y - bbox.min.y) / bboxMaxSize;

      uv1.x = (v1.x - bbox.min.x) / bboxMaxSize;
      uv1.y = (v1.y - bbox.min.y) / bboxMaxSize;

      uv2.x = (v2.x - bbox.min.x) / bboxMaxSize;
      uv2.y = (v2.y - bbox.min.y) / bboxMaxSize;
    }

    return { uv0, uv1, uv2 };
  };

  if (geom.index) {
    // is it indexed buffer geometry?
    for (let vi = 0; vi < geom.index.array.length; vi += 3) {
      const idx0 = geom.index.array[vi];
      const idx1 = geom.index.array[vi + 1];
      const idx2 = geom.index.array[vi + 2];

      const vx0 = geom.attributes.position.array[3 * idx0];
      const vy0 = geom.attributes.position.array[3 * idx0 + 1];
      const vz0 = geom.attributes.position.array[3 * idx0 + 2];

      const vx1 = geom.attributes.position.array[3 * idx1];
      const vy1 = geom.attributes.position.array[3 * idx1 + 1];
      const vz1 = geom.attributes.position.array[3 * idx1 + 2];

      const vx2 = geom.attributes.position.array[3 * idx2];
      const vy2 = geom.attributes.position.array[3 * idx2 + 1];
      const vz2 = geom.attributes.position.array[3 * idx2 + 2];

      const v0 = new Vector3(vx0, vy0, vz0);
      const v1 = new Vector3(vx1, vy1, vz1);
      const v2 = new Vector3(vx2, vy2, vz2);

      const uvs = makeUVs(v0, v1, v2, coords);

      coords[2 * idx0] = uvs.uv0.x;
      coords[2 * idx0 + 1] = uvs.uv0.y;

      coords[2 * idx1] = uvs.uv1.x;
      coords[2 * idx1 + 1] = uvs.uv1.y;

      coords[2 * idx2] = uvs.uv2.x;
      coords[2 * idx2 + 1] = uvs.uv2.y;
    }
  } else {
    for (let vi = 0; vi < geom.attributes.position.array.length; vi += 9) {
      const vx0 = geom.attributes.position.array[vi];
      const vy0 = geom.attributes.position.array[vi + 1];
      const vz0 = geom.attributes.position.array[vi + 2];

      const vx1 = geom.attributes.position.array[vi + 3];
      const vy1 = geom.attributes.position.array[vi + 4];
      const vz1 = geom.attributes.position.array[vi + 5];

      const vx2 = geom.attributes.position.array[vi + 6];
      const vy2 = geom.attributes.position.array[vi + 7];
      const vz2 = geom.attributes.position.array[vi + 8];

      const v0 = new Vector3(vx0, vy0, vz0);
      const v1 = new Vector3(vx1, vy1, vz1);
      const v2 = new Vector3(vx2, vy2, vz2);

      const uvs = makeUVs(v0, v1, v2, coords);

      const idx0 = vi / 3;
      const idx1 = idx0 + 1;
      const idx2 = idx0 + 2;

      coords[2 * idx0] = uvs.uv0.x;
      coords[2 * idx0 + 1] = uvs.uv0.y;

      coords[2 * idx1] = uvs.uv1.x;
      coords[2 * idx1 + 1] = uvs.uv1.y;

      coords[2 * idx2] = uvs.uv2.x;
      coords[2 * idx2 + 1] = uvs.uv2.y;
    }
  }

  geom.attributes.uv.array = new Float32Array(coords);
};

const applyBoxUV = (bufferGeometry, transformMatrix, boxSize) => {
  if (transformMatrix === undefined) {
    transformMatrix = new Matrix4();
  }

  if (boxSize === undefined) {
    const geom = bufferGeometry;
    geom.computeBoundingBox();
    const bbox = geom.boundingBox;

    const bboxSizeX = bbox.max.x - bbox.min.x;
    const bboxSizeY = bbox.max.y - bbox.min.y;
    const bboxSizeZ = bbox.max.z - bbox.min.z;

    boxSize = Math.max(bboxSizeX, bboxSizeY, bboxSizeZ);
  }

  const uvBbox = new Box3(
    new Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2),
    new Vector3(boxSize / 2, boxSize / 2, boxSize / 2)
  );

  applyBoxUVImpl(bufferGeometry, transformMatrix, uvBbox, boxSize);
};

export const buildMeshes = async ({
  datasets,
  geometry,
  scene,
  layer = GEOMETRY_LAYER,
  render,
  definitions,
}) => {
  if (geometry === undefined) {
    return;
  }
  const { tags = [] } = geometry;
  switch (geometry.type) {
    case 'displayGeometry':
    case 'assembly':
    case 'disjointAssembly':
    case 'layers':
    case 'layout':
    case 'item':
    case 'plan':
      break;
    case 'sketch':
      layer = SKETCH_LAYER;
      break;
    case 'paths': {
      let transparent = false;
      let opacity = 1;
      if (tags && tags.includes('path/Toolpath')) {
        // Put toolpaths in the sketch layer.
        layer = SKETCH_LAYER;
        opacity = 0.5;
        transparent = true;
      }
      const { paths } = geometry;
      const dataset = {};
      const bufferGeometry = new BufferGeometry();
      const material = new LineBasicMaterial({
        color: 0xffffff,
        vertexColors: VertexColors,
        transparent,
        opacity,
      });
      const color = new Color(setColor(definitions, tags, {}, [0, 0, 0]).color);
      const pathColors = [];
      const positions = [];
      const index = [];
      for (const path of paths) {
        const entry = { start: Math.floor(positions.length / 3), length: 0 };
        let last = path.length - 1;
        for (let nth = 0; nth < path.length; last = nth, nth += 1) {
          const start = path[last];
          const end = path[nth];
          if (start === null || end === null) continue;
          if (!start.every(isFinite) || !end.every(isFinite)) {
            // Not sure where these non-finite path values are coming from.
            continue;
          }
          const [aX = 0, aY = 0, aZ = 0] = start;
          const [bX = 0, bY = 0, bZ = 0] = end;
          pathColors.push(
            color.r,
            color.g,
            color.b,
            opacity,
            color.r,
            color.g,
            color.b,
            opacity
          );
          if (!isFinite(aX)) throw Error('die');
          if (!isFinite(aY)) throw Error('die');
          if (!isFinite(aZ)) throw Error('die');
          if (!isFinite(bX)) throw Error('die');
          if (!isFinite(bY)) throw Error('die');
          if (!isFinite(bZ)) throw Error('die');
          positions.push(aX, aY, aZ, bX, bY, bZ);
          entry.length += 2;
        }
        if (entry.length > 0) {
          index.push(entry);
        }
      }
      bufferGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      bufferGeometry.setAttribute(
        'color',
        new Float32BufferAttribute(pathColors, 4)
      );
      dataset.mesh = new LineSegments(bufferGeometry, material);
      dataset.mesh.layers.set(layer);
      dataset.name = toName(geometry);
      scene.add(dataset.mesh);
      datasets.push(dataset);
      if (render && tags.includes('display/trace')) {
        let current = 0;
        let extent = 0;
        const animate = () => {
          if (dataset.mesh) {
            const bufferGeometry = dataset.mesh.geometry;
            extent += index[current].length;
            // geometry.setDrawRange(index[current].start, extent - index[current].start);
            bufferGeometry.setDrawRange(0, (extent += index[current].length));
            bufferGeometry.attributes.position.needsUpdate = true;
            render();
            current += 1;
            if (current >= index.length) {
              current = 0;
              extent = 0;
            }
            setTimeout(animate, 100);
          }
        };
        animate();
      }
      break;
    }
    case 'points': {
      const { points } = geometry;
      const dataset = {};
      const threeGeometry = new Geometry();
      const material = new PointsMaterial({
        color: setColor(definitions, tags, {}, [0, 0, 0]).color,
        size: 0.5,
      });
      for (const [aX = 0, aY = 0, aZ = 0] of points) {
        threeGeometry.vertices.push(new Vector3(aX, aY, aZ));
      }
      dataset.mesh = new Points(threeGeometry, material);
      dataset.mesh.layers.set(layer);
      dataset.name = toName(geometry);
      scene.add(dataset.mesh);
      datasets.push(dataset);
      break;
    }
    case 'triangles': {
      const prepareTriangles = (triangles) => {
        const normals = [];
        const positions = [];
        for (const triangle of triangles) {
          const plane = toPlane(triangle);
          if (plane === undefined) {
            continue;
          }
          const [px, py, pz] = plane;
          for (const [x = 0, y = 0, z = 0] of triangle) {
            normals.push(px, py, pz);
            positions.push(x, y, z);
          }
        }
        return { normals, positions };
      };

      const { triangles } = geometry;
      const { positions, normals } = prepareTriangles(triangles);
      const dataset = {};
      const bufferGeometry = new BufferGeometry();
      bufferGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      bufferGeometry.setAttribute(
        'normal',
        new Float32BufferAttribute(normals, 3)
      );
      applyBoxUV(bufferGeometry);
      const material = await buildMeshMaterial(definitions, tags);
      if (tags.includes('compose/non-positive')) {
        material.transparent = true;
        material.opacity *= 0.2;
      }
      dataset.mesh = new Mesh(bufferGeometry, material);
      dataset.mesh.layers.set(layer);
      dataset.name = toName(geometry);
      scene.add(dataset.mesh);
      datasets.push(dataset);
      break;
    }
    default:
      throw Error(`Non-display geometry: ${geometry.type}`);
  }

  if (geometry.content) {
    for (const content of geometry.content) {
      await buildMeshes({
        datasets,
        geometry: content,
        scene,
        layer,
        render,
        definitions,
      });
    }
  }
};
