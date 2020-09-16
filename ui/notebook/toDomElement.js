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

marked.use({
  renderer: {
    code(code, language) {
      if (code.match(/^sequenceDiagram/) || code.match(/^graph/)) {
        return '<div class="mermaid">' + code + '</div>';
      } else {
        return '<pre><code>' + code + '</code></pre>';
      }
    },
  },
});

export const toDomElement = async (notebook = []) => {
  const container = document.createElement('div');
  container.classList.add('notebook');

  const showOrbitView = async (event, note) => {
    const { geometry, target, up, position } = note.view;
    const view = { target, up, position };
    const div = document.createElement('div');
    div.classList.add('note', 'orbitView');
    const body = window.document.body;
    body.insertBefore(div, body.firstChild);
    await orbitDisplay({ view, geometry }, div);
    const onKeyDown = (event) => {
      if (
        event.key === 'Escape' ||
        event.key === 'Esc' ||
        event.keyCode === 27
      ) {
        body.removeEventListener('keydown', onKeyDown, true);
        body.removeChild(div);
      }
    };
    body.addEventListener('keydown', onKeyDown, true);
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
    if (note.control) {
      const div = document.createElement('div');
      const { type, label, value } = note.control;
      switch (type) {
        case 'stringBox': {
          const input = document.createElement('input');
          input.classList.add('note', 'control', 'input', 'box');
          input.name = label;
          input.value = value;
          div.appendChild(input);
          break;
        }
        case 'checkBox': {
          const input = document.createElement('input');
          input.classList.add('note', 'control', 'input', 'checkbox');
          input.name = label;
          input.type = 'checkbox';
          input.checked = value;
          div.appendChild(input);
          break;
        }
        case 'selectBox': {
          const { options = [] } = note.control;
          const input = document.createElement('select');
          input.classList.add('note', 'control', 'input', 'checkbox');
          input.name = label;
          input.value = value;
          for (const optionValue of options) {
            const option = document.createElement('option');
            option.value = optionValue;
            if (optionValue === value) {
              option.selected = true;
            }
            option.innerText = optionValue;
            input.appendChild(option);
          }
          div.appendChild(input);
          break;
        }
        case 'sliderBox': {
          const { min = 0, max = 100, step = 1 } = note.control;
          const output = document.createElement('span');
          output.innerText = value;
          div.appendChild(output);
          const input = document.createElement('input');
          input.classList.add('note', 'control', 'input', 'slider');
          input.name = label;
          input.type = 'range';
          input.min = min;
          input.max = max;
          input.step = step;
          input.value = value;
          div.appendChild(input);
          input.addEventListener('change', () => {
            output.innerText = input.value;
          });
          input.addEventListener('input', () => {
            output.innerText = input.value;
          });
          break;
        }
      }
      const labelNode = document.createElement('label');
      labelNode.htmlFor = label;
      labelNode.appendChild(document.createTextNode(label));
      div.appendChild(labelNode);
      container.appendChild(div);
    }
  }
  return container;
};

export const getNotebookControlData = async () => {
  const data = {};
  const notebooks = document.getElementsByClassName('notebook');
  for (let nthNotebook = 0; nthNotebook < notebooks.length; nthNotebook++) {
    const notebook = notebooks[nthNotebook];
    const inputs = notebook.getElementsByClassName('note control input');
    for (let nthInput = 0; nthInput < inputs.length; nthInput++) {
      const input = inputs[nthInput];
      const label = input.name;
      if (input.type === 'checkbox') {
        data[label] = input.checked;
      } else {
        data[label] = input.value;
      }
    }
  }
  return data;
};
