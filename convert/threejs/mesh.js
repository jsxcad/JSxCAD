import {
  Box3,
  BufferGeometry,
  Color,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  Path,
  Plane,
  Points,
  PointsMaterial,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
  WireframeGeometry,
} from '@jsxcad/algorithm-threejs';

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';
import {
  TRANSFORM_APPROXIMATE,
  TRANSFORM_IDENTITY,
} from '@jsxcad/algorithm-cgal';

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

const parseRational = (text) => {
  if (text === '') {
    return 0;
  }
  return parseInt(text);
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
  let matrix;

  if (geometry.matrix) {
    matrix = new Matrix4();
    // Bypass matrix.set to use column-major ordering.
    switch (geometry.matrix[0]) {
      case TRANSFORM_APPROXIMATE: {
        for (let nth = 0; nth < 16; nth++) {
          matrix.elements[nth] = geometry.matrix[1][nth];
        }
        break;
      }
      case TRANSFORM_IDENTITY: {
        // Identity matrix is the default.
        break;
      }
      default: {
        throw new Error(`Unexpected matrix type: ${geometry.matrix[0]}. Geometry=${JSON.stringify(geometry)}`);
      }
    }
  }

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
        linewidth: 2,
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
        // These three are approximate values in 1000th of mm that we will use.
        vertices.push([
          tokens[p++] / 1000,
          tokens[p++] / 1000,
          tokens[p++] / 1000,
        ]);
      }
      let faceCount = tokens[p++];
      const positions = [];
      const normals = [];
      while (faceCount-- > 0) {
        let vertexCount = tokens[p++];
        if (vertexCount !== 3) {
          throw Error(
            `Faces must be triangles: vertexCount=${vertexCount} p=${p} ps=${tokens
              .slice(p, p + 10)
              .join(' ')} serial=${serializedSurfaceMesh}`
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

      if (!tags.includes('show:noSkin')) {
        const material = await buildMeshMaterial(definitions, tags);
        mesh = new Mesh(bufferGeometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.set(layer);
        updateUserData(geometry, scene, mesh.userData);
        mesh.userData.tangible = true;
        if (tags.includes('type:ghost')) {
          mesh.userData.tangible = false;
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
        const edges = new EdgesGeometry(
          bufferGeometry,
          /* thresholdAngle= */ 20
        );
        const material = new LineBasicMaterial({ color: 0x000000 });
        const outline = new LineSegments(edges, material);
        outline.userData.isOutline = true;
        outline.userData.hasShowOutline = !tags.includes('show:noOutline');
        outline.visible = outline.userData.hasShowOutline;
        if (tags.includes('type:ghost')) {
          mesh.userData.tangible = false;
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
      const baseNormal = new Vector3(0, 0, 1);
      const plane = new Plane(baseNormal, 0);
      const meshes = new Group();
      for (const { points, holes } of geometry.polygonsWithHoles) {
        const boundaryPoints = [];
        for (const p2 of points) {
          const p3 = new Vector3(p2[0], p2[1], 0);
          plane.projectPoint(p3, p3);
          boundaryPoints.push(p3);
        }
        const shape = new Shape(boundaryPoints);
        for (const { points } of holes) {
          const holePoints = [];
          for (const p2 of points) {
            const p3 = new Vector3(p2[0], p2[1], 0);
            plane.projectPoint(p3, p3);
            holePoints.push(p3);
          }
          shape.holes.push(new Path(holePoints));
        }
        const shapeGeometry = new ShapeGeometry(shape);
        if (!tags.includes('show:noSkin')) {
          const material = await buildMeshMaterial(definitions, tags);
          mesh = new Mesh(shapeGeometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.layers.set(layer);
          updateUserData(geometry, scene, mesh.userData);
          mesh.userData.tangible = true;
          if (tags.includes('type:ghost')) {
            mesh.userData.tangible = false;
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
          const material = new LineBasicMaterial({
            color: 0x000000,
            linewidth: 1,
          });
          const outline = new LineSegments(edges, material);
          outline.userData.isOutline = true;
          outline.userData.hasShowOutline = !tags.includes('show:noOutline');
          outline.visible = outline.userData.hasShowOutline;
          if (tags.includes('type:ghost')) {
            mesh.userData.tangible = false;
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
      // orient(mesh, normal, baseNormal, geometry.plane[3]);
      break;
    }
    default:
      throw Error(`Non-display geometry: ${geometry.type}`);
  }

  if (mesh && geometry.matrix) {
    mesh.applyMatrix4(matrix);
  }

  if (mesh) {
    mesh.updateMatrix();
    mesh.updateMatrixWorld();
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
