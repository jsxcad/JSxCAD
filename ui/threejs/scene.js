import {
  AxesHelper,
  DirectionalLight,
  HemisphereLight,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

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
  camera.layers.enable(1);
  camera.position.set(...position);
  camera.up.set(...up);
  camera.lookAt(...target);

  const scene = new Scene();
  scene.add(camera);

  if (withAxes) {
    const axes = new AxesHelper(5);
    axes.layers.set(1);
    scene.add(axes);
  }

  var hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.5);
  hemiLight.position.set(0, 0, 300);
  scene.add(hemiLight);

  const light = new DirectionalLight(0xffffff, 0.5);
  light.position.set(1, 1, 1);
  light.layers.set(0);
  camera.add(light);

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
  }
  return { camera, canvas: renderer.domElement, renderer, scene };
};
