// global document

import {
  BoxGeometry,
  BufferGeometry,
  EventDispatcher,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from '@jsxcad/algorithm-threejs';
import { SKETCH_LAYER } from '@jsxcad/convert-threejs';
import { raycast } from './raycast.js';

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

      _surfaceCursor = getOrientedCursorPoint(event);
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

export { AnchorControls };
