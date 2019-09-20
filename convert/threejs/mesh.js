import * as THREE from 'three';

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

  // geom.removeAttribute('uv');
  if (geom.attributes.uv === undefined) {
    geom.addAttribute('uv', new THREE.Float32BufferAttribute(coords, 2));
  }

  // maps 3 verts of 1 face on the better side of the cube
  // side of the cube can be XY, XZ or YZ
  const makeUVs = (v0, v1, v2) => {
    // pre-rotate the model so that cube sides match world axis
    v0.applyMatrix4(transformMatrix);
    v1.applyMatrix4(transformMatrix);
    v2.applyMatrix4(transformMatrix);

    // get normal of the face, to know into which cube side it maps better
    let n = new THREE.Vector3();
    n.crossVectors(v1.clone().sub(v0), v1.clone().sub(v2)).normalize();

    n.x = Math.abs(n.x);
    n.y = Math.abs(n.y);
    n.z = Math.abs(n.z);

    let uv0 = new THREE.Vector2();
    let uv1 = new THREE.Vector2();
    let uv2 = new THREE.Vector2();
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

      const v0 = new THREE.Vector3(vx0, vy0, vz0);
      const v1 = new THREE.Vector3(vx1, vy1, vz1);
      const v2 = new THREE.Vector3(vx2, vy2, vz2);

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

      const v0 = new THREE.Vector3(vx0, vy0, vz0);
      const v1 = new THREE.Vector3(vx1, vy1, vz1);
      const v2 = new THREE.Vector3(vx2, vy2, vz2);

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
    transformMatrix = new THREE.Matrix4();
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

  const uvBbox = new THREE.Box3(new THREE.Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2),
                                new THREE.Vector3(boxSize / 2, boxSize / 2, boxSize / 2));

  applyBoxUVImpl(bufferGeometry, transformMatrix, uvBbox, boxSize);
};

export const buildMeshes = ({ datasets, threejsGeometry, scene }) => {
  const { tags } = threejsGeometry;
  if (threejsGeometry.assembly) {
    threejsGeometry.assembly.forEach(threejsGeometry => buildMeshes({ datasets, threejsGeometry, scene }));
  } else if (threejsGeometry.item) {
    buildMeshes({ datasets, threejsGeometry: threejsGeometry.item, scene });
  } else if (threejsGeometry.threejsSegments) {
    const segments = threejsGeometry.threejsSegments;
    const dataset = {};
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors });
    const color = new THREE.Color(setColor(tags, {}, [0, 0, 0]).color);
    for (const [[aX, aY, aZ], [bX, bY, bZ]] of segments) {
      geometry.colors.push(color, color);
      geometry.vertices.push(new THREE.Vector3(aX, aY, aZ), new THREE.Vector3(bX, bY, bZ));
    }
    dataset.mesh = new THREE.LineSegments(geometry, material);
    dataset.name = toName(threejsGeometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  } else if (threejsGeometry.threejsSolid) {
    const { positions, normals } = threejsGeometry.threejsSolid;
    const dataset = {};
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    applyBoxUV(geometry);
    const material = buildMeshMaterial(tags);
    dataset.mesh = new THREE.Mesh(geometry, material);
    dataset.name = toName(threejsGeometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  } else if (threejsGeometry.threejsSurface) {
    const { positions, normals } = threejsGeometry.threejsSurface;
    const dataset = {};
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    const material = buildMeshMaterial(tags);
    dataset.mesh = new THREE.Mesh(geometry, material);
    dataset.name = toName(threejsGeometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  }
};

export const drawHud = ({ camera, datasets, threejsGeometry, hudCanvas }) => {
  if (threejsGeometry === undefined) {
    return;
  }
  const ctx = hudCanvas.getContext('2d');
  ctx.fillStyle = '#00FF00';
  ctx.strokeStyle = '#000000';
  ctx.font = '30px "Arial Black", Gadget, sans-serif';
  const walk = (threejsGeometry) => {
    if (threejsGeometry.assembly) {
      threejsGeometry.assembly.forEach(walk);
    } else if (threejsGeometry.threejsPlan) {
      const { threejsPlan, threejsMarks } = threejsGeometry;
      const { label } = threejsPlan;
      if (label) {
        const vector = new THREE.Vector3();
        vector.set(...threejsMarks[0]);
        // map to normalized device coordinate (NDC) space
        vector.project(camera);
        // map to 2D screen space
        const x = Math.round((0 + vector.x + 1) * hudCanvas.width / 2);
        const y = Math.round((0 - vector.y + 1) * hudCanvas.height / 2);
        const [dX, dY] = [x + 0, y - 0];
        // ctx.moveTo(x, y);
        // ctx.lineTo(dY, dY);
        // ctx.stroke();
        ctx.fillText(label, dX, dY);
        ctx.strokeText(label, dX, dY);
      }
    }
  };
  walk(threejsGeometry);
};
