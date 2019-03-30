import { toTriangles } from '@jsxcad/algorithm-polygons';

export class threejsDisplay{
    constructor(){
        console.log("A new instance of threejs class has been created");
        //
        let datasets = [];
        let stats;
        let mesh;
        let gui;
        
        this.camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
        [this.camera.position.x, this.camera.position.y, this.camera.position.z] = [0,0,16];
        //
        this.controls = new THREE.TrackballControls(this.camera);
        this.controls.rotateSpeed = 4.0;
        this.controls.zoomSpeed = 4.0;
        this.controls.panSpeed = 2.0;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.1;
        this.controls.keys = [65, 83, 68];
        this.controls.addEventListener('change', () => {this.render()});
        //
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x050505 );
        this.scene.add(this.camera);
        //
        var ambientLight = new THREE.AmbientLight( 0x222222 );
        this.scene.add( ambientLight );
        // var light1 = new THREE.PointLight(0xffffff, 0, 1);
        // camera.add(light1);
        var light2 = new THREE.DirectionalLight( 0xffffff, 1 );
        light2.position.set( 1, 1, 1 );
        this.camera.add(light2);
        // scene.add( light2 );
        
        
        //
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth * 0.5, window.innerHeight * 0.5);
        document.getElementById('viewer').appendChild(this.renderer.domElement);
        //
        // stats = new Stats();
        // document.getElementById('viewer').appendChild(stats.dom);
        //
        gui = new dat.GUI({ autoPlace: false });
        document.getElementById('viewer').appendChild(gui.domElement);
        // gui.add( material, 'wireframe' );
        //
        window.addEventListener( 'resize', this.onWindowResize, false );
        
        this.animate();
    }
    
    writeScreen(id, ...shapes){
        console.log("Writing shape to screen: ");
        console.log(id);
        
        //do the same thing that happens in the first part of write to three.js
        //Function to convert to polygons if needed
        const toPolygons = (shape) => (shape instanceof Array) ? shape : shape.toPolygons({});
        
        //Convert polygon to triangles
        console.log("Polygons: ");
        const solids = shapes.map(this.toPolygons).map(polygons => console.log(polygons));
        
        console.log("Solids: ");
        console.log(solids);
        
        //Convert triangles to threejs dataset
        const datasets = trianglesToThreejsDatasets({}, ...solids);
        
        console.log("Computed dataset: ");
        console.log(datasets);
        
        var geometry = new THREE.BufferGeometry();
        var indices = [0,1,2,0,2,3];
        var positions = [15.000000000000002,15,0,-15,15.000000000000002,0,-15.000000000000002,-15,0,15,-15.000000000000002,0];
        var normals = [0,0,1,0,0,1,0,0,1,0,0,1];
        geometry.setIndex( indices );
        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        var material = new THREE.MeshNormalMaterial();
        var mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );
        
        //Update the current three.js instance with the new values
    }
    
    toPolygons(shape){
        if(shape instanceof Array){
            return shape.toPolygons({});
        }
        else{
            return shape;
        }
    }
    
    clearScreenById(id){
        console.log("clear by ID not yet implimented");
    }
    
    clearScreenAll(){
        console.log("Clear all not yet implimented");
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.controls.handleResize();
        this.renderer.setSize( window.innerWidth * 0.5, window.innerHeight * 0.5);
    }
    
    animate() {
        requestAnimationFrame( () => {this.animate()} );
        this.render();
        this.controls.update();
        // stats.update();
    }
      
    render() {
        this.renderer.render( this.scene, this.camera );
    }
}
