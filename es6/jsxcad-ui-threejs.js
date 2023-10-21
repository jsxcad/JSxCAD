import { Object3D, PerspectiveCamera, Scene, AxesHelper, SpotLight, WebGLRenderer, PCFShadowMap, Raycaster, Vector2, Points, LineSegments, Shape, EventDispatcher, MeshBasicMaterial, Vector3, BufferGeometry, LineBasicMaterial, Float32BufferAttribute, Mesh, BoxGeometry, MeshPhysicalMaterial, MeshPhongMaterial, MeshNormalMaterial, ImageBitmapLoader, CanvasTexture, RepeatWrapping, SRGBColorSpace, Matrix4, Plane, Group, Path, ShapeGeometry, EdgesGeometry, WireframeGeometry, PointsMaterial, Color, Box3, GridHelper, PlaneGeometry, MeshStandardMaterial, Frustum, Layers, TrackballControls } from './jsxcad-algorithm-threejs.js';
import { isNode } from './jsxcad-sys.js';
import { toRgbFromTags } from './jsxcad-algorithm-color.js';
import { toThreejsMaterialFromTags } from './jsxcad-algorithm-material.js';

const GEOMETRY_LAYER = 0;
const SKETCH_LAYER = 1;

const createResizer = ({
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

const buildScene = ({
  canvas,
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
    // camera.add(new SpotLightHelper(light));
  }

  /*
  // FIX ambient lighting.
  {
    // Add ambient light
    const ambient = new HemisphereLight( 0xffffff, 0x8d8d8d, 100 );
    ambient.decay = 0.2;
    scene.add(ambient);
  }
  */

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
    // scene.add(new SpotLightHelper(spotLight));
  }

  if (renderer === undefined) {
    renderer = new WebGLRenderer({
      antialias: true,
      canvas,
      preserveDrawingBuffer,
    });
    renderer.autoClear = false;
    renderer.setSize(width, height, /* updateStyle= */ false);
    renderer.setClearColor(0xeeeeee);
    renderer.antiAlias = false;
    renderer.inputGamma = true;
    renderer.outputGamma = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.useLegacyLights = true;
    renderer.domElement.style =
      'padding-left: 5px; padding-right: 5px; padding-bottom: 5px; position: absolute; z-index: 1';

    renderer.shadowMap.enabled = true;
    renderer.shadowMapType = PCFShadowMap;
  }
  return { camera, canvas: renderer.domElement, renderer, scene };
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var FileReaderAsync = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(exports);
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function (_exports) {

  _exports.__esModule = true;
  _exports.default = void 0;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var FileReaderAsync = /*#__PURE__*/function () {
    function FileReaderAsync() {
      this.r = new FileReader();
      Object.defineProperty(this, 'r', {
        configurable: true
      });
    }

    var _proto = FileReaderAsync.prototype;

    _proto.readAs = function readAs(dataType, file) {
      var _this = this;

      switch (dataType) {
        case 'ArrayBuffer':
        case 'Text':
        case 'BinaryString':
        case 'DataURL':
          break;

        default:
          throw new Error('Unrecognized data type');
      }

      return new Promise(function (resolve, reject) {
        var r = _this.r;

        if (r.readyState !== FileReader.EMPTY) {
          reject('The reader is already in used');
          return;
        }

        r.onload = function () {
          resolve(r.result);
        };

        r.onerror = function () {
          reject(r.error);
        };

        r['readAs' + dataType](file);
      });
    };

    _proto.readAsText = function readAsText(file) {
      return this.readAs('Text', file);
    };

    _proto.readAsArrayBuffer = function readAsArrayBuffer(file) {
      return this.readAs('ArrayBuffer', file);
    };

    _proto.readAsBinaryString = function readAsBinaryString(file) {
      return this.readAs('BinaryString', file);
    };

    _proto.readAsDataURL = function readAsDataURL(file) {
      return this.readAs('DataURL', file);
    };

    _createClass(FileReaderAsync, [{
      key: "readyState",
      get: function get() {
        return this.r.readyState;
      }
    }]);

    return FileReaderAsync;
  }();

  var _default = FileReaderAsync;
  _exports.default = _default;
});

});

unwrapExports(FileReaderAsync);

var FileReaderSync = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(exports);
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function (_exports) {

  _exports.__esModule = true;
  _exports.default = void 0;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var FileReaderSync = /*#__PURE__*/function () {
    function FileReaderSync() {
      Object.defineProperty(this, '_s', {
        writable: true,
        configurable: true,
        value: FileReader.EMPTY
      });
    }

    var _proto = FileReaderSync.prototype;

    _proto.readAs = function readAs(dataType, file) {
      if (this._s !== FileReader.EMPTY) {
        throw new Error('The reader is already in used');
      }

      this._s = FileReader.LOADING;

      switch (dataType) {
        case 'ArrayBuffer':
        case 'Text':
        case 'BinaryString':
        case 'DataURL':
          break;

        default:
          throw new Error('Unrecognized data type');
      }

      var url;
      var xhr;
      var text;

      try {
        url = URL.createObjectURL(file);
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.send();
        text = xhr.responseText;
        this._s = FileReader.DONE;
      } catch (e) {
        throw new Error('Error while reading file');
      } finally {
        if (url) URL.revokeObjectURL(url);
      }

      switch (dataType) {
        case 'ArrayBuffer':
          {
            return binaryToArrayBuffer(text);
          }

        case 'Text':
          {
            return new TextDecoder().decode(binaryToArrayBuffer(text));
          }

        case 'BinaryString':
          {
            return text;
          }

        case 'DataURL':
          {
            var type = xhr.getResponseHeader('content-type');
            type = type ? type.split(';')[0] : '';
            return 'data:' + type + ';base64,' + btoa(text);
          }
      }

      return null;
    };

    _proto.readAsText = function readAsText(file) {
      return this.readAs('Text', file);
    };

    _proto.readAsArrayBuffer = function readAsArrayBuffer(file) {
      return this.readAs('ArrayBuffer', file);
    };

    _proto.readAsBinaryString = function readAsBinaryString(file) {
      return this.readAs('BinaryString', file);
    };

    _proto.readAsDataURL = function readAsDataURL(file) {
      return this.readAs('DataURL', file);
    };

    _createClass(FileReaderSync, [{
      key: "readyState",
      get: function get() {
        return this._s;
      }
    }]);

    return FileReaderSync;
  }();

  function binaryToArrayBuffer(binStr) {
    var len = binStr.length;
    var arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    return arr.buffer;
  }

  var _default = FileReaderSync;
  _exports.default = _default;
});

});

