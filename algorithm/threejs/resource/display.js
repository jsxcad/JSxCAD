let pages = [];

const addPage = (element) => {
  element.style.display = 'none';
  document.getElementById("body").appendChild(element);
  pages.push(element);
}

const nextPage = () => {
  pages[0].style.display = 'none';
  pages.push(pages.shift());
  pages[0].style.display = 'block';
}

const lastPage = () => {
  pages[0].style.display = 'none';
  pages.unshift(pages.pop());
  pages[0].style.display = 'block';
}

const addDisplay = (path, data) => {
  // Add a new display when we see a new file written.
  let datasets = [];
  let camera;
  let controls;
  let scene;
  let renderer;
  let stats;
  let mesh;
  let gui;
  let downloadButton;

  const pathsToThreejsSegments = (paths) => {
    const segments = [];
    for (const path of paths) {
      for (const [start, end] of toSegments({}, path)) {
        segments.push([start, end]);
      }
    }
    return segments;
  };

  const solidToThreejsSolid = (solid) => {
    const normals = [];
    const positions = [];
    for (const triangle of polygonsToTriangles({}, solidToPolygons({}, solid))) {
      for (const point of triangle) {
        const [x, y, z] = toPlane(triangle);
        normals.push(x, y, z);
        positions.push(...point);
      }
    }
    return { normals, positions };
  };

  const surfaceToThreejsSurface = (surface) => {
    const normals = [];
    const positions = [];
    const outputTriangle = (triangle) => {
      for (const point of triangle) {
        const [x, y, z] = toPlane(triangle);
        normals.push(x, y, z);
        positions.push(...point);
      }
    };
    for (const triangle of polygonsToTriangles({}, makeConvexSurface({}, surface))) {
      outputTriangle(triangle);
      outputTriangle(flipPolygon(triangle));
    }
    return { normals, positions };
  };

  const addController = ({ tags = [] }) => {
    if (tags.length >= 1) {
      return gui.add({ visible: true }, 'visible')
                .name(`Show ${tags[0]}?`)
                .listen()
                .onChange((value) => { dataset.mesh.visible = value; });
    }
  }

  const updateDatasets = ({ paths, solids, surfaces }) => {
    // Delete any previous dataset in the window.
    for (const { controller, mesh } of datasets) {
      if (controller) {
        gui.remove(controller);
      }
      scene.remove(mesh);
    }
    // Build new datasets from the written data, and display them.
    datasets = [];
    {
      const segments = pathsToThreejsSegments(paths);
      // FIX: Paths need to be separated into tag groups.
      const dataset = {};
      const geometry = new THREE.Geometry();
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      for (const [[aX, aY, aZ], [bX, bY, bZ]] of segments) {
        geometry.vertices.push(new THREE.Vector3(aX, aY, aZ), new THREE.Vector3(bX, bY, bZ));
      }
      dataset.mesh = new THREE.LineSegments(geometry, material);
      dataset.controller = addController({ tags: paths.tags });
      scene.add(dataset.mesh);
      datasets.push(dataset);
    }
    for (const solid of solids) {
      const { positions, normals } = solidToThreejsSolid(solid);
      const dataset = {};
      const geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.Float32BufferAttribute( positions, 3));
      geometry.addAttribute('normal', new THREE.Float32BufferAttribute( normals, 3));
      const material = new THREE.MeshNormalMaterial();
      dataset.mesh = new THREE.Mesh(geometry, material);
      dataset.controller = addController({ tags: solid.tags });
      scene.add(dataset.mesh);
      datasets.push(dataset);
    }
    for (const surface of surfaces) {
      const { positions, normals } = surfaceToThreejsSurface(surface);
      const dataset = {};
      const geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.Float32BufferAttribute( positions, 3));
      geometry.addAttribute('normal', new THREE.Float32BufferAttribute( normals, 3));
      const material = new THREE.MeshNormalMaterial();
      dataset.mesh = new THREE.Mesh(geometry, material);
      dataset.controller = addController({ tags: surface.tags });
      scene.add(dataset.mesh);
      datasets.push(dataset);
    }
  };

  watchFile(path, (file, data) => updateDatasets(paths, data));

  init();
  animate();
  function init() {
    //
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    [camera.position.x, camera.position.y, camera.position.z] = [0,0,16];
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
    scene.background = new THREE.Color( 0x050505 );
    scene.add(camera);
    //
    var ambientLight = new THREE.AmbientLight( 0x222222 );
    scene.add( ambientLight );
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 );
    camera.add(light);
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight);
    // TODO: Something more clever than this.
    const viewerElement = document.createElement("div");
    viewerElement.id = `viewer:${path}`;
    viewerElement.appendChild(renderer.domElement);
    gui = new dat.GUI({ autoPlace: false });
    viewerElement.appendChild(gui.domElement);
    
    viewerElement.appendChild(makeDownloadButton());
    
    addPage(viewerElement);
    window.addEventListener( 'resize', onWindowResize, false );
  }
  function makeDownloadButton() {
    downloadButton = document.createElement("button");
    downloadButton.setAttribute("type", "button");
    downloadButton.appendChild(document.createTextNode("Download"));
    downloadButton.setAttribute("style", "position: absolute; top: 2px; right: 2px;");
    downloadButton.addEventListener("click", () => {
      const blob = new Blob([readFileSync(path)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, path+'.stl');
    });
    return downloadButton;
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.handleResize();
    // renderer.setSize( window.innerWidth * 0.5, window.innerHeight * 0.5);
  }
  function animate() {
    requestAnimationFrame( animate );
    render();
    controls.update();
    // stats.update();
  }
  function render() {
    renderer.render( scene, camera );
  }

  if (data) {
    updateDatasets(data);
  }
};

watchFileCreation(({ path }) => addDisplay(path));
