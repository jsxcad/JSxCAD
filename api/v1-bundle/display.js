/* global ResizeObserver */

import * as THREE from 'three';
import * as dat from 'dat.gui';

import TrackballControls from 'three-trackballcontrols';
import { installCSSLink } from './css';
import { jsPanel } from 'jspanel4';

export const installDisplayCSS = (document) => {
  installCSSLink(document, 'https://unpkg.com/jspanel4@4.6.0/es6module/jspanel.css');
};

export const installDisplay = async ({ document, readFile, watchFile, watchFileCreation }) => {
  let pages = [];

  const addPage = ({ title = 'Window', content = '', contentOverflow = 'scroll' }) => {
    const panel = jsPanel.create({
      headerTitle: title,
      contentSize: '600 600',
      content,
      contentOverflow
    });
    pages.push(panel);
    return panel;
  };

  const nextPage = () => {
    pages.push(pages.shift());
    pages[0].front();
  };

  const lastPage = () => {
    pages.unshift(pages.pop());
    pages[0].front();
  };

  const addDisplay = ({ cameraPosition = [0, 0, 16], geometry } = {}, path) => {
    // Add a new display when we see a new file written.
    let datasets = [];
    let camera;
    let controls;
    let scene;
    let renderer;
    let gui;
    const page = addPage(path);
    let viewerElement;
    // let downloadButton;

    const toName = (geometry) => {
      if (geometry.tags !== undefined && geometry.tags.length >= 1) {
        return geometry.tags[0];
      }
    };

    const updateDatasets = (geometry) => {
      // Delete any previous dataset in the window.
      for (const { controller, mesh } of datasets) {
        if (controller) {
          gui.remove(controller);
        }
        scene.remove(mesh);
      }
      // Build new datasets from the written data, and display them.
      datasets = [];

      const walk = (geometry) => {
        if (geometry.assembly) {
          geometry.assembly.forEach(walk);
        } else if (geometry.threejsSegments) {
          const segments = geometry.threejsSegments;
          const dataset = {};
          const threejsGeometry = new THREE.Geometry();
          const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
          for (const [[aX, aY, aZ], [bX, bY, bZ]] of segments) {
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
          const material = new THREE.MeshNormalMaterial();
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
          const material = new THREE.MeshNormalMaterial();
          dataset.mesh = new THREE.Mesh(threejsGeometry, material);
          dataset.name = toName(geometry);
          scene.add(dataset.mesh);
          datasets.push(dataset);
        }
      };

      walk(geometry);

      const controllers = {};
      for (const dataset of datasets) {
        if (dataset.name === undefined) { continue; }
        let controller = controllers[dataset.name];
        if (controller === undefined) {
          controller = gui.add({ visible: true }, 'visible').name(`Show ${dataset.name}?`);
          controllers[dataset.name] = controller;
        }
        controller.listen().onChange((value) => { dataset.mesh.visible = value; });
      }
    };

    watchFile(path, ({ geometry }, file) => {
      if (geometry !== undefined) {
        // We expect the geometry already includes threejs versions.
        updateDatasets(geometry);
      }
    });

    init();
    function init () {
      //
      camera = new THREE.PerspectiveCamera(27, page.offsetWidth / page.offsetHeight, 1, 3500);
      [camera.position.x, camera.position.y, camera.position.z] = cameraPosition;
      //
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050505);
      scene.add(camera);
      //
      var ambientLight = new THREE.AmbientLight(0x222222);
      scene.add(ambientLight);
      var light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1);
      camera.add(light);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.domElement.style = 'padding-left: 5px; padding-right: 5px; padding-bottom: 5px';
      viewerElement = document.createElement('div');
      viewerElement.id = `viewer:${path}`;
      viewerElement.style.height = '100%';
      viewerElement.appendChild(renderer.domElement);
      gui = new dat.GUI({ autoPlace: false });
      gui.domElement.style = 'padding: 5px';
      viewerElement.appendChild(gui.domElement);
      // viewerElement.appendChild(makeDownloadButton());
      // page.$('div').appendChild(viewerElement);
      page.$('div').appendChild(viewerElement);
      //
      controls = new TrackballControls(camera, viewerElement);
      controls.rotateSpeed = 4.0;
      controls.zoomSpeed = 4.0;
      controls.panSpeed = 2.0;
      controls.noZoom = false;
      controls.noPan = false;
      controls.staticMoving = true;
      controls.dynamicDampingFactor = 0.1;
      controls.keys = [65, 83, 68];
      controls.addEventListener('change', render);
      //
      onResize();
      new ResizeObserver(onResize).observe(page.iframe);
    }
    function onResize () {
      const width = viewerElement.clientWidth - 10;
      const height = viewerElement.clientHeight - 5;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      controls.handleResize();
      renderer.setSize(width, height);
    }
    function render () {
      renderer.render(scene, camera);
    }

    if (geometry) {
      updateDatasets(geometry);
    }
  };

  if (typeof watchFileCreation !== 'undefined') {
    watchFileCreation(({ path }) => {
      if (path.startsWith('window/')) {
        addDisplay({}, path);
      }
    });
  }

  return { addPage, nextPage, lastPage };
};