unwrapExports(FileReaderSync);

var dist = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(exports, FileReaderAsync, FileReaderSync);
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function (_exports, _FileReaderAsync, _FileReaderSync) {

  _exports.__esModule = true;
  _FileReaderAsync = _interopRequireDefault(_FileReaderAsync);
  _exports.FileReaderAsync = _FileReaderAsync.default;
  _FileReaderSync = _interopRequireDefault(_FileReaderSync);
  _exports.FileReaderSync = _FileReaderSync.default;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});

});

var FileReaderForNode = unwrapExports(dist);

let geometryRaycaster = new Raycaster();
geometryRaycaster.layers.set(GEOMETRY_LAYER);

let sketchRaycaster = new Raycaster();
sketchRaycaster.layers.set(SKETCH_LAYER);
sketchRaycaster.params.Line.threshold = 0.2;
sketchRaycaster.params.Points.threshold = 0.2;

const precedence = (a) => {
  if (a.object instanceof Points) {
    return 3;
  } else if (a.object instanceof LineSegments) {
    return 2;
  } else if (a.object instanceof Shape) {
    return 1;
  } else {
    return 0;
  }
};

const order = (a, b) => {
  const delta = a.distance - b.distance;
  if (delta !== 0) {
    return delta;
  }
  return precedence(b) - precedence(a);
};

const cast = (raycaster, position, camera, objects, filter = (s) => true) => {
  raycaster.setFromCamera(position, camera);
  const intersects = raycaster.intersectObjects(objects, true).filter(filter);

  intersects.sort(order);

  for (const { face, object, point } of intersects) {
    if (!object.userData.tangible) {
      continue;
    }
    if (face) {
      const { normal } = face;
      return { point, normal, object };
    } else {
      return { point, object };
    }
  }
};

const raycast = (x, y, camera, objects, filter) => {
  const position = new Vector2(x, y);
  return (
    cast(sketchRaycaster, position, camera, objects, filter) ||
    cast(geometryRaycaster, position, camera, objects, filter) ||
    {}
  );
};

// global document

