// global document

import { Shape } from '@jsxcad/api-v1-shape';
import { dataUrl } from '@jsxcad/ui-threejs';
import marked from 'marked';

export const toDomElement = async (notebook) => {
  const container = document.createElement('div');
  for (const note of notebook) {
    if (note.geometry) {
      const { geometry, width, height, target, up, position } = note.geometry;
      const url = await dataUrl(Shape.fromGeometry(geometry), {
        width,
        height,
        target,
        up,
        position,
      });
      const image = document.createElement('img');
      image.src = url;
      container.appendChild(image);
    }
    if (note.md) {
      // Use ''' and '' instead of ``` and `` to avoid escaping.
      // FIX: Do this in a more principled fashion.
      const data = note.md.replace(/'''/g, '```').replace(/''/g, '``');
      const markup = document.createElement('div');
      markup.innerHTML = marked(data);
      container.appendChild(markup);
    }
  }
  return container;
};
