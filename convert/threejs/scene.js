import {
  AxesHelper,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  Scene,
  SpotLight,
  WebGLRenderer,
} from '@jsxcad/algorithm-threejs';

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';

export const buildScene = ({
  canvas,
  context,
  width,
  height,
  view,
  withAxes = true,
  renderer,
  preserveDrawingBuffer = false,
}) => {
  const { target = [0, 0, 0], position = [40, 40, 40], up = [0, 1, 1] } = view;
  Object3D.DEFAULT_UP.set(...up);

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
    const light = new SpotLight(0xffffff, 10);
    light.target = camera;
    light.decay = 0.2;
    light.position.set(0.1, 0.1, 1);
    light.userData.dressing = true;
    light.layers.enable(SKETCH_LAYER);
    light.layers.enable(GEOMETRY_LAYER);
    camera.add(light);
  }

  {
    // Add spot light for shadows.
    const spotLight = new SpotLight(0xffffff, 10);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 1;
    spotLight.decay = 0.2;
    spotLight.distance = 0;
    spotLight.position.set(20, 20, 20);
    spotLight.castShadow = true;
    spotLight.receiveShadow = true;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 1000;
    spotLight.shadow.focus = 1;
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
      context,
      preserveDrawingBuffer,
    });
    renderer.autoClear = false;
    renderer.setSize(width, height, /* updateStyle= */ false);
    renderer.setClearColor(0xeeeeee);
    renderer.antiAlias = false;
    renderer.inputGamma = true;
    renderer.outputGamma = true;
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style =
      'padding-left: 5px; padding-right: 5px; padding-bottom: 5px; position: absolute; z-index: 1';

    renderer.shadowMap.enabled = true;
    renderer.shadowMapType = PCFShadowMap;
  }
  return { camera, canvas: renderer.domElement, renderer, scene };
};