class AnchorControls extends EventDispatcher {
  constructor({ camera, domElement, scene, render, editId }) {
    super();

    const _material = new MeshBasicMaterial({
      depthTest: false,
      depthWrite: false,
      fog: false,
      toneMapped: false,
      transparent: true,
      opacity: 0.5,
    });

    const yellow = _material.clone();
    yellow.color.setHex(0xffff00);

    const red = _material.clone();
    red.color.setHex(0xff0000);

    const green = _material.clone();
    green.color.setHex(0x00ff00);

    const blue = _material.clone();
    blue.color.setHex(0x0000ff);

    const _xAxis = new Vector3();
    const _yAxis = new Vector3();
    const _zAxis = new Vector3();

    let _camera = camera;
    let _domElement = domElement;
    let _step = 1;
    let _object = null;
    let _scene = scene;

    let _edits = [];

    let _cursor;

    {
      const cursorGeometry = new BufferGeometry();
      const material = new LineBasicMaterial({ linewidth: 2, color: 0x000000 });
      const positions = [0, 0, 0, 0, 0, 1];
      cursorGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      _cursor = new LineSegments(cursorGeometry, material);
      _cursor.visible = true;
      _cursor.layers.set(SKETCH_LAYER);
      _cursor.userData.dressing = true;
      _cursor.userData.anchored = false;
      _scene.add(_cursor);
    }

    let _at = new Mesh(new BoxGeometry(1, 1, 1), yellow);

    _at.visible = false;
    _at.layers.set(SKETCH_LAYER);
    _at.userData.dressing = true;
    _scene.add(_at);

    const deleteObject = () => {
      if (!_object) {
        return;
      }
      // Remove the edits that produced this object.
      _edits = _edits.filter((entry) => entry.object !== _object);
      // We just hide the object, because we might be copying it later.
      _object.visible = false;
    };

    const placeObject = (original, { at }) => {
      const copy = original.clone();
      // We change the material sometimes, so make a copy.
      copy.material = copy.material.clone();
      if (at) {
        copy.position.copy(at.position);
      }
      // Record the time this was produced.
      copy.userData.created = new Date();
      // This is not quite right -- we might be pasting elsewhere.
      original.parent.add(copy);
    };

    const enable = () => {
      _domElement.addEventListener('pointerdown', onPointerDown);
      _domElement.tabIndex = 1; // Make the canvas focusable.
    };

    const disable = () => {
      _domElement.removeEventListener('pointerdown', onPointerDown);
    };

    // Something in the outside environment changed.
    const change = () => {
      // if (!_object) { return; }

      // Find a best fit between camera and world axes.
      const x = new Vector3();
      x.set(1, 0, 0);
      // The y axis is backward.
      const y = new Vector3();
      y.set(0, -1, 0);
      const z = new Vector3();
      z.set(0, 0, 1);

      // Invalidate the axes so errors become obvious.
      _xAxis.set(NaN, NaN, NaN);
      _yAxis.set(NaN, NaN, NaN);
      _zAxis.set(NaN, NaN, NaN);

      // This could be more efficient, since we don't need to consider axes already assigned.
      const fit = (v, cameraAxis) => {
        const xDot = x.dot(v);
        const xFit = Math.abs(xDot);

        const yDot = y.dot(v);
        const yFit = Math.abs(yDot);

        const zDot = z.dot(v);
        const zFit = Math.abs(zDot);

        if (xFit >= yFit && xFit >= zFit) {
          cameraAxis.copy(x);
          if (xDot < 0) {
            cameraAxis.negate();
          }
        } else if (yFit >= xFit && yFit >= zFit) {
          cameraAxis.copy(y);
          if (yDot < 0) {
            cameraAxis.negate();
          }
        } else {
          cameraAxis.copy(z);
          if (zDot < 0) {
            cameraAxis.negate();
          }
        }
      };

      const cx = new Vector3();
      const cy = new Vector3();
      const cz = new Vector3();
      _camera.matrixWorld.extractBasis(cx, cy, cz);

      fit(cx, _xAxis);
      fit(cy, _yAxis);
      fit(cz, _zAxis);
    };

    // We're changing our state.
    const update = () => {
      if (_object) {
        const parent = _object.parent;
        _scene.attach(_object);
        _object.position.copy(_at.position);
        parent.attach(_object);
      }
      _at.scale.set(_step, _step, _step);
      this.dispatchEvent({
        type: 'change',
        at: _at,
        object: _object,
      });
    };

    const attach = (object) => {
      detach();
      _object = object;
      _object.material.transparent = true;
      _object.material.opacity *= 0.5;
      for (const child of _object.children) {
        const { isOutline } = child.userData;
        if (isOutline) {
          child.visible = true;
          child.material.color.set(0x9900cc); // violet
        }
      }
      _at.material.color.setHex(0xff4500); // orange red
      // _at.visible = true;

      _at.position.set(0, 0, 0);
      _object.localToWorld(_at.position);

      change();
      update();

      _domElement.addEventListener('keydown', onKeyDown);
      _domElement.addEventListener('mousemove', onMouseMove);
      this.dispatchEvent({ type: 'change' });
    };

    const detach = () => {
      if (_object === null) {
        return;
      }
      _object.material.opacity /= 0.5;
      for (const child of _object.children) {
        const { isOutline, hasShowOutline } = child.userData;
        if (isOutline) {
          child.material.color.set(0x000000);
          if (!hasShowOutline) {
            child.visible = false;
          }
        }
      }
      _object = null;
      _at.material.color.setHex(0xffff00); // yellow
      this.dispatchEvent({ type: 'change', object: null });
    };

    const dispose = () => detach();

    let _mouseX, _mouseY, _surfaceCursor;

    const adviseEdits = () => {
      this.dispatchEvent({
        edits: _edits,
        editId: editId,
        type: 'edits',
      });
    };

    const getOrientedCursorPoint = () => {
      const { point, normal } = raycast(
        _mouseX,
        _mouseY,
        _camera,
        [_scene],
        ({ object }) => object instanceof Mesh || object.userData.mat
      );

      if (point) {
        return [point.x, point.y, point.z, normal.x, normal.y, normal.z];
      }
    };

    const onMouseMove = (event) => {
      const rect = event.target.getBoundingClientRect();
      _mouseX = ((event.clientX - rect.x) / rect.width) * 2 - 1;
      _mouseY = -((event.clientY - rect.y) / rect.height) * 2 + 1;

      _surfaceCursor = getOrientedCursorPoint();
      if (_surfaceCursor) {
        const [x, y, z, nx, ny, nz] = _surfaceCursor;
        const position = _cursor.geometry.attributes.position;
        position.array[0] = x;
        position.array[1] = y;
        position.array[2] = z;
        if (_cursor.userData.anchored !== true) {
          position.array[3] = x + nx;
          position.array[4] = y + ny;
          position.array[5] = z + nz;
        }
        position.needsUpdate = true;
        render();
      }
    };

    const onKeyDown = (event) => {
      if (event.getModifierState('Control')) {
        switch (event.key) {
          case 'z': {
            if (_edits.length > 0) {
              const [object] = _edits[_edits.length - 1];
              object.visible = false;
              _edits.length -= 1;
              adviseEdits();
            }
            break;
          }
          default:
            this.dispatchEvent({
              at: _at,
              deleteObject,
              object: _object,
              placeObject,
              type: 'keydown',
              event,
            });
        }
      } else {
        // These exclude control keys.
        switch (event.key) {
          // step
          case '1':
            _step = 100.0;
            break;
          case '2':
            _step = 50.0;
            break;
          case '3':
            _step = 25.0;
            break;
          case '4':
            _step = 10.0;
            break;
          case '5':
            _step = 5.0;
            break;
          case '6':
            _step = 2.5;
            break;
          case '7':
            _step = 1.0;
            break;
          case '8':
            _step = 0.5;
            break;
          case '9':
            _step = 0.25;
            break;
          case '0':
            _step = 0.1;
            break;

          // at
          case 'ArrowRight':
          case 'd':
            _at.position.addScaledVector(_xAxis, _step);
            break;
          case 'ArrowLeft':
          case 'a':
            _at.position.addScaledVector(_xAxis, -_step);
            break;
          case 'ArrowUp':
          case 'w':
            _at.position.addScaledVector(_yAxis, _step);
            break;
          case 'ArrowDown':
          case 's':
            _at.position.addScaledVector(_yAxis, -_step);
            break;
          case 'PageDown':
          case 'e':
            _at.position.addScaledVector(_zAxis, _step);
            break;
          case 'PageUp':
          case 'q':
            _at.position.addScaledVector(_zAxis, -_step);
            break;

          case 'p': {
            if (_surfaceCursor) {
              const [x, y, z, nx, ny, nz] = _surfaceCursor;
              this.dispatchEvent({
                type: 'indicatePoint',
                point: [x, y, z, nx, ny, nz],
              });
            }
            break;
          }

          case 't': {
            const position = _cursor.geometry.attributes.position;
            if (_cursor.userData.anchored) {
              const segment = new LineSegments(
                _cursor.geometry.clone(),
                _cursor.material
              );
              segment.userData.tangible = true;
              _edits.push([
                segment,
                'segment',
                [position.array[0], position.array[1], position.array[2]],
                [position.array[3], position.array[4], position.array[5]],
              ]);
              adviseEdits();
              segment.layers.set(SKETCH_LAYER);
              scene.attach(segment);
              _cursor.userData.anchored = false;
            } else {
              position.array[3] = position.array[0];
              position.array[4] = position.array[1];
              position.array[5] = position.array[2];
              _cursor.userData.anchored = true;
            }
            break;
          }

          case 'Delete':
          case 'Backspace': {
            if (_object) {
              const object = _object;
              detach();
              object.removeFromParent();
            }
            break;
          }

          // Pass on other keystrokes
          default:
            this.dispatchEvent({
              at: _at,
              deleteObject,
              event,
              object: _object,
              placeObject,
              type: 'keydown',
            });
            break;
        }
      }

      update();
    };

    const onPointerDown = (event) => {
      const { object } = raycast(_mouseX, _mouseY, _camera, [_scene]);
      if (!object) {
        detach();
      } else if (object !== _object) {
        attach(object);
      }
    };

    // API

    this.attach = attach;
    this.change = change;
    this.detach = detach;
    this.dispose = dispose;
    this.disable = disable;
    this.enable = enable;
  }
}

