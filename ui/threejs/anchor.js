import { Sprite, SpriteMaterial, Texture, Vector3 } from 'three';

export const addAnchor = ({
  draggableObjects,
  color,
  editId,
  position = [0, 0, 0],
  object,
  anchorType,
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10;
  const c = canvas.getContext('2d');
  // c.strokeStyle = 'rgba(255, 255, 51)';
  // c.fillStyle = 'rgba(0, 0, 0)';
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
  draggableObjects.push(sprite);
  // These should be tangible, so that they block clicks.
  sprite.position.set(...position);
  return sprite;
};

export const addAnchors = ({
  draggableObjects,
  editId,
  editType,
  object,
  position,
  ray,
  scene,
  sourceLocation,
  type,
  target,
  threejsMesh,
}) => {
  const offset = 0.05;
  const zoom = position.distanceTo(target);
  const at = new Vector3(0, 0, 0);
  const to = new Vector3(1, 0, 0);
  const up = new Vector3(0, 0, 1);
  object.localToWorld(at);
  object.localToWorld(to);
  object.up.copy(up);
  object.userData.anchor = { at, to, up };
  addAnchor({
    anchorType: 'at',
    color: 'yellow',
    draggableObjects,
    editId,
    position: [0, 0, 0],
    object,
  });
  addAnchor({
    anchorType: 'up',
    color: 'green',
    draggableObjects,
    editId,
    position: [0, offset * zoom, 0],
    object,
  });
  addAnchor({
    anchorType: 'to',
    color: 'red',
    draggableObjects,
    editId,
    position: [0, 0, offset * zoom],
    object,
  });
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
