import { Sprite, SpriteMaterial, Texture, Vector3 } from 'three';

import { TransformControls } from './TransformControls.js';

export const addAnchor = ({
  anchorType,
  color,
  draggableObjects,
  editId,
  object,
  onClick,
  position = [0, 0, 0],
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10;
  const c = canvas.getContext('2d');
  c.strokeStyle = 'black';
  c.fillStyle = color;
  c.lineWidth = 1;
  c.beginPath();
  c.rect(0, 0, 10, 10);
  c.closePath();
  c.fill();
  c.stroke();
  const texture = new Texture(canvas);
  texture.needsUpdate = true;
  // sizeAttenuation: false means that the sprite will have constant size regardless of distance.
  const spriteMaterial = new SpriteMaterial({
    map: texture,
    sizeAttenuation: false,
  });
  const sprite = new Sprite(spriteMaterial);
  // This determines the hitbox size, regardless of what is displayed.
  sprite.scale.set(0.01, 0.01, 0.01);
  sprite.userData.editId = editId;
  sprite.userData.anchorType = anchorType;
  sprite.userData.tangible = true;
  // Regenerate on recompute.
  sprite.userData.ephemeral = true;
  // Display on the overlay.
  sprite.layers.set(1);
  object.add(sprite);
  // Anchors can be dragged.
  // draggableObjects.push(sprite);
  // These should be tangible, so that they block clicks.
  sprite.position.set(...position);
  if (onClick) {
    sprite.userData.onClick = ({ event }) => onClick({ event, anchor: sprite });
  }
  sprite.userData.anchorType = anchorType;
  return sprite;
};

export const addTransformControls = ({
  camera,
  object,
  renderer,
  scene,
  controlsToDisable = [],
}) => {
  const control = new TransformControls(camera, renderer.domElement);
  scene.add(control);
  return control;
};

export const addAnchors = ({
  camera,
  draggableObjects,
  editId,
  editType,
  object,
  onObjectChange,
  position,
  ray,
  renderer,
  scene,
  sourceLocation,
  target,
  threejsMesh,
  trackballControls,
  type,
  viewState,
}) => {
  if (viewState.anchorObject === object) {
    return viewState.anchors;
  }
  if (viewState.transformControls) {
    viewState.transformControls.detach();
  }
  viewState.anchorObject = object;
  for (const key of Object.keys(viewState.anchors)) {
    const anchor = viewState.anchors[key];
    delete viewState.anchors[key];
    anchor.parent.remove(anchor);
  }
  const offset = 0.05;
  const zoom = position.distanceTo(target);
  const atVector = new Vector3(0, 0, 0);
  const toVector = new Vector3(1, 0, 0);
  const upVector = new Vector3(0, 0, 1);
  object.localToWorld(atVector);
  object.localToWorld(toVector);
  object.up.copy(upVector);
  object.userData.anchor = { at: atVector, to: toVector, up: upVector };
  const at = addAnchor({
    anchorType: 'at',
    color: 'yellow',
    editId,
    position: [0, 0, 0],
    object,
    onClick: ({ anchor }) => {
      viewState.transformControls = addTransformControls({
        camera,
        object,
        renderer,
        scene,
      });
      viewState.transformControls.addEventListener('mouseDown', () => {
        trackballControls.enabled = false;
      });
      viewState.transformControls.addEventListener('mouseUp', () => {
        trackballControls.enabled = true;
      });
      if (onObjectChange) {
        viewState.transformControls.addEventListener(
          'objectChange',
          onObjectChange
        );
      }
      viewState.transformControls.setMode('translate');
      viewState.transformControls.attach(anchor.parent);
    },
  });
  const up = addAnchor({
    anchorType: 'up',
    color: 'green',
    draggableObjects,
    editId,
    position: [0, offset * zoom, 0],
    object,
    onClick: ({ anchor }) => {
      viewState.transformControls = addTransformControls({
        camera,
        object,
        renderer,
        scene,
      });
      viewState.transformControls.addEventListener('mouseDown', () => {
        trackballControls.enabled = false;
      });
      viewState.transformControls.addEventListener('mouseUp', () => {
        trackballControls.enabled = true;
      });
      if (onObjectChange) {
        viewState.transformControls.addEventListener(
          'objectChange',
          onObjectChange
        );
      }
      viewState.transformControls.setMode('rotate');
      viewState.transformControls.attach(anchor.parent);
    },
  });
  const to = addAnchor({
    anchorType: 'to',
    color: 'red',
    draggableObjects,
    editId,
    position: [0, 0, offset * zoom],
    object,
  });
  viewState.anchors = { at, to, up };
  return viewState.anchors;
};

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

const round = (value, resolution) =>
  Math.round(value / resolution) * resolution;

export const getWorldPosition = (object, resolution = 0.01) => {
  const vector = new Vector3();
  object.getWorldPosition(vector);
  return [
    round(vector.x, resolution),
    round(vector.y, resolution),
    round(vector.z, resolution),
  ];
};