const setColor = (
  definitions,
  tags = [],
  parameters = {},
  otherwise = [0, 0, 0]
) => {
  let rgb = toRgbFromTags(tags, definitions, null);
  if (rgb === null) {
    rgb = otherwise;
  }
  if (rgb === null) {
    return;
  }
  const [r, g, b] = rgb;
  const color = ((r << 16) | (g << 8) | b) >>> 0;
  parameters.color = color;
  return parameters;
};

// Map of url to texture promises;
const textureCache = new Map();

const loadTexture = (url) => {
  if (!textureCache.has(url)) {
    textureCache.set(
      url,
      new Promise((resolve, reject) => {
        const loader = new ImageBitmapLoader();
        loader.setOptions({ imageOrientation: 'flipY' });
        loader.load(
          url,
          (imageBitmap) => {
            const texture = new CanvasTexture(imageBitmap);
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 1);
            texture.colorSpace = SRGBColorSpace;
            resolve(texture);
          },
          (progress) => console.log(`Loading: ${url}`),
          reject
        );
      })
    );
  }
  return textureCache.get(url);
};

const merge = async (properties, parameters) => {
  for (const key of Object.keys(properties)) {
    if (key === 'map') {
      parameters[key] = await loadTexture(properties[key]);
    } else {
      parameters[key] = properties[key];
    }
  }
};

const setMaterial = async (definitions, tags, parameters) => {
  const threejsMaterial = toThreejsMaterialFromTags(tags, definitions);
  if (threejsMaterial !== undefined) {
    await merge(threejsMaterial, parameters);
    return threejsMaterial;
  }
};

const buildMeshMaterial = async (definitions, tags) => {
  if (tags !== undefined) {
    const parameters = {};
    const color = setColor(definitions, tags, parameters, null);
    const material = await setMaterial(definitions, tags, parameters);
    if (material) {
      return new MeshPhysicalMaterial(parameters);
    } else if (color) {
      await merge(
        toThreejsMaterialFromTags(['material:color'], definitions),
        parameters
      );
      parameters.emissive = parameters.color;
      return new MeshPhongMaterial(parameters);
    }
  }

  // Else, default to normal material.
  return new MeshNormalMaterial({ transparent: true, opacity: 1 });
};

// FIX: Found it somewhere -- attribute.
const applyBoxUVImpl = (geom, transformMatrix, bbox, bboxMaxSize) => {
  const coords = [];
  coords.length = (2 * geom.attributes.position.array.length) / 3;

  if (geom.attributes.uv === undefined) {
    geom.setAttribute('uv', new Float32BufferAttribute(coords, 2));
  }

  // maps 3 verts of 1 face on the better side of the cube
  // side of the cube can be XY, XZ or YZ
  const makeUVs = (v0, v1, v2) => {
    // pre-rotate the model so that cube sides match world axis
    v0.applyMatrix4(transformMatrix);
    v1.applyMatrix4(transformMatrix);
    v2.applyMatrix4(transformMatrix);

    // get normal of the face, to know into which cube side it maps better
    let n = new Vector3();
    n.crossVectors(v1.clone().sub(v0), v1.clone().sub(v2)).normalize();

    n.x = Math.abs(n.x);
    n.y = Math.abs(n.y);
    n.z = Math.abs(n.z);

    let uv0 = new Vector2();
    let uv1 = new Vector2();
    let uv2 = new Vector2();
    // xz mapping
    if (n.y > n.x && n.y > n.z) {
      uv0.x = (v0.x - bbox.min.x) / bboxMaxSize;
      uv0.y = (bbox.max.z - v0.z) / bboxMaxSize;

      uv1.x = (v1.x - bbox.min.x) / bboxMaxSize;
      uv1.y = (bbox.max.z - v1.z) / bboxMaxSize;

      uv2.x = (v2.x - bbox.min.x) / bboxMaxSize;
      uv2.y = (bbox.max.z - v2.z) / bboxMaxSize;
    } else if (n.x > n.y && n.x > n.z) {
      uv0.x = (v0.z - bbox.min.z) / bboxMaxSize;
      uv0.y = (v0.y - bbox.min.y) / bboxMaxSize;

      uv1.x = (v1.z - bbox.min.z) / bboxMaxSize;
      uv1.y = (v1.y - bbox.min.y) / bboxMaxSize;

      uv2.x = (v2.z - bbox.min.z) / bboxMaxSize;
      uv2.y = (v2.y - bbox.min.y) / bboxMaxSize;
    } else if (n.z > n.y && n.z > n.x) {
      uv0.x = (v0.x - bbox.min.x) / bboxMaxSize;
      uv0.y = (v0.y - bbox.min.y) / bboxMaxSize;

      uv1.x = (v1.x - bbox.min.x) / bboxMaxSize;
      uv1.y = (v1.y - bbox.min.y) / bboxMaxSize;

      uv2.x = (v2.x - bbox.min.x) / bboxMaxSize;
      uv2.y = (v2.y - bbox.min.y) / bboxMaxSize;
    }

    return { uv0, uv1, uv2 };
  };

  if (geom.index) {
    // is it indexed buffer geometry?
    for (let vi = 0; vi < geom.index.array.length; vi += 3) {
      const idx0 = geom.index.array[vi];
      const idx1 = geom.index.array[vi + 1];
      const idx2 = geom.index.array[vi + 2];

      const vx0 = geom.attributes.position.array[3 * idx0];
      const vy0 = geom.attributes.position.array[3 * idx0 + 1];
      const vz0 = geom.attributes.position.array[3 * idx0 + 2];

      const vx1 = geom.attributes.position.array[3 * idx1];
      const vy1 = geom.attributes.position.array[3 * idx1 + 1];
      const vz1 = geom.attributes.position.array[3 * idx1 + 2];

      const vx2 = geom.attributes.position.array[3 * idx2];
      const vy2 = geom.attributes.position.array[3 * idx2 + 1];
      const vz2 = geom.attributes.position.array[3 * idx2 + 2];

      const v0 = new Vector3(vx0, vy0, vz0);
      const v1 = new Vector3(vx1, vy1, vz1);
      const v2 = new Vector3(vx2, vy2, vz2);

      const uvs = makeUVs(v0, v1, v2);

      coords[2 * idx0] = uvs.uv0.x;
      coords[2 * idx0 + 1] = uvs.uv0.y;

      coords[2 * idx1] = uvs.uv1.x;
      coords[2 * idx1 + 1] = uvs.uv1.y;

      coords[2 * idx2] = uvs.uv2.x;
      coords[2 * idx2 + 1] = uvs.uv2.y;
    }
  } else {
    for (let vi = 0; vi < geom.attributes.position.array.length; vi += 9) {
      const vx0 = geom.attributes.position.array[vi];
      const vy0 = geom.attributes.position.array[vi + 1];
      const vz0 = geom.attributes.position.array[vi + 2];

      const vx1 = geom.attributes.position.array[vi + 3];
      const vy1 = geom.attributes.position.array[vi + 4];
      const vz1 = geom.attributes.position.array[vi + 5];

      const vx2 = geom.attributes.position.array[vi + 6];
      const vy2 = geom.attributes.position.array[vi + 7];
      const vz2 = geom.attributes.position.array[vi + 8];

      const v0 = new Vector3(vx0, vy0, vz0);
      const v1 = new Vector3(vx1, vy1, vz1);
      const v2 = new Vector3(vx2, vy2, vz2);

      const uvs = makeUVs(v0, v1, v2);

      const idx0 = vi / 3;
      const idx1 = idx0 + 1;
      const idx2 = idx0 + 2;

      coords[2 * idx0] = uvs.uv0.x;
      coords[2 * idx0 + 1] = uvs.uv0.y;

      coords[2 * idx1] = uvs.uv1.x;
      coords[2 * idx1 + 1] = uvs.uv1.y;

      coords[2 * idx2] = uvs.uv2.x;
      coords[2 * idx2 + 1] = uvs.uv2.y;
    }
  }

  geom.attributes.uv.array = new Float32Array(coords);
};

