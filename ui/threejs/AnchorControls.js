// global document

import {
  BoxGeometry,
  EventDispatcher,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three';
import { SKETCH_LAYER } from './layers.js';
import { raycast } from './raycast.js';

/*
export const dragAnchor = ({ object }) => {
  const { parent, userData } = object;
  const { anchorType } = userData;
  switch (anchorType) {
    case 'at': {
      // Get the anchor's position in the parent's frame of reference.
      const anchor = new Vector3();
      object.getWorldPosition(anchor);
      parent.position.copy(anchor);
      parent.userData.anchor.at = anchor;
      object.position.set(0, 0, 0);
      break;
    }
    case 'to': {
      // Get the anchor's position in the parent's frame of reference.
      const anchor = new Vector3();
      anchor.copy(object.position);
      object.localToWorld(anchor);
      parent.lookAt(anchor);
      // And reset the offset.
      parent.userData.anchor.to = anchor;
      object.position.set(0, 0, 1);
      break;
    }
    // Orthogonal to the [at, to] edge.
    case 'up': {
      // Get the anchor's position in the parent's frame of reference.
      const anchor = new Vector3();
      anchor.copy(object.position);
      object.localToWorld(anchor);
      const position = new Vector3();
      parent.getWorldPosition(position);
      anchor.sub(position);
      // parent.worldToLocal(anchor);
      parent.up.copy(anchor);
      console.log(JSON.stringify(anchor));
      parent.userData.anchor.up = anchor;
      parent.lookAt(parent.userData.anchor.to);
      // And reset the offset.
      object.position.set(0, 1, 0);
      break;
    }
  }
};
*/

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

    const red = _material.clone();
    red.color.setHex(0xff0000);
    const green = _material.clone();
    green.color.setHex(0x00ff00);
    const blue = _material.clone();
    blue.color.setHex(0x0000ff);

    let _step = 1;
    let _object = null;

    let _at = new Mesh(new BoxGeometry(0.15, 0.15, 0.01), red);

    let _to = new Mesh(new BoxGeometry(0.15, 0.15, 0.01), green);
    let _lockTo = true;

    let _up = new Mesh(new BoxGeometry(0.15, 0.15, 0.01), blue);
    let _lockUp = true;

    _at.visible = false;
    _at.layers.set(SKETCH_LAYER);
    _at.userData.dressing = true;
    _scene.add(_at);

    _to.visible = false;
    _to.layers.set(SKETCH_LAYER);
    _to.userData.dressing = true;
    _scene.add(_to);

    _up.visible = false;
    _up.layers.set(SKETCH_LAYER);
    _up.userData.dressing = true;
    _scene.add(_up);

    const enable = () => {
      _domElement.addEventListener('pointerdown', onPointerDown);
      _domElement.tabIndex = 1; // Make the canvas focusable.
    };

    const disable = () => {
      _domElement.removeEventListener('pointerdown', onPointerDown);
    };

    const update = () => {
      _object.position.copy(_at.position);
      const up = new Vector3();
      up.subVectors(_up.position, _at.position);
      up.normalize();
      _object.up.copy(up);
      _object.lookAt(_to.position);
      console.log(_object.position);
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
      _at.visible = true;
      _to.visible = true;
      _up.visible = true;

      _at.position.set(0, 0, 0);
      _object.localToWorld(_at.position);

      _to.position.set(0, 0, 1);
      _object.localToWorld(_to.position);

      _up.position.set(0, 1, 0);
      _object.localToWorld(_up.position);

      update();

      _domElement.addEventListener('keydown', onKeyDown);
      this.dispatchEvent({ type: 'change' });
    };

    const detach = () => {
      if (_object === null) {
        return;
      }
      _object = null;
      _at.visible = false;
      _to.visible = false;
      _up.visible = false;
      _domElement.removeEventListener('keydown', onKeyDown);
      this.dispatchEvent({ type: 'change', object: null });
    };

    const dispose = () => detach();

    const onKeyDown = (event) => {
      if (!_object) return;

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
          _at.position.x += _step;
          if (_lockUp) {
            _up.position.x += _step;
          }
          if (_lockTo) {
            _to.position.x += _step;
          }
          break;
        case 'a':
          _at.position.x -= _step;
          if (_lockUp) {
            _up.position.x -= _step;
          }
          if (_lockTo) {
            _to.position.x -= _step;
          }
          break;
        case 'w':
          _at.position.y += _step;
          if (_lockUp) {
            _up.position.y += _step;
          }
          if (_lockTo) {
            _to.position.y += _step;
          }
          break;
        case 's':
          _at.position.y -= _step;
          if (_lockUp) {
            _up.position.y -= _step;
          }
          if (_lockTo) {
            _to.position.y -= _step;
          }
          break;
        case 'e':
          _at.position.z += _step;
          if (_lockUp) {
            _up.position.z += _step;
          }
          if (_lockTo) {
            _to.position.z += _step;
          }
          break;
        case 'q':
          _at.position.z -= _step;
          if (_lockUp) {
            _up.position.z -= _step;
          }
          if (_lockTo) {
            _to.position.z -= _step;
          }
          break;

        // to
        case 'h':
          _to.position.x += _step;
          break;
        case 'f':
          _to.position.x -= _step;
          break;
        case 't':
          _to.position.y += _step;
          break;
        case 'g':
          _to.position.y -= _step;
          break;
        case 'y':
          _to.position.z += _step;
          break;
        case 'r':
          _to.position.z -= _step;
          break;

        // up
        case 'l':
          _up.position.x += _step;
          break;
        case 'j':
          _up.position.x -= _step;
          break;
        case 'i':
          _up.position.y += _step;
          break;
        case 'k':
          _up.position.y -= _step;
          break;
        case 'o':
          _up.position.z += _step;
          break;
        case 'u':
          _up.position.z -= _step;
          break;
      }

      update();
    };

    const onPointerDown = (event) => {
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.x) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.y) / rect.height) * 2 + 1;
      const { object } = raycast(x, y, _camera, [_scene]);
      if (!object) {
        return;
      }
      attach(object);
    };

    // API

    this.attach = attach;
    this.detach = detach;
    this.disable = disable;
    this.enable = enable;
    this.dispose = dispose;
  }
}

export { AnchorControls };
