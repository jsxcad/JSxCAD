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

export const buildMeshes = ({ datasets, threejsGeometry, scene }) => {
  const { tags } = threejsGeometry;
  if (threejsGeometry.assembly) {
    threejsGeometry.assembly.forEach(buildMeshes({ datasets, threejsGeometry, scene }));
  } else if (threejsGeometry.threejsSegments) {
    const segments = threejsGeometry.threejsSegments;
    const dataset = {};
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors });
    const color = setColor(tags, {}, [0, 0, 0]).color;
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
