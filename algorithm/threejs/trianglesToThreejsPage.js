import { toPlane } from '@jsxcad/math-poly3';

const page = ({ indices, positions, normals }) => `
<html lang="en">
  <head>
    <title>JSxCAD Viewer</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <style>
      body {
        color: #cccccc;
        font-family:Monospace;
        font-size:13px;
        text-align:center;
        background-color: #050505;
        margin: 0px;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min.js"></script>
    <script type="text/javascript" src="https://cdn.rawgit.com/mrdoob/stats.js/master/build/stats.min.js"></script>
    <script type="text/javascript" src="https://cdn.rawgit.com/dataarts/dat.gui/master/build/dat.gui.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ami.js//0.0.20/ami.min.js"></script>
    <script>
      var camera, scene, renderer, stats;
      var mesh;
      init();
      animate();
      function init() {
        //
        camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
        camera.position.z = 16;
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x050505 );
        //
        var ambientLight = new THREE.AmbientLight( 0x222222 );
        scene.add( ambientLight );
        var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        light1.position.set( 1, 1, 1 );
        scene.add( light1 );
        var light2 = new THREE.DirectionalLight( 0xffffff, 1 );
        light2.position.set( 0, - 1, 0 );
        scene.add( light2 );
        //
        var geometry = new THREE.BufferGeometry();
        var indices = ${JSON.stringify(indices)};
        var positions = ${JSON.stringify(positions)};
        var normals = ${JSON.stringify(normals)};
        //
        geometry.setIndex( indices );
        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        var material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        //
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        //
        stats = new Stats();
        document.body.appendChild( stats.dom );
        //
        var gui = new dat.GUI();
        gui.add( material, 'wireframe' );
        //
        window.addEventListener( 'resize', onWindowResize, false );
      }
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      //
      function animate() {
        requestAnimationFrame( animate );
        render();
        stats.update();
      }
      function render() {
        var time = Date.now() * 0.001;
        mesh.rotation.x = time * 0.25;
        mesh.rotation.y = time * 0.5;
        renderer.render( scene, camera );
      }
    </script>

  </body>
</html>
`;

const intern = (map, point, next, update) => {
  const key = JSON.stringify(point);
  let index = map[key];
  if (index !== undefined) {
    return index;
  }
  map[key] = next;
  update(point);
  return next;
};

export const trianglesToThreejsPage = (options = {}, triangles) => {
  // Translate the paths to threejs geometry data.
  const indices = [];
  const vertexMap = {};
  const positions = [];
  const normals = [];

  for (const triangle of triangles) {
    const [x, y, z] = toPlane(triangle);
    const normal = [x, y, z];
    for (const point of triangle) {
      indices.push(intern(vertexMap,
                          [point, normal],
                          Math.floor(positions.length / 3),
                          ([point, normal]) => {
                            positions.push(...point);
                            normals.push(...normal);
                          }));
    }
  }
  return page({ indices, positions, normals });
};