const applyBoxUV = (bufferGeometry, transformMatrix, boxSize) => {
  if (transformMatrix === undefined) {
    transformMatrix = new Matrix4();
  }

  if (boxSize === undefined) {
    const geom = bufferGeometry;
    geom.computeBoundingBox();
    const bbox = geom.boundingBox;

    const bboxSizeX = bbox.max.x - bbox.min.x;
    const bboxSizeY = bbox.max.y - bbox.min.y;
    const bboxSizeZ = bbox.max.z - bbox.min.z;

    boxSize = Math.max(bboxSizeX, bboxSizeY, bboxSizeZ);
  }

  const uvBbox = new Box3(
    new Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2),
    new Vector3(boxSize / 2, boxSize / 2, boxSize / 2)
  );

  applyBoxUVImpl(bufferGeometry, transformMatrix, uvBbox, boxSize);
};

const updateUserData = (geometry, scene, userData) => {
  if (geometry.tags) {
    for (const tag of geometry.tags) {
      if (tag.startsWith('editId:')) {
        userData.editId = tag.substring(7);
      } else if (tag.startsWith('editType:')) {
        userData.editType = tag.substring(9);
      } else if (tag.startsWith('viewId:')) {
        userData.viewId = tag.substring(7);
      } else if (tag.startsWith('viewType:')) {
        userData.viewType = tag.substring(9);
      } else if (tag.startsWith('groupChildId:')) {
        // Deprecate these.
        userData.groupChildId = parseInt(tag.substring(13));
      }
    }
    userData.tags = geometry.tags;
  }
};

const parseRational = (text) => {
  if (text === '') {
    return 0;
  }
  return parseInt(text);
};

