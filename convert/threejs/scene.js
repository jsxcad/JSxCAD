import * as THREE from 'three';

export const createResizer = ({ camera, renderer, trackball, viewerElement }) => {
  const resize = () => {
    const width = viewerElement.clientWidth - 10;
    const height = viewerElement.clientHeight - 5;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    trackball.handleResize();
    renderer.setSize(width, height);
    return { width, height };
  };

  return { resize };
};

export const buildScene = ({ width, height, view }) => {
  const { target = [0, 0, 0], position = [40, 40, 40], up = [0, 0, 1] } = view;

  const camera = new THREE.PerspectiveCamera(27, width / height, 1, 3500);
  [camera.position.x, camera.position.y, camera.position.z] = position;
  camera.lookAt(...target);
  camera.up.set(...up);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.add(camera);
  {
    const grid = new THREE.GridHelper(1000, 100, 0x000080, 0xc0c0c0);
    grid.material.opacity = 0.5;
    grid.rotation.x = -Math.PI / 2;
    grid.material.transparent = true;
    scene.add(grid);
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(1, 1, 1);
  camera.add(light);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.antiAlias = false;
  renderer.inputGamma = true;
  renderer.outputGamma = true;
  renderer.autoClear = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.style = 'padding-left: 5px; padding-right: 5px; padding-bottom: 5px; position: absolute; z-index: 1';
  const viewerElement = document.createElement('div');
  viewerElement.id = 'viewer';
  viewerElement.style.height = '100%';
  viewerElement.appendChild(renderer.domElement);

  const hudCanvas = document.createElement('canvas');
  hudCanvas.style = 'padding-left: 5px; padding-right: 5px; padding-bottom: 5px; position: absolute; z-index: 2';
  hudCanvas.id = 'hudCanvas';
  hudCanvas.width = width;
  hudCanvas.height = height;
  viewerElement.appendChild(hudCanvas);

  return { camera, hudCanvas, renderer, scene, viewerElement };
};
