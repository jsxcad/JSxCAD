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

// import { add, normalize, scale, subtract } from '@jsxcad/math-vec2';

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

export const buildMeshes = ({ datasets, threejsGeometry, scene, layer = GEOMETRY_LAYER }) => {
  const { tags } = threejsGeometry;
  if (threejsGeometry.assembly) {
    threejsGeometry.assembly.forEach(threejsGeometry => buildMeshes({ datasets, threejsGeometry, scene, layer }));
  } else if (threejsGeometry.item) {
    buildMeshes({ datasets, threejsGeometry: threejsGeometry.item, scene });
  } else if (threejsGeometry.threejsSegments) {
    const segments = threejsGeometry.threejsSegments;
    const dataset = {};
    const geometry = new Geometry();
    const material = new LineBasicMaterial({ color: 0xffffff, vertexColors: VertexColors });
    const color = new Color(setColor(tags, {}, [0, 0, 0]).color);
    for (const [[aX, aY, aZ], [bX, bY, bZ]] of segments) {
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
    const material = buildMeshMaterial(tags);
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
    const material = buildMeshMaterial(tags);
    dataset.mesh = new Mesh(geometry, material);
    dataset.mesh.layers.set(layer);
    dataset.name = toName(threejsGeometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  } else if (threejsGeometry.threejsPlan) {
    buildMeshes({ datasets, threejsGeometry: threejsGeometry.threejsContent, scene, layer: GEOMETRY_LAYER });
    buildMeshes({ datasets, threejsGeometry: threejsGeometry.threejsVisualization, scene, layer: PLAN_LAYER });
  }
};

export const drawHud = ({ camera, datasets, threejsGeometry, hudCanvas }) => {
  if (threejsGeometry === undefined) {
    return;
  }

  const project = (point) => {
    const vector = new Vector3();
    vector.set(...point);
    // map to normalized device coordinate (NDC) space
    vector.project(camera);
    // map to 2D screen space
    const x = Math.round((0 + vector.x + 1) * hudCanvas.width / 2);
    const y = Math.round((0 - vector.y + 1) * hudCanvas.height / 2);
    return [x, y];
  };

  const ctx = hudCanvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#000000';
  // ctx.font = '16px "Arial Black", Gadget, sans-serif';
  ctx.font = '16px "Courier", Gadget, sans-serif';
  const margin = 10;

  const drawLabel = (label, x, y) => {
    ctx.shadowBlur = 7;
    ctx.setLineDash([3, 3]);

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(x, y);
    ctx.lineTo(margin + ctx.measureText(label).width + margin, y);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.strokeText(label, margin, y);
    ctx.fillText(label, margin, y);

    ctx.shadowBlur = 0;
  };

  const walk = (threejsGeometry) => {
    if (threejsGeometry.assembly) {
      threejsGeometry.assembly.forEach(walk);
    } else if (threejsGeometry.threejsPlan) {
      const { threejsPlan, threejsMarks, threejsVisualization } = threejsGeometry;
      if (threejsPlan.label) {
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 7;

        const [dX, dY] = project(threejsMarks[0]);
        ctx.beginPath();
        ctx.arc(dX, dY, 4, 0, Math.PI * 2);
        ctx.stroke();
        drawLabel(threejsPlan.label, dX, dY);
      } else if (threejsPlan.connector) {
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 7;

        const ORIGIN = 0;
        // const AXIS = 1;
        const ORIENTATION = 2;
        const END = 3;

        const [originX, originY] = project(threejsMarks[ORIGIN]);
        const [endX, endY] = project(threejsMarks[END]);
        const [orientationX, orientationY] = project(threejsMarks[ORIENTATION]);

        // const normalizedLine = (origin, point, length) =>
        //  add(origin, scale(length, normalize(subtract(point, origin))));

        // const [endXN, endYN] = normalizedLine([originX, originY], [endX, endY], 25 / 2);
        // const [orientationXN, orientationYN] = normalizedLine([originX, originY], [orientationX, orientationY], 100 / 2);

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(endX, endY);
        ctx.lineTo(originX, originY);
        ctx.lineTo(orientationX, orientationY);
        ctx.closePath();
        ctx.stroke();

        drawLabel(threejsPlan.connector, originX, originY);
      }
      if (threejsVisualization) {
        walk(threejsVisualization);
      }
    }
  };
  walk(threejsGeometry);
};
