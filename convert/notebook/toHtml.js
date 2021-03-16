import Base64ArrayBuffer from 'base64-arraybuffer';

const encodeNotebook = async (notebook) => {
  const encoded = [];
  for (const note of notebook) {
    if (note.download) {
      const encodedEntries = [];
      for (const entry of note.download.entries) {
        const data = await entry.data;
        const encodedEntry = {
          ...entry,
          base64Data: Base64ArrayBuffer.encode(data.buffer),
        };
        delete encodedEntry.data;
        encodedEntries.push(encodedEntry);
      }
      encoded.push({ download: { entries: encodedEntries } });
    } else {
      encoded.push(note);
    }
  }
  return encoded;
};

export const toHtml = async (
  notebook,
  {
    view,
    title = 'JSxCAD Viewer',
    modulePath = 'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/es6',
  } = {}
) => {
  const html = `
<html>
 <head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <style>
    div.book {
      height: 100%;
      overflow: scroll;
      margin-left: 20px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
    }

    div.note.card {
      border: 1px dashed crimson;
      margin: 4px 4px;
      padding: 4px 4px;
      display: inline-block;
      width: fit-content;
      height: fit-content;
    }

    .note.log {
      font-family: "Arial Black", Gadget, sans-serif;
      color: red
    }

    .note.view {
      border: 1px dashed dodgerblue;
      margin: 4px 4px;
      padding: 4px 4px;
    }

    .note.orbitView {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
    }

    button.note.download {
      border: 2px solid black;
      border-radius: 5px;
      background-color: white;
      margin: 4px 4px;
      padding: 10px 24px;
      font-size: 16px;
      cursor: pointer;
      border-color: #2196F3;
      color: dodgerblue
    }

    button.note.download:hover {
      background: #2196F3;
      color: white;
    }

    .note th,td {
      border: 1px solid dodgerblue;
      padding: 5px;
    }
  </style>
 </head>
 <body>
  <script type='module'>
    import { toDomElement } from '${modulePath}/jsxcad-ui-notebook.js';

    const notebook = ${JSON.stringify(await encodeNotebook(notebook))};

    const run = async () => {
      const body = document.getElementsByTagName('body')[0];
      const bookElement = document.createElement('div');

      // Organize by card.
      const cards = [];
      const cardNotes = new Map();

      for (const note of notebook) {
        let card = '';
        if (note.context && note.context.card) {
          card = note.context.card;
        }
        if (!cardNotes.has(card)) {
          cards.push(card);
          cardNotes.set(card, []);
        }
        cardNotes.get(card).push(note);
      }

      for (const cardId of cards) {
        const cardElement = document.createElement('div');
        cardElement.className = 'note card';
        const notebookElement = await toDomElement(cardNotes.get(cardId));
        cardElement.appendChild(notebookElement);
        bookElement.appendChild(cardElement);
      }

      bookElement.classList.add('book', 'notebook', 'loaded');
      body.appendChild(bookElement);
    };

    if (document.readyState === 'complete') {
      run();
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          run();
        }
      };
    }
  </script>
 </body>
</html>
`;
  return new TextEncoder('utf8').encode(html);
};
