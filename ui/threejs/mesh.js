import {
  Box3,
  BufferGeometry,
  Color,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Matrix3,
  Matrix4,
  Mesh,
  Path,
  Plane,
  Points,
  PointsMaterial,
  Quaternion,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
  VertexColors,
  WireframeGeometry,
} from '@jsxcad/algorithm-threejs';

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';

import { buildMeshMaterial } from './material.js';
import { setColor } from './color.js';

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

const updateUserData = (geometry, scene, userData) => {
  if (geometry.tags) {
    for (const tag of geometry.tags) {
      if (tag.startsWith('editId:')) {
        userData.editId = tag.substring(7);
      } else if (tag.startsWith('editType:')) {
        userData.editType = tag.substring(9);
      } else if (tag.startsWith('viewId:')) {
        userData.viewId = tag.substring(7);
      } else if (tag.startsWith('viewType:')) {
        userData.viewType = tag.substring(9);
      } else if (tag.startsWith('groupChildId:')) {
        // Deprecate these.
        userData.groupChildId = parseInt(tag.substring(13));
      }
    }
    userData.tags = geometry.tags;
  }
};

// https://gist.github.com/kevinmoran/b45980723e53edeb8a5a43c49f134724
const orient = (mesh, source, target, offset) => {
  const translation = new Matrix4();
  translation.makeTranslation(0, 0, -offset);
  mesh.applyMatrix4(translation);

  const cosA = target.clone().dot(source);

  if (cosA === 1) {
    return;
  }

  if (cosA === -1) {
    const w = 1;
    const cosAlpha = -1;
    const sinAlpha = 0;
    const matrix4 = new Matrix4();

    matrix4.set(
      w,
      0,
      0,
      0,
      0,
      cosAlpha,
      -sinAlpha,
      0,
      0,
      sinAlpha,
      cosAlpha,
      0,
      0,
      0,
      0,
      w
    );
    mesh.applyMatrix4(matrix4);
    return;
  }

  // Otherwise we need to build a matrix.

  const axis = new Vector3();
  axis.crossVectors(target, source);
  const k = 1 / (1 + cosA);

  const matrix3 = new Matrix3();
  matrix3.set(
    axis.x * axis.x * k + cosA,
    axis.y * axis.x * k - axis.z,
    axis.z * axis.x * k + axis.y,
    axis.x * axis.y * k + axis.z,
    axis.y * axis.y * k + cosA,
    axis.z * axis.y * k - axis.x,
    axis.x * axis.z * k - axis.y,
    axis.y * axis.z * k + axis.x,
    axis.z * axis.z * k + cosA
  );

  const matrix4 = new Matrix4();
  matrix4.setFromMatrix3(matrix3);

  const position = new Vector3();
  const quaternion = new Quaternion();
  const scale = new Vector3();

  matrix4.decompose(position, quaternion, scale);

  mesh.applyMatrix4(matrix4);
};

const parseRational = (text) => {
  if (text === '') {
    return 0;
  }
  let [numerator, denominator = '1'] = text.split('/');
  while (true) {
    const value = parseInt(numerator) / parseInt(denominator);
    if (!isFinite(value)) {
      // console.log(`Non-finite: ${numerator}/${denominator}`);
      numerator = numerator.substring(0, numerator.length - 1);
      denominator = denominator.substring(0, denominator.length - 1);
      continue;
    }
    return value;
  }
};