const buildMeshes = async ({
  geometry,
  scene,
  render,
  definitions,
  pageSize = [],
}) => {
  if (geometry === undefined) {
    return;
  }
  const { tags = [] } = geometry;
  const layer = tags.includes('show:overlay') ? SKETCH_LAYER : GEOMETRY_LAYER;
  let mesh;
  let matrix;

  if (geometry.matrix) {
    matrix = new Matrix4();
    // Bypass matrix.set to use column-major ordering.
    for (let nth = 0; nth < 16; nth++) {
      matrix.elements[nth] = geometry.matrix[nth];
    }
  }

  switch (geometry.type) {
    case 'layout': {
      const [width, length] = geometry.layout.size;
      pageSize[0] = width;
      pageSize[1] = length;
      break;
    }
    case 'sketch':
    case 'displayGeometry':
    case 'group':
    case 'item':
    case 'plan':
      break;
    case 'segments': {
      const { segments } = geometry;
      const bufferGeometry = new BufferGeometry();
      const material = new LineBasicMaterial({
        color: new Color(setColor(definitions, tags, {}, [0, 0, 0]).color),
        linewidth: 2,
      });
      const positions = [];
      for (const segment of segments) {
        const [start, end] = segment;
        const [aX = 0, aY = 0, aZ = 0] = start;
        const [bX = 0, bY = 0, bZ = 0] = end;
        positions.push(aX, aY, aZ, bX, bY, bZ);
      }
      bufferGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      mesh = new LineSegments(bufferGeometry, material);
      mesh.layers.set(layer);
      updateUserData(geometry, scene, mesh.userData);
      scene.add(mesh);
      break;
    }
    case 'points': {
      const { points } = geometry;
      const threeGeometry = new BufferGeometry();
      const material = new PointsMaterial({
        color: setColor(definitions, tags, {}, [0, 0, 0]).color,
        size: 0.5,
      });
      const positions = [];
      for (const [aX = 0, aY = 0, aZ = 0] of points) {
        positions.push(aX, aY, aZ);
      }
      threeGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      mesh = new Points(threeGeometry, material);
      mesh.layers.set(layer);
      updateUserData(geometry, scene, mesh.userData);
      scene.add(mesh);
      break;
    }
    case 'graph': {
      const { tags, graph } = geometry;
      const { serializedSurfaceMesh } = graph;
      if (serializedSurfaceMesh === undefined) {
        throw Error(`Graph is not serialized: ${JSON.stringify(geometry)}`);
      }
      const tokens = serializedSurfaceMesh
        .split(/\s+/g)
        .map((token) => parseRational(token));
      let p = 0;
      let vertexCount = tokens[p++];
      const vertices = [];
      while (vertexCount-- > 0) {
        // The first three are precise values that we don't use.
        p += 3;
        // These three are approximate values in 1000th of mm that we will use.
        vertices.push([
          tokens[p++] / 1000,
          tokens[p++] / 1000,
          tokens[p++] / 1000,
        ]);
      }
      let faceCount = tokens[p++];
      const positions = [];
      const normals = [];
      while (faceCount-- > 0) {
        let vertexCount = tokens[p++];
        if (vertexCount !== 3) {
          throw Error(
            `Faces must be triangles: vertexCount=${vertexCount} p=${p} ps=${tokens
              .slice(p, p + 10)
              .join(' ')} serial=${serializedSurfaceMesh}`
          );
        }
        const triangle = [];
        while (vertexCount-- > 0) {
          const vertex = vertices[tokens[p++]];
          if (!vertex.every(isFinite)) {
            throw Error(`Non-finite vertex: ${vertex}`);
          }
          triangle.push(vertex);
        }
        const plane = new Plane();
        plane.setFromCoplanarPoints(
          new Vector3(...triangle[0]),
          new Vector3(...triangle[1]),
          new Vector3(...triangle[2])
        );
        positions.push(...triangle[0]);
        positions.push(...triangle[1]);
        positions.push(...triangle[2]);
        plane.normalize();
        const { x, y, z } = plane.normal;
        normals.push(x, y, z);
        normals.push(x, y, z);
        normals.push(x, y, z);
      }
      if (positions.length === 0) {
        break;
      }
      const bufferGeometry = new BufferGeometry();
      bufferGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      bufferGeometry.setAttribute(
        'normal',
        new Float32BufferAttribute(normals, 3)
      );
      applyBoxUV(bufferGeometry);

      if (!tags.includes('show:noSkin')) {
        const material = await buildMeshMaterial(definitions, tags);
        mesh = new Mesh(bufferGeometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.set(layer);
        updateUserData(geometry, scene, mesh.userData);
        mesh.userData.tangible = true;
        if (tags.includes('type:ghost')) {
          mesh.userData.tangible = false;
          material.transparent = true;
          material.depthWrite = false;
          material.opacity *= 0.125;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      } else {
        mesh = new Group();
      }

      {
        const edges = new EdgesGeometry(
          bufferGeometry,
          /* thresholdAngle= */ 20
        );
        const material = new LineBasicMaterial({ color: 0x000000 });
        const outline = new LineSegments(edges, material);
        outline.userData.isOutline = true;
        outline.userData.hasShowOutline = !tags.includes('show:noOutline');
        outline.visible = outline.userData.hasShowOutline;
        if (tags.includes('type:ghost')) {
          mesh.userData.tangible = false;
          material.transparent = true;
          material.depthWrite = false;
          material.opacity *= 0.25;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
        mesh.add(outline);
      }

      if (tags.includes('show:wireframe')) {
        const edges = new WireframeGeometry(bufferGeometry);
        const outline = new LineSegments(
          edges,
          new LineBasicMaterial({ color: 0x000000 })
        );
        mesh.add(outline);
      }

      scene.add(mesh);
      break;
    }
    case 'polygonsWithHoles': {
      const baseNormal = new Vector3(0, 0, 1);
      const plane = new Plane(baseNormal, 0);
      const meshes = new Group();
      for (const { points, holes } of geometry.polygonsWithHoles) {
        const boundaryPoints = [];
        for (const p2 of points) {
          const p3 = new Vector3(p2[0], p2[1], 0);
          plane.projectPoint(p3, p3);
          boundaryPoints.push(p3);
        }
        const shape = new Shape(boundaryPoints);
        for (const { points } of holes) {
          const holePoints = [];
          for (const p2 of points) {
            const p3 = new Vector3(p2[0], p2[1], 0);
            plane.projectPoint(p3, p3);
            holePoints.push(p3);
          }
          shape.holes.push(new Path(holePoints));
        }
        const shapeGeometry = new ShapeGeometry(shape);
        if (!tags.includes('show:noSkin')) {
          const material = await buildMeshMaterial(definitions, tags);
          mesh = new Mesh(shapeGeometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.layers.set(layer);
          updateUserData(geometry, scene, mesh.userData);
          mesh.userData.tangible = true;
          if (tags.includes('type:ghost')) {
            mesh.userData.tangible = false;
            material.transparent = true;
            material.depthWrite = false;
            material.opacity *= 0.125;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
          }
        } else {
          mesh = new Group();
        }

        {
          const edges = new EdgesGeometry(shapeGeometry);
          const material = new LineBasicMaterial({
            color: 0x000000,
            linewidth: 1,
          });
          const outline = new LineSegments(edges, material);
          outline.userData.isOutline = true;
          outline.userData.hasShowOutline = !tags.includes('show:noOutline');
          outline.visible = outline.userData.hasShowOutline;
          if (tags.includes('type:ghost')) {
            mesh.userData.tangible = false;
            material.transparent = true;
            material.depthWrite = false;
            material.opacity *= 0.25;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
          }
          mesh.add(outline);
        }

        if (tags.includes('show:wireframe')) {
          const edges = new WireframeGeometry(shapeGeometry);
          const outline = new LineSegments(
            edges,
            new LineBasicMaterial({ color: 0x000000 })
          );
          mesh.add(outline);
        }
        meshes.add(mesh);
      }
      mesh = meshes;
      scene.add(mesh);
      // Need to handle the origin shift.
      // orient(mesh, normal, baseNormal, geometry.plane[3]);
      break;
    }
    default:
      throw Error(`Non-display geometry: ${geometry.type}`);
  }

  if (mesh && geometry.matrix) {
    mesh.applyMatrix4(matrix);
  }

  if (mesh) {
    mesh.updateMatrix();
    mesh.updateMatrixWorld();
  }

  if (geometry.content) {
    if (mesh === undefined) {
      mesh = new Group();
      updateUserData({}, scene, mesh.userData);
      scene.add(mesh);
    }
    for (const content of geometry.content) {
      await buildMeshes({
        geometry: content,
        scene: mesh,
        layer,
        render,
        definitions,
      });
    }
  }
};

const moveToFit = ({
  view,
  camera,
  controls = [],
  scene,
  fitOffset = 1.2,
  withGrid = false,
  gridLayer = GEOMETRY_LAYER,
  pageSize = [],
  gridState = { objects: [], visible: withGrid },
} = {}) => {
  const { fit = true } = view;

  let box;

  scene.traverse((object) => {
    if (object instanceof GridHelper) {
      return;
    }
    if (object.userData.tags && object.userData.tags.includes('type:ghost')) {
      return;
    }
    if (
      object instanceof LineSegments ||
      object instanceof Mesh ||
      object instanceof Shape
    ) {
      const objectBox = new Box3();
      objectBox.setFromObject(object);
      if (
        !isFinite(objectBox.max.x) ||
        !isFinite(objectBox.max.y) ||
        !isFinite(objectBox.max.z) ||
        !isFinite(objectBox.min.x) ||
        !isFinite(objectBox.min.y) ||
        !isFinite(objectBox.min.z)
      ) {
        return;
      }
      if (box) {
        box = box.union(objectBox);
      } else {
        box = objectBox;
      }
    }
  });

  while (gridState.objects.length > 0) {
    const object = gridState.objects.pop();
    if (object.parent) {
      object.parent.remove(object);
    }
  }

  if (!box) {
    box = new Box3();
    box.setFromObject(scene);
  }

  if (withGrid) {
    const x = Math.max(Math.abs(box.min.x), Math.abs(box.max.x));
    const y = Math.max(Math.abs(box.min.y), Math.abs(box.max.y));
    const length = Math.max(x, y);
    const scale = Math.pow(10, Math.ceil(Math.log10(length)));
    const size = scale;
    {
      const grid = new GridHelper(size / 2, 50, 0x000040, 0x20a020);
      grid.material.transparent = true;
      grid.material.opacity = 0.5;
      grid.rotation.x = -Math.PI / 2;
      grid.position.set(0, 0, -0.1);
      grid.layers.set(gridLayer);
      grid.userData.tangible = false;
      grid.userData.dressing = true;
      grid.userData.grid = true;
      scene.add(grid);
      gridState.objects.push(grid);
    }
    {
      const grid = new GridHelper(size * 2, 20, 0x000040, 0xf04040);
      grid.material.transparent = true;
      grid.material.opacity = 0.5;
      grid.rotation.x = -Math.PI / 2;
      grid.position.set(0, 0, -0.05);
      grid.layers.set(gridLayer);
      grid.userData.tangible = false;
      grid.userData.dressing = true;
      grid.userData.grid = true;
      scene.add(grid);
      gridState.objects.push(grid);
    }
  }

  if (withGrid) {
    // The interactive mat is on z0.
    const plane = new Mesh(
      new PlaneGeometry(10 * 1000, 10 * 1000),
      new MeshStandardMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    plane.castShadow = false;
    plane.position.set(0, 0, 0);
    plane.layers.set(gridLayer);
    plane.userData.tangible = true;
    plane.userData.dressing = true;
    plane.userData.grid = true;
    plane.userData.mat = true;
    scene.add(plane);
    gridState.objects.push(plane);
  }

  if (!fit) {
    return;
  }

  for (const control of controls) {
    control.reset();
  }

  const target = new Vector3(0, 0, 0);

  const points = [
    new Vector3(box.min.x, box.min.y, box.min.z),
    new Vector3(box.max.x, box.min.y, box.min.z),
    new Vector3(box.min.x, box.max.y, box.min.z),
    new Vector3(box.max.x, box.max.y, box.min.z),
    new Vector3(box.min.x, box.min.y, box.max.z),
    new Vector3(box.max.x, box.min.y, box.max.z),
    new Vector3(box.min.x, box.max.y, box.max.z),
    new Vector3(box.max.x, box.max.y, box.max.z),
  ];

  // Back the camera off by 1mm at a time until the bounding box is contained by
  // the frustrum.
  // CHECK: Use a binary search if this becomes a latency problem.
  for (let distance = 1; distance < 100000; distance += 1) {
    const direction = target
      .clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance);

    camera.position.copy(target).sub(direction);

    camera.near = 0.1; // 0.1mm
    camera.far = 100 * 1000; // 1km

    camera.updateMatrix();
    camera.updateMatrixWorld();

    const frustum = new Frustum();
    frustum.setFromProjectionMatrix(
      new Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
    );

    if (points.every((point) => frustum.containsPoint(point))) {
      break;
    }
  }
};

/* global ResizeObserver, requestAnimationFrame */

const buildTrackballControls = ({
  camera,
  render,
  viewerElement,
  view = {},
}) => {
  const { target = [0, 0, 0] } = view;
  const trackballControls = new TrackballControls(camera, viewerElement);
  trackballControls.keys = [65, 83, 68];
  trackballControls.target.set(...target);
  trackballControls.update();
  trackballControls.zoomSpeed = 2.5;
  trackballControls.panSpeed = 1.25;
  trackballControls.rotateSpeed = 2.5;
  trackballControls.staticMoving = true;
  return { trackballControls };
};

const buildAnchorControls = ({
  camera,
  draggableObjects,
  endUpdating,
  render,
  scene,
  startUpdating,
  trackballControls,
  viewerElement,
  editId,
}) => {
  const anchorControls = new AnchorControls({
    camera,
    domElement: viewerElement,
    scene,
    render,
    editId,
  });
  anchorControls.enable();
  return { anchorControls };
};

const toEditIdFromPath = (path) => {
  if (path) {
    const pieces = path.split('/');
    return pieces.slice(pieces.length - 2).join('$');
  }
};

const orbitDisplay = async (
  {
    view = {},
    geometry,
    path,
    canvas,
    withAxes = false,
    withGrid = true,
    gridLayer = GEOMETRY_LAYER,
    definitions,
  } = {},
  page
) => {
  const editId = toEditIdFromPath(path);
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(SKETCH_LAYER);

  const {
    camera,
    canvas: displayCanvas,
    renderer,
    scene,
  } = buildScene({
    canvas,
    width,
    height,
    view,
    geometryLayers,
    planLayers,
    withAxes,
  });

  let isUpdating = false;

  let trackballControls;
  const update = () => {
    trackballControls.update();
    anchorControls.change();
    render();
    if (isUpdating) {
      requestAnimationFrame(update);
    }
  };

  const startUpdating = () => {
    if (!isUpdating) {
      isUpdating = true;
      update();
    }
  };

  const endUpdating = () => {
    isUpdating = false;
  };

  let isRendering = false;

  const doRender = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    renderer.clearDepth();

    camera.layers.set(SKETCH_LAYER);
    renderer.render(scene, camera);

    isRendering = false;
  };

  const render = () => {
    if (isRendering) {
      return;
    }
    isRendering = true;
    requestAnimationFrame(doRender);
  };

  if (!canvas) {
    page.appendChild(displayCanvas);
  }

  ({ trackballControls } = buildTrackballControls({
    camera,
    render,
    view,
    viewerElement: displayCanvas,
  }));

  const { anchorControls } = buildAnchorControls({
    camera,
    endUpdating,
    render,
    scene,
    startUpdating,
    trackballControls,
    view,
    viewerElement: displayCanvas,
    editId,
  });

  anchorControls.addEventListener('change', update);

  const { resize } = createResizer({
    camera,
    controls: [trackballControls],
    renderer,
    viewerElement: page,
  });

  new ResizeObserver(() => {
    resize();
    render();
  }).observe(page);

  const pageSize = [];

  const gridState = {
    objects: [],
    visible: withGrid,
  };

  const updateFit = () =>
    moveToFit({
      view,
      camera,
      controls: [trackballControls],
      scene,
      withGrid: true,
      gridLayer,
      pageSize,
      gridState,
    });

  const showGrid = (visible) => {
    if (gridState.visible !== visible) {
      gridState.visible = visible;
      for (const object of gridState.objects) {
        object.visible = visible;
      }
      render();
    }
  };

  showGrid(withGrid);

  let moveToFitDone = false;

  const updateGeometry = async (geometry, { fit = true, timestamp } = {}) => {
    for (const object of [...scene.children]) {
      if (
        !object.userData.dressing &&
        (!timestamp ||
          !object.userData.created ||
          object.userData.created < timestamp)
      ) {
        // If the object isn't dressing and was created before the update time, then it should be obsolete.
        scene.remove(object);
      }
    }

    view = { ...view, fit };

    try {
      await buildMeshes({
        geometry,
        scene,
        render,
        definitions,
        pageSize,
      });
    } catch (e) {
      console.log(e.stack);
      throw e;
    }

    if (!moveToFitDone) {
      moveToFitDone = true;
      updateFit();
    }

    render();
  };

  if (geometry) {
    await updateGeometry(geometry);
  }

  trackballControls.addEventListener('start', startUpdating);
  trackballControls.addEventListener('end', endUpdating);

  return {
    camera,
    canvas: displayCanvas,
    anchorControls,
    render,
    renderer,
    scene,
    showGrid,
    trackballControls,
    updateFit,
    updateGeometry,
  };
};

/* global OffscreenCanvas */

let locked = false;
const pending = [];

const acquire = async () => {
  if (locked) {
    return new Promise((resolve, reject) => pending.push(resolve));
  } else {
    locked = true;
  }
};

const release = async () => {
  if (pending.length > 0) {
    const resolve = pending.pop();
    resolve(true);
  } else {
    locked = false;
  }
};

const staticDisplay = async (
  {
    view = {},
    canvas,
    geometry,
    withAxes = false,
    withGrid = false,
    definitions,
  } = {},
  page
) => {
  if (locked === true) await acquire();
  console.log('QQ/static display: begin');
  locked = true;

  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  if (!canvas) {
    canvas = new OffscreenCanvas(width, height);
  }

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(SKETCH_LAYER);

  const {
    camera,
    canvas: displayCanvas,
    renderer,
    scene,
  } = buildScene({
    canvas,
    width,
    height,
    view,
    geometryLayers,
    planLayers,
    withAxes,
    preserveDrawingBuffer: true,
  });

  const render = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    renderer.clearDepth();

    camera.layers.set(SKETCH_LAYER);
    renderer.render(scene, camera);
  };

  const pageSize = [];

  try {
    await buildMeshes({ datasets, geometry, scene, definitions, pageSize });
  } catch (e) {
    console.log(e.stack);
    throw e;
  }

  moveToFit({ datasets, view, camera, scene, withGrid, pageSize });

  render();

  console.log('QQ/static display: end');
  await release();

  return { canvas: displayCanvas, renderer };
};

/* global FileReader */

const UP = [0, 0.0001, 1];

const staticView = async (
  shape,
  {
    target = [0, 0, 0],
    position = [0, 0, 0],
    up = UP,
    width = 256,
    height = 128,
    withAxes = false,
    withGrid = false,
    definitions,
    canvas,
  } = {}
) => {
  const { canvas: rendererCanvas } = await staticDisplay(
    {
      view: { target, position, up },
      canvas,
      geometry: await shape.toDisplayGeometry(),
      withAxes,
      withGrid,
      definitions,
    },
    { offsetWidth: width, offsetHeight: height }
  );
  return rendererCanvas;
};

const getFileReader = () =>
  isNode ? new FileReaderForNode.FileReaderAsync() : new FileReader();

const dataUrl = async (shape, options) => {
  const canvas = await staticView(shape, options);
  const blob = await canvas.convertToBlob();
  const dataUrl = await new Promise((resolve, reject) => {
    const fileReader = getFileReader();
    fileReader.addEventListener('load', () => resolve(fileReader.result));
    fileReader.addEventListener('error', () =>
      reject(new Error('readAsDataURL failed'))
    );
    fileReader.readAsDataURL(blob);
  });
  // const dataUrl = getFileReaderSync().readAsDataURL(blob);
  // const dataUrl = (await staticView(shape, options)).toDataURL('png');
  return dataUrl;
};

const image = async (shape, options) => {
  const image = document.createElement('img');
  const dataUrl = (await staticView(shape, options)).toDataURL('png');
  image.src = dataUrl;
  return image;
};

const orbitView = async (
  shape,
  { target, position, up = UP, width = 256, height = 128, definitions } = {}
) => {
  const container = document.createElement('div');
  container.style = `width: ${width}px; height: ${height}px`;

  const geometry = await shape.toDisplayGeometry();
  const view = { target, position, up };

  await orbitDisplay({ geometry, view, definitions }, container);
  return container;
};

const addVoxel = ({ editId, point, scene, threejsMesh }) => {
  const box = new BoxGeometry(1, 1, 1);
  const mesh = new Mesh(box, threejsMesh.material);
  mesh.userData.editId = editId;
  mesh.userData.ephemeral = true;
  mesh.userData.tangible = true;
  mesh.position.set(...point);
  scene.add(mesh);
};

const round = (value, resolution) =>
  Math.round(value / resolution) * resolution;

const getWorldPosition = (object, resolution = 0.01) => {
  const vector = new Vector3();
  object.getWorldPosition(vector);
  return [
    round(vector.x, resolution),
    round(vector.y, resolution),
    round(vector.z, resolution),
  ];
};

export { addVoxel, buildMeshes, buildScene, createResizer, dataUrl, getWorldPosition, image, orbitDisplay, orbitView, raycast, staticDisplay, staticView };
