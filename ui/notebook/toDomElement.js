// global document

import { dataUrl, orbitDisplay } from '@jsxcad/ui-threejs';

import { Shape } from '@jsxcad/api-v1-shape';
import marked from 'marked';

export const toDomElement = async (notebook) => {
  const container = document.createElement('div');

  const showOrbitView = async (event, note) => {
    const { geometry, target, up, position } = note.view;
    const view = { target, up, position };
    const { canvas } = await orbitDisplay({ view, geometry }, container);
    canvas.addEventListener('click', (event) => container.removeChild(canvas));
  };

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
      image.classList.add('note', 'view');
      image.src = url;
      image.addEventListener('click', (event) => showOrbitView(note));
      div.appendChild(image);
      container.appendChild(div);
    }
    if (note.md) {
      // Use ''' and '' instead of ``` and `` to avoid escaping.
      // FIX: Do this in a more principled fashion.
      const data = note.md.replace(/'''/g, '```').replace(/''/g, '``');
      const markup = document.createElement('div');
      markup.classList.add('note', 'markdown');
      markup.innerHTML = marked(data);
      container.appendChild(markup);
    }
    if (note.log) {
      const text = document.createTextNode(note.log.text);
      const entry = document.createElement('div');
      entry.appendChild(text);
      entry.classList.add('note', 'log');
      container.appendChild(entry);
    }
  }
  return container;
};