export const buildMeshes = async ({
  geometry,
  scene,
  render,
  definitions,
  pageSize = [],
}) => {
  if (geometry === undefined) {
    return;
  }
  const { tags = [] } = geometry;
  const layer = tags.includes('show:overlay') ? SKETCH_LAYER : GEOMETRY_LAYER;
  let mesh;
  switch (geometry.type) {
    case 'layout': {
      const [width, length] = geometry.layout.size;
      pageSize[0] = width;
      pageSize[1] = length;
      break;
    }
    case 'sketch':
    case 'displayGeometry':
    case 'group':
    case 'item':
    case 'plan':
      break;
    case 'segments': {
      const { segments } = geometry;
      const bufferGeometry = new BufferGeometry();
      const material = new LineBasicMaterial({
        color: new Color(setColor(definitions, tags, {}, [0, 0, 0]).color),
      });
      const positions = [];
      for (const segment of segments) {
        const [start, end] = segment;
        const [aX = 0, aY = 0, aZ = 0] = start;
        const [bX = 0, bY = 0, bZ = 0] = end;
        positions.push(aX, aY, aZ, bX, bY, bZ);
      }
      bufferGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      mesh = new LineSegments(bufferGeometry, material);
      mesh.layers.set(layer);
      updateUserData(geometry, scene, mesh.userData);
      scene.add(mesh);
      break;
    }
    case 'paths': {
      let transparent = false;
      let opacity = 1;
      const { paths } = geometry;
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
      mesh = new LineSegments(bufferGeometry, material);
      mesh.layers.set(layer);
      updateUserData(geometry, scene, mesh.userData);
      scene.add(mesh);
      break;
    }
    case 'points': {
      const { points } = geometry;
      const threeGeometry = new BufferGeometry();
      const material = new PointsMaterial({
        color: setColor(definitions, tags, {}, [0, 0, 0]).color,
        size: 0.5,
      });
      const positions = [];
      for (const [aX = 0, aY = 0, aZ = 0] of points) {
        positions.push(aX, aY, aZ);
      }
      threeGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      mesh = new Points(threeGeometry, material);
      mesh.layers.set(layer);
      updateUserData(geometry, scene, mesh.userData);
      scene.add(mesh);
      break;
    }
    case 'graph': {
      const { tags, graph } = geometry;
      const { serializedSurfaceMesh } = graph;
      if (serializedSurfaceMesh === undefined) {
        throw Error(`Graph is not serialized: ${JSON.stringify(geometry)}`);
      }
      const tokens = serializedSurfaceMesh
        .split(/\s+/g)
        .map((token) => parseRational(token));
      let p = 0;
      let vertexCount = tokens[p++];
      const vertices = [];
      while (vertexCount-- > 0) {
        // The first three are precise values that we don't use.
        p += 3;
        // These three are approximate values in 100th of mm that we will use.
        vertices.push([
          tokens[p++] / 100,
          tokens[p++] / 100,
          tokens[p++] / 100,
        ]);
      }
      let faceCount = tokens[p++];
      const positions = [];
      const normals = [];
      while (faceCount-- > 0) {
        let vertexCount = tokens[p++];
        if (vertexCount !== 3) {
          throw Error(
            `Faces must be triangles: vertexCount=${vertexCount} p=${p} serial=${serializedSurfaceMesh}`
          );
        }
        const triangle = [];
        while (vertexCount-- > 0) {
          const vertex = vertices[tokens[p++]];
          if (!vertex.every(isFinite)) {
            throw Error(`Non-finite vertex: ${vertex}`);
          }
          triangle.push(vertex);
        }
        const plane = new Plane();
        plane.setFromCoplanarPoints(
          new Vector3(...triangle[0]),
          new Vector3(...triangle[1]),
          new Vector3(...triangle[2])
        );
        positions.push(...triangle[0]);
        positions.push(...triangle[1]);
        positions.push(...triangle[2]);
        plane.normalize();
        const { x, y, z } = plane.normal;
        normals.push(x, y, z);
        normals.push(x, y, z);
        normals.push(x, y, z);
      }
      if (positions.length === 0) {
        break;
      }
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

      if (tags.includes('show:skin')) {
        const material = await buildMeshMaterial(definitions, tags);
        mesh = new Mesh(bufferGeometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.set(layer);
        updateUserData(geometry, scene, mesh.userData);
        mesh.userData.tangible = true;
        if (tags.includes('type:ghost')) {
          material.transparent = true;
          material.depthWrite = false;
          material.opacity *= 0.125;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      } else {
        mesh = new Group();
      }

      {
        const edges = new EdgesGeometry(bufferGeometry);
        const material = new LineBasicMaterial({ color: 0x000000 });
        const outline = new LineSegments(edges, material);
        outline.userData.isOutline = true;
        outline.userData.hasShowOutline = tags.includes('show:outline');
        outline.visible = outline.userData.hasShowOutline;
        if (tags.includes('type:ghost')) {
          material.transparent = true;
          material.depthWrite = false;
          material.opacity *= 0.25;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
        mesh.add(outline);
      }

      if (tags.includes('show:wireframe')) {
        const edges = new WireframeGeometry(bufferGeometry);
        const outline = new LineSegments(
          edges,
          new LineBasicMaterial({ color: 0x000000 })
        );
        mesh.add(outline);
      }

      scene.add(mesh);
      break;
    }
    case 'polygonsWithHoles': {
      const normal = new Vector3(
        geometry.plane[0],
        geometry.plane[1],
        geometry.plane[2]
      ).normalize();
      const baseNormal = new Vector3(0, 0, 1);
      const meshes = new Group();
      for (const { points, holes } of geometry.polygonsWithHoles) {
        const boundaryPoints = [];
        for (const point of points) {
          boundaryPoints.push(new Vector3(point[0], point[1], point[2]));
        }
        const shape = new Shape(boundaryPoints);
        for (const { points } of holes) {
          const holePoints = [];
          for (const point of points) {
            holePoints.push(new Vector3(point[0], point[1], point[2]));
          }
          shape.holes.push(new Path(holePoints));
        }
        const shapeGeometry = new ShapeGeometry(shape);
        if (tags.includes('show:skin')) {
          const material = await buildMeshMaterial(definitions, tags);
          mesh = new Mesh(shapeGeometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.layers.set(layer);
          updateUserData(geometry, scene, mesh.userData);
          mesh.userData.tangible = true;
          if (tags.includes('type:ghost')) {
            material.transparent = true;
            material.depthWrite = false;
            material.opacity *= 0.125;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
          }
        } else {
          mesh = new Group();
        }

        {
          const edges = new EdgesGeometry(shapeGeometry);
          const material = new LineBasicMaterial({ color: 0x000000 });
          const outline = new LineSegments(edges, material);
          outline.userData.isOutline = true;
          outline.userData.hasShowOutline = tags.includes('show:outline');
          outline.visible = outline.userData.hasShowOutline;
          if (tags.includes('type:ghost')) {
            material.transparent = true;
            material.depthWrite = false;
            material.opacity *= 0.25;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
          }
          mesh.add(outline);
        }

        if (tags.includes('show:wireframe')) {
          const edges = new WireframeGeometry(shapeGeometry);
          const outline = new LineSegments(
            edges,
            new LineBasicMaterial({ color: 0x000000 })
          );
          mesh.add(outline);
        }
        meshes.add(mesh);
      }
      mesh = meshes;
      scene.add(mesh);
      // Need to handle the origin shift.
      orient(mesh, normal, baseNormal, geometry.plane[3]);
      break;
    }
    default:
      throw Error(`Non-display geometry: ${geometry.type}`);
  }

  if (mesh && geometry.matrix) {
    const matrix = new Matrix4();
    // Bypass matrix.set to use column-major ordering.
    for (let nth = 0; nth < 16; nth++) {
      matrix.elements[nth] = geometry.matrix[nth];
    }
    mesh.applyMatrix4(matrix);
    mesh.updateMatrix();
  }

  if (geometry.content) {
    if (mesh === undefined) {
      mesh = new Group();
      updateUserData({}, scene, mesh.userData);
      scene.add(mesh);
    }
    for (const content of geometry.content) {
      await buildMeshes({
        geometry: content,
        scene: mesh,
        layer,
        render,
        definitions,
      });
    }
  }
};
