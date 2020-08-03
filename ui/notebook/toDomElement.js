// global document

import { Shape } from '@jsxcad/api-v1-shape';
import { dataUrl } from '@jsxcad/ui-threejs';
import marked from 'marked';

export const toDomElement = async (notebook) => {
  const container = document.createElement('div');
  for (const note of notebook) {
    if (note.view) {
      const { geometry, width, height, target, up, position } = note.view;
      const url = await dataUrl(Shape.fromGeometry(geometry), {
        width,
        height,
        target,
        up,
        position,
      });
      const div = document.createElement('div');
      const image = document.createElement('img');
      image.classList.add('note');
      image.src = url;
      div.appendChild(image);
      container.appendChild(div);
    }
    if (note.md) {
      // Use ''' and '' instead of ``` and `` to avoid escaping.
      // FIX: Do this in a more principled fashion.
      const data = note.md.replace(/'''/g, '```').replace(/''/g, '``');
      const markup = document.createElement('div');
      markup.classList.add('note');
      markup.innerHTML = marked(data);
      container.appendChild(markup);
    }
  }
  return container;
};
