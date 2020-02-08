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
  Vector2,
  Vector3,
  VertexColors
} from 'three';

import { buildMeshMaterial } from './material';
import { setColor } from './color';

const toName = (threejsGeometry) => {
  if (threejsGeometry.tags !== undefined && threejsGeometry.tags.length >= 1) {
    for (const tag of threejsGeometry.tags) {
      if (tag.startsWith('user/')) {
        return tag.substring(5);
      }
    }
  }
};

// FIX: Found it somewhere -- attribute.
const applyBoxUVImpl = (geom, transformMatrix, bbox, bboxMaxSize) => {
  const coords = [];
  coords.length = 2 * geom.attributes.position.array.length / 3;

  if (geom.attributes.uv === undefined) {
    geom.addAttribute('uv', new Float32BufferAttribute(coords, 2));
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
    } else
    if (n.x > n.y && n.x > n.z) {
      uv0.x = (v0.z - bbox.min.z) / bboxMaxSize;
      uv0.y = (v0.y - bbox.min.y) / bboxMaxSize;

      uv1.x = (v1.z - bbox.min.z) / bboxMaxSize;
      uv1.y = (v1.y - bbox.min.y) / bboxMaxSize;

      uv2.x = (v2.z - bbox.min.z) / bboxMaxSize;
      uv2.y = (v2.y - bbox.min.y) / bboxMaxSize;
    } else
    if (n.z > n.y && n.z > n.x) {
      uv0.x = (v0.x - bbox.min.x) / bboxMaxSize;
      uv0.y = (v0.y - bbox.min.y) / bboxMaxSize;

      uv1.x = (v1.x - bbox.min.x) / bboxMaxSize;
      uv1.y = (v1.y - bbox.min.y) / bboxMaxSize;

      uv2.x = (v2.x - bbox.min.x) / bboxMaxSize;
      uv2.y = (v2.y - bbox.min.y) / bboxMaxSize;
    }

    return { uv0, uv1, uv2 };
  };

  if (geom.index) { // is it indexed buffer geometry?
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

  const uvBbox = new Box3(new Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2),
                          new Vector3(boxSize / 2, boxSize / 2, boxSize / 2));

  applyBoxUVImpl(bufferGeometry, transformMatrix, uvBbox, boxSize);
};

const GEOMETRY_LAYER = 0;
const PLAN_LAYER = 1;

export const buildMeshes = async ({ datasets, threejsGeometry, scene, layer = GEOMETRY_LAYER }) => {
  const { tags } = threejsGeometry;
  if (threejsGeometry.assembly) {
    for (const subGeometry of threejsGeometry.assembly) {
      await buildMeshes({ datasets, threejsGeometry: subGeometry, scene, layer });
    }
  } else if (threejsGeometry.item) {
    await buildMeshes({ datasets, threejsGeometry: threejsGeometry.item, scene });
  } else if (threejsGeometry.threejsSegments) {
    const segments = threejsGeometry.threejsSegments;
    const dataset = {};
    const geometry = new Geometry();
    const material = new LineBasicMaterial({ color: 0xffffff, vertexColors: VertexColors });
    const color = new Color(setColor(tags, {}, [0, 0, 0]).color);
    for (const [[aX = 0, aY = 0, aZ = 0], [bX = 0, bY = 0, bZ = 0]] of segments) {
      geometry.colors.push(color, color);
      geometry.vertices.push(new Vector3(aX, aY, aZ), new Vector3(bX, bY, bZ));
    }
    dataset.mesh = new LineSegments(geometry, material);
    dataset.mesh.layers.set(layer);
    dataset.name = toName(threejsGeometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  } else if (threejsGeometry.threejsSolid) {
    const { positions, normals } = threejsGeometry.threejsSolid;
    const dataset = {};
    const geometry = new BufferGeometry();
    geometry.addAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.addAttribute('normal', new Float32BufferAttribute(normals, 3));
    applyBoxUV(geometry);
    const material = await buildMeshMaterial(tags);
    dataset.mesh = new Mesh(geometry, material);
    dataset.mesh.layers.set(layer);
    dataset.name = toName(threejsGeometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  } else if (threejsGeometry.threejsSurface) {
    const { positions, normals } = threejsGeometry.threejsSurface;
    const dataset = {};
    const geometry = new BufferGeometry();
    geometry.addAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.addAttribute('normal', new Float32BufferAttribute(normals, 3));
    applyBoxUV(geometry);
    const material = await buildMeshMaterial(tags);
    dataset.mesh = new Mesh(geometry, material);
    dataset.mesh.layers.set(layer);
    dataset.name = toName(threejsGeometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  } else if (threejsGeometry.threejsPlan) {
    await buildMeshes({ datasets, threejsGeometry: threejsGeometry.threejsVisualization, scene, layer: PLAN_LAYER });
    await buildMeshes({ datasets, threejsGeometry: threejsGeometry.threejsContent, scene, layer: GEOMETRY_LAYER });
  }
};
