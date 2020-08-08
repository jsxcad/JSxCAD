/* global Blob */

import { dataUrl, orbitDisplay } from '@jsxcad/ui-threejs';

import Base64ArrayBuffer from 'base64-arraybuffer';
import { Shape } from '@jsxcad/api-v1-shape';
import marked from 'marked';
import saveAs from 'file-saver';

const downloadFile = async (event, filename, data, type) => {
  const blob = new Blob([data], { type });
  saveAs(blob, filename);
};

export const toDomElement = async (notebook = []) => {
  const container = document.createElement('div');

  const showOrbitView = async (event, note) => {
    const { geometry, target, up, position } = note.view;
    const view = { target, up, position };
    const div = document.createElement('div');
    div.classList.add('note', 'orbitView');
    window.document.body.insertBefore(div, window.document.body.firstChild);
    const { canvas } = await orbitDisplay({ view, geometry }, div);
    canvas.addEventListener(
      'keydown',
      (event) => {
        if (
          event.key === 'Escape' ||
          event.key === 'Esc' ||
          event.keyCode === 27
        ) {
          event.preventDefault();
          window.document.body.removeChild(div);
          return false;
        }
      },
      true
    );
  };

  for (const note of notebook) {
    if (note.view) {
      const div = document.createElement('div');
      const { geometry, width, height, target, up, position } = note.view;
      const url = await dataUrl(Shape.fromGeometry(geometry), {
        width,
        height,
        target,
        up,
        position,
      });
      const image = document.createElement('img');
      image.classList.add('note', 'view');
      image.src = url;
      image.addEventListener('click', (event) => showOrbitView(event, note));
      div.appendChild(image);
      container.appendChild(div);
    }
    if (note.md) {
      const markup = document.createElement('div');
      // Use ''' and '' instead of ``` and `` to avoid escaping.
      // FIX: Do this in a more principled fashion.
      const data = note.md.replace(/'''/g, '```').replace(/''/g, '``');
      markup.classList.add('note', 'markdown');
      markup.innerHTML = marked(data);
      container.appendChild(markup);
    }
    if (note.log) {
      const entry = document.createElement('div');
      const text = document.createTextNode(note.log.text);
      entry.appendChild(text);
      entry.classList.add('note', 'log');
      container.appendChild(entry);
    }
    if (note.download) {
      const div = document.createElement('div');
      for (let { base64Data, data, filename, type } of note.download.entries) {
        if (base64Data) {
          data = Base64ArrayBuffer.decode(base64Data);
        }
        const button = document.createElement('button');
        button.classList.add('note', 'download');
        const text = document.createTextNode(filename);
        button.appendChild(text);
        button.addEventListener('click', (event) =>
          downloadFile(event, filename, data, type)
        );
        div.appendChild(button);
      }
      container.appendChild(div);
    }
  }
  return container;
};
