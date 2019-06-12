import * as THREE from 'three';

import { buildMeshMaterial } from './material';
import { setColor } from './color';

const toName = (geometry) => {
  if (geometry.tags !== undefined && geometry.tags.length >= 1) {
    for (const tag of geometry.tags) {
      console.log(`QQ/tag: ${tag}`);
      if (tag.startsWith('user/')) {
        return tag.substring(5);
      }
    }
  }
};

export const buildMeshes = ({ datasets, geometry, scene }) => {
  const { tags } = geometry;
  if (geometry.assembly) {
    geometry.assembly.forEach(buildMeshes({ datasets, geometry, scene }));
  } else if (geometry.threejsSegments) {
    const segments = geometry.threejsSegments;
    const dataset = {};
    const threejsGeometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors });
    const color = setColor(tags, {}, [0, 0, 0]).color;
    for (const [[aX, aY, aZ], [bX, bY, bZ]] of segments) {
      threejsGeometry.colors.push(color, color);
      threejsGeometry.vertices.push(new THREE.Vector3(aX, aY, aZ), new THREE.Vector3(bX, bY, bZ));
    }
    dataset.mesh = new THREE.LineSegments(threejsGeometry, material);
    dataset.name = toName(geometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  } else if (geometry.threejsSolid) {
    const { positions, normals } = geometry.threejsSolid;
    const dataset = {};
    const threejsGeometry = new THREE.BufferGeometry();
    threejsGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    threejsGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    const material = buildMeshMaterial(tags);
    dataset.mesh = new THREE.Mesh(threejsGeometry, material);
    dataset.name = toName(geometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  } else if (geometry.threejsSurface) {
    const { positions, normals } = geometry.threejsSurface;
    const dataset = {};
    const threejsGeometry = new THREE.BufferGeometry();
    threejsGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    threejsGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    const material = buildMeshMaterial(tags);
    dataset.mesh = new THREE.Mesh(threejsGeometry, material);
    dataset.name = toName(geometry);
    scene.add(dataset.mesh);
    datasets.push(dataset);
  }
};
