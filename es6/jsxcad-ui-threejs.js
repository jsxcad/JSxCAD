import { isNode } from './jsxcad-sys.js';
import { GEOMETRY_LAYER, SKETCH_LAYER, buildScene, moveToFit, buildMeshes, staticDisplay } from './jsxcad-convert-threejs.js';
export { buildMeshes, buildScene, staticDisplay } from './jsxcad-convert-threejs.js';
import { Raycaster, Vector2, Points, LineSegments, Shape, EventDispatcher, MeshBasicMaterial, Vector3, BufferGeometry, LineBasicMaterial, Float32BufferAttribute, Mesh, BoxGeometry, Layers, TrackballControls } from './jsxcad-algorithm-threejs.js';

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
    withGrid = false,
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
      withGrid,
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

export { addVoxel, createResizer, dataUrl, getWorldPosition, image, orbitDisplay, orbitView, raycast, staticView };
