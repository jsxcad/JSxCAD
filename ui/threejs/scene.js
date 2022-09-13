import {
  AxesHelper,
  Object3D,
  PerspectiveCamera,
  Scene,
  SpotLight,
  WebGLRenderer,
} from '@jsxcad/algorithm-threejs';

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';

export const createResizer = ({
  camera,
  controls,
  renderer,
  viewerElement,
}) => {
  const resize = () => {
    const width = viewerElement.clientWidth;
    const height = viewerElement.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    for (const control of controls) {
      control.update();
    }
    renderer.setSize(width, height);
    return { width, height };
  };

  return { resize };
};

export const buildScene = ({
  canvas,
  width,
  height,
  view,
  withAxes = true,
  renderer,
  preserveDrawingBuffer = false,
}) => {
  const { target = [0, 0, 0], position = [40, 40, 40], up = [0, 1, 1] } = view;
  Object3D.DefaultUp.set(...up);

  const camera = new PerspectiveCamera(27, width / height, 1, 1000000);
  camera.position.set(...position);
  camera.up.set(...up);
  camera.lookAt(...target);
  camera.userData.dressing = true;

  const scene = new Scene();
  scene.add(camera);

  if (withAxes) {
    const axes = new AxesHelper(5);
    axes.layers.set(SKETCH_LAYER);
    scene.add(axes);
  }

  {
    const light = new SpotLight(0xffffff, 0.7);
    light.target = camera;
    light.position.set(0.1, 0.1, 1);
    light.userData.dressing = true;
    light.layers.enable(SKETCH_LAYER);
    light.layers.enable(GEOMETRY_LAYER);
    camera.add(light);
  }

  {
    // Add spot light for shadows.
    const spotLight = new SpotLight(0xffffff, 0.75);
    spotLight.position.set(20, 20, 20);
    spotLight.castShadow = true;
    spotLight.receiveShadow = true;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.mapSize.width = 1024 * 2;
    spotLight.shadow.mapSize.height = 1024 * 2;
    spotLight.userData.dressing = true;
    spotLight.layers.enable(SKETCH_LAYER);
    spotLight.layers.enable(GEOMETRY_LAYER);
    scene.add(spotLight);
  }

  if (renderer === undefined) {
    renderer = new WebGLRenderer({
      antialias: true,
      canvas,
      preserveDrawingBuffer,
    });
    renderer.autoClear = false;
    renderer.setSize(width, height, /* updateStyle= */ false);
    renderer.setClearColor(0xffffff);
    renderer.antiAlias = false;
    renderer.inputGamma = true;
    renderer.outputGamma = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style =
      'padding-left: 5px; padding-right: 5px; padding-bottom: 5px; position: absolute; z-index: 1';

    renderer.shadowMap.enabled = true;
    // renderer.shadowMapType = BasicShadowMap;
  }
  return { camera, canvas: renderer.domElement, renderer, scene };
};
