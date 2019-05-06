export const display = ({ Blob, THREE, dat, jsFrame, readFile, requestAnimationFrame, saveAs, toThreejsGeometry, watchFile, watchFileCreation }) => {
  let pages = [];

  const addPage = (element) => {
    pages.push(element);
    const frame = jsFrame.create({
      title: 'Window',
      left: 20, top: 20, width: 320, height: 220,
      movable: true,
      resizable: true,
      html: '<div style="padding:10px;font-size:12px;color:darkgray;">Contents of window</div>'
    });
    frame.$('div').appendChild(element);
    frame.show();
  };

  const nextPage = () => {
    pages.push(pages.shift());
  };

  const lastPage = () => {
    pages.unshift(pages.pop());
  };

  const addDisplay = (path, { cameraPosition = [0, 0, 16], geometry } = {}) => {
    // Add a new display when we see a new file written.
    let datasets = [];
    let camera;
    let controls;
    let scene;
    let renderer;
    let gui;
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

    if (typeof toThreejsGeometry !== 'undefined') {
      watchFile(path, ({ geometry }, file) => {
        if (data !== undefined) {
          updateDatasets(toThreejsGeometry(geometry));
        }
      });
    }

    init();
    animate();
    function init () {
      //
      camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500);
      [camera.position.x, camera.position.y, camera.position.z] = cameraPosition;
      //
      controls = new THREE.TrackballControls(camera);
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
      renderer.setSize(window.innerWidth, window.innerHeight);
      // TODO: Something more clever than this.
      const viewerElement = document.createElement('div');
      viewerElement.id = `viewer:${path}`;
      viewerElement.appendChild(renderer.domElement);
      gui = new dat.GUI({ autoPlace: false });
      viewerElement.appendChild(gui.domElement);
      // viewerElement.appendChild(makeDownloadButton());
      addPage(viewerElement);
      window.addEventListener('resize', onWindowResize, false);
    }
    /*
    function makeDownloadButton () {
      downloadButton = document.createElement('button');
      downloadButton.setAttribute('type', 'button');
      downloadButton.appendChild(document.createTextNode('Download'));
      downloadButton.setAttribute('style', 'position: absolute; top: 2px; right: 2px;');
      downloadButton.addEventListener('click', () => {
        const blob = new Blob([readFileSync(path)], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, path + '.stl');
      });
      return downloadButton;
    }
    */
    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      controls.handleResize();
      // renderer.setSize( window.innerWidth * 0.5, window.innerHeight * 0.5);
    }
    function animate () {
      requestAnimationFrame(animate);
      render();
      controls.update();
      // stats.update();
    }
    function render () {
      renderer.render(scene, camera);
    }

    if (geometry) {
      updateDatasets(geometry);
    }
  };

  if (typeof watchFileCreation !== 'undefined') {
    watchFileCreation(({ path }) => addDisplay(path));
  }

  return { addPage, nextPage, lastPage };
};
