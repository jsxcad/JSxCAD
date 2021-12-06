// global document

import {
  ArrowHelper,
  BoxGeometry,
  EventDispatcher,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three';
import { SKETCH_LAYER } from './layers.js';
import { raycast } from './raycast.js';

class AnchorControls extends EventDispatcher {
  constructor(_camera, _domElement, _scene) {
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

    let _step = 1;
    let _object = null;

    let _at = new Mesh(new BoxGeometry(1, 1, 1), yellow);

    let _to = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), red);
    let _toArrow = new ArrowHelper();
    let _lockTo = true;

    let _up = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), blue);
    let _upArrow = new ArrowHelper();
    let _lockUp = true;

    _at.visible = false;
    _at.layers.set(SKETCH_LAYER);
    _at.userData.dressing = true;
    _scene.add(_at);

    _to.visible = false;
    _to.layers.set(SKETCH_LAYER);
    _to.userData.dressing = true;
    _scene.add(_to);

    _toArrow.layers.set(SKETCH_LAYER);
    _toArrow.setColor(0xff0000);
    _toArrow.userData.dressing = true;
    _at.add(_toArrow);

    _up.visible = false;
    _up.layers.set(SKETCH_LAYER);
    _up.userData.dressing = true;
    _scene.add(_up);

    _upArrow.layers.set(SKETCH_LAYER);
    _upArrow.setColor(0x0000ff);
    _upArrow.userData.dressing = true;
    _at.add(_upArrow);

    const hideObject = () => {
      if (!_object) {
        return;
      }
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
      _scene.add(copy);
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

      // This could be more efficient, since we don't need to consider axes already asigned.
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
        _object.position.copy(_at.position);
      }
      const up = new Vector3();
      up.subVectors(_up.position, _at.position);
      up.normalize();
      if (_object) {
        _object.up.copy(up);
        _object.lookAt(_to.position);
      }
      _at.scale.set(_step, _step, _step);
      _to.scale.set(_step / 2, _step / 2, _step / 2);
      _up.scale.set(_step / 2, _step / 2, _step / 2);
      const dir = new Vector3();
      dir.subVectors(_to.position, _at.position).normalize();
      _toArrow.setDirection(dir);
      _toArrow.setLength(_step * 5);
      dir.subVectors(_up.position, _at.position).normalize();
      _upArrow.setDirection(dir);
      _upArrow.setLength(_step * 2);
      this.dispatchEvent({
        type: 'change',
        at: _at,
        to: _to,
        up: _up,
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
        }
      }
      _at.visible = true;
      _to.visible = true;
      _up.visible = true;

      _at.position.set(0, 0, 0);
      _object.localToWorld(_at.position);

      _to.position.set(0, 0, 1);
      _object.localToWorld(_to.position);

      _up.position.set(0, 1, 0);
      _object.localToWorld(_up.position);

      change();
      update();

      _domElement.addEventListener('keydown', onKeyDown);
      this.dispatchEvent({ type: 'change' });
    };

    const detach = () => {
      if (_object === null) {
        return;
      }
      _object.material.opacity /= 0.5;
      for (const child of _object.children) {
        const { isOutline, hasShowOutline } = child.userData;
        if (isOutline && !hasShowOutline) {
          child.visible = false;
        }
      }
      _object = null;
      // _at.visible = false;
      // _to.visible = false;
      // _up.visible = false;
      // _domElement.removeEventListener('keydown', onKeyDown);
      this.dispatchEvent({ type: 'change', object: null });
    };

    const dispose = () => detach();

    const onKeyDown = (event) => {
      // if (!_object) return;

      if (event.getModifierState('Control')) {
        this.dispatchEvent({
          type: 'keydown',
          object: _object,
          event,
          at: _at,
          to: _to,
          up: _up,
          hideObject,
          placeObject,
        });
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
          case 'd':
            _at.position.addScaledVector(_xAxis, _step);
            if (_lockUp) {
              _up.position.addScaledVector(_xAxis, _step);
            }
            if (_lockTo) {
              _to.position.addScaledVector(_xAxis, _step);
            }
            break;
          case 'a':
            _at.position.addScaledVector(_xAxis, -_step);
            if (_lockUp) {
              _up.position.addScaledVector(_xAxis, -_step);
            }
            if (_lockTo) {
              _to.position.addScaledVector(_xAxis, -_step);
            }
            break;
          case 'w':
            _at.position.addScaledVector(_yAxis, _step);
            if (_lockUp) {
              _up.position.addScaledVector(_yAxis, _step);
            }
            if (_lockTo) {
              _to.position.addScaledVector(_yAxis, _step);
            }
            break;
          case 's':
            _at.position.addScaledVector(_yAxis, -_step);
            if (_lockUp) {
              _up.position.addScaledVector(_yAxis, -_step);
            }
            if (_lockTo) {
              _to.position.addScaledVector(_yAxis, -_step);
            }
            break;
          case 'e':
            _at.position.addScaledVector(_zAxis, _step);
            if (_lockUp) {
              _up.position.addScaledVector(_zAxis, _step);
            }
            if (_lockTo) {
              _to.position.addScaledVector(_zAxis, _step);
            }
            break;
          case 'q':
            _at.position.addScaledVector(_zAxis, -_step);
            if (_lockUp) {
              _up.position.addScaledVector(_zAxis, -_step);
            }
            if (_lockTo) {
              _to.position.addScaledVector(_zAxis, -_step);
            }
            break;

          // to
          case 'h':
            _to.position.addScaledVector(_xAxis, _step);
            break;
          case 'f':
            _to.position.addScaledVector(_xAxis, -_step);
            break;
          case 't':
            _to.position.addScaledVector(_yAxis, _step);
            break;
          case 'g':
            _to.position.addScaledVector(_yAxis, -_step);
            break;
          case 'y':
            _to.position.addScaledVector(_zAxis, _step);
            break;
          case 'r':
            _to.position.addScaledVector(_zAxis, -_step);
            break;

          // up
          case 'l':
            _to.position.addScaledVector(_xAxis, _step);
            break;
          case 'j':
            _to.position.addScaledVector(_xAxis, -_step);
            break;
          case 'i':
            _to.position.addScaledVector(_yAxis, _step);
            break;
          case 'k':
            _to.position.addScaledVector(_yAxis, -_step);
            break;
          case 'o':
            _to.position.addScaledVector(_zAxis, _step);
            break;
          case 'u':
            _to.position.addScaledVector(_zAxis, -_step);
            break;

          // Pass on other keystrokes
          default:
            this.dispatchEvent({
              type: 'keydown',
              object: _object,
              event,
              at: _at,
              to: _to,
              up: _up,
              hideObject,
              placeObject,
            });
            break;
        }
      }

      update();
    };

    const onPointerDown = (event) => {
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.x) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.y) / rect.height) * 2 + 1;
      const { object } = raycast(x, y, _camera, [_scene]);
      if (!object) {
        detach();
      } else {
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
