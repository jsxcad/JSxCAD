/* global Blob, ResizeObserver */

import * as THREE from 'three';
import * as dat from 'dat.gui';

import { installCSS, installCSSLink } from './css';

import TrackballControls from 'three-trackballcontrols';
import { jsPanel } from 'jspanel4';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

export const installDisplayCSS = (document) => {
  installCSSLink(document, 'https://unpkg.com/jspanel4@4.6.0/es6module/jspanel.css');
  installCSS(document, `
               .dg { position: absolute; top: 2px; left: 2px; background: #ffffff; color: #000000 }
               .dg.main.taller-than-window .close-button { border-top: 1px solid #ddd; }
               .dg.main .close-button { background-color: #ccc; } 
               .dg.main .close-button:hover { background-color: #ddd; }
               .dg { color: #555; text-shadow: none !important; } 
               .dg.main::-webkit-scrollbar { background: #fafafa; } 
               .dg.main::-webkit-scrollbar-thumb { background: #bbb; } 
               .dg li:not(.folder) { background: #fafafa; border-bottom: 1px solid #ddd; } 
               .dg li.save-row .button { text-shadow: none !important; } 
               .dg li.title { background: #e8e8e8 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat; }
               .dg .cr.function:hover,.dg .cr.boolean:hover { background: #fff; } 
               .dg .c input[type=text] { background: #e9e9e9; } 
               .dg .c input[type=text]:hover { background: #eee; } 
               .dg .c input[type=text]:focus { background: #eee; color: #555; } 
               .dg .c .slider { background: #e9e9e9; } 
               .dg .c .slider:hover { background: #eee; }
             `);
};

export const installDisplay = async ({ document, readFile, watchFile, watchFileCreation, window }) => {
  jsPanel.autopositionSpacing = 20;

  let pages = [];

  const addPage = ({ title = 'Window', content = '', contentOverflow = 'scroll', position = 'left-top', autoposition = 'down', size = '600 600', footerToolbar, callback }) => {
    const panel = jsPanel.create({
      autoposition,
      headerTitle: title,
      contentSize: size,
      content,
      contentOverflow,
      'position': { my: position, at: position },
      footerToolbar,
      callback
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

  const addDisplay = ({ view = {}, geometry } = {}, path) => {
    const { target = [0, 0, 0], position = [40, 40, 40], up = [0, 0, 1] } = view;
    // Add a new display when we see a new file written.
    let datasets = [];
    let camera;
    let controls;
    let scene;
    let renderer;
    let gui;
    // FIX: Injection.
    const page = addPage({
      title: path,
      content: `<div id="${path}"></div>`,
      contentOverflow: 'hidden',
      position: 'right-top',
      footerToolbar: `<span class="jsPanel-ftr-btn" id="download/${path}">Download ${path}</span>`,
      callback: (panel) => {
        document.getElementById(`download/${path}`)
            .addEventListener('click',
                              async () => {
                                const blob = new Blob([await readFile({}, path)],
                                                      { type: 'text/plain;charset=utf-8' });
                                saveAs(blob, path);
                              });
      }
    });
    let viewerElement;
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
        dataset.controller = controller;
      }
    };

    watchFile(path, ({ geometry }, file) => {
      if (geometry !== undefined) {
        // We expect the geometry already includes threejs versions.
        updateDatasets(toThreejsGeometry(geometry));
      }
    });

    init();
    animate();
    function init () {
      //
      camera = new THREE.PerspectiveCamera(27, page.offsetWidth / page.offsetHeight, 1, 3500);
      [camera.position.x, camera.position.y, camera.position.z] = position;
      camera.lookAt(...target);
      camera.up.set(...up);
      //
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      scene.add(camera);

      {
        const grid = new THREE.GridHelper(1000, 100, 0x000080, 0xc0c0c0);
        grid.material.opacity = 0.5;
        grid.rotation.x = -Math.PI / 2;
        grid.material.transparent = true;
        scene.add(grid);
      }

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
      const container = document.getElementById(path);
      container.appendChild(viewerElement);
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
      new ResizeObserver(onResize).observe(container);
    }
    function animate () {
      window.requestAnimationFrame(animate);
      render();
      controls.update();
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
    watchFileCreation(({ preview }, { path }) => {
      if (preview === true) {
        addDisplay({}, path);
      }
    });
  }

  return { addPage, nextPage, lastPage };
};
