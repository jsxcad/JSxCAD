import * as THREE from 'three';
import { DOMParser, XMLSerializer } from 'xmldom';
import { installProjector } from './Projector';
import { installSVGRenderer } from './SVGRenderer';
import { toThreejsGeometry } from './toThreejsGeometry';

// Bootstrap start.
installProjector({ THREE });

{
  // FIX: Is there a better way to get an empty document?
  const document = new DOMParser().parseFromString('<xml></xml>', 'text/xml');
  installSVGRenderer({ THREE, document });
}
// Bootstrap done.

const build = ({ cameraPosition = [0, 0, 16], pageSize = [100, 100] }, geometry) => {
  const [pageWidth, pageHeight] = pageSize;
  const camera = new THREE.PerspectiveCamera(27, pageWidth / pageHeight, 1, 3500);
  [camera.position.x, camera.position.y, camera.position.z] = cameraPosition;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);
  scene.add(camera);
  //
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);
  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  camera.add(light);

  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    } else if (geometry.threejsSegments) {
      const segments = geometry.threejsSegments;
      const threejsGeometry = new THREE.Geometry();
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      for (const [[aX, aY, aZ], [bX, bY, bZ]] of segments) {
        threejsGeometry.vertices.push(new THREE.Vector3(aX, aY, aZ), new THREE.Vector3(bX, bY, bZ));
      }
      scene.add(new THREE.LineSegments(threejsGeometry, material));
    } else if (geometry.threejsSolid) {
      const { positions, normals } = geometry.threejsSolid;
      const threejsGeometry = new THREE.BufferGeometry();
      threejsGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      threejsGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      const material = new THREE.MeshNormalMaterial();
      scene.add(new THREE.Mesh(threejsGeometry, material));
    } else if (geometry.threejsSurface) {
      const { positions, normals } = geometry.threejsSurface;
      const threejsGeometry = new THREE.BufferGeometry();
      threejsGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      threejsGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      const material = new THREE.MeshNormalMaterial();
      scene.add(new THREE.Mesh(threejsGeometry, material));
    }
  };
  walk(toThreejsGeometry(geometry));

  return [scene, camera];
};

export const toSvg = async (options = {}, geometry) => {
  const [scene, camera] = build(options, geometry);
  const { pageSize = [500, 500] } = options;
  const [pageWidth, pageHeight] = pageSize;

  const renderer = new THREE.SVGRenderer({});
  renderer.setSize(pageWidth, pageHeight);
  renderer.render(scene, camera);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(renderer.domElement);
};
