import { api, readFileSync, solidToThreejsDatasets, watchFile, watchFileCreation, writeFileSync } from './JSxCAD.js';

let editor;
let pages = [];

const runScript = () => {
  // Evaluate.
  const code = new Function('$',
                            `const { ${Object.keys(api).join(', ')} } = $;\n\n` + 
                            editor.getDoc().getValue('\n'));
  const result = code(api);
  // Handle a return value as an implicit write.
  if (result) {
    api.writePaths({ path: 'default' }, result);
  }
  nextPage();
}

const addPage = (element) => {
  element.style.display = 'none';
  document.getElementById("body").appendChild(element);
  pages.push(element);
}

const nextPage = () => {
  pages[0].style.display = 'none';
  pages.push(pages.shift());
  pages[0].style.display = 'block';
}

const lastPage = () => {
  pages[0].style.display = 'none';
  pages.unshift(pages.pop());
  pages[0].style.display = 'block';
}

let setupDocumentDone = false;
const setupDocument = () => {
  if (setupDocumentDone) throw Error('die');
  setupDocumentDone = true;
  editor = CodeMirror((domElement) => {
                        domElement.id = 'editor';
                        addPage(domElement);
                      },
                      {
                        autoRefresh: true,
                        mode: "javascript",
                        theme: "default",
                        fullScreen: true,
                        lineNumbers: true,
                        gutter: true,
                        lineWrapping: true,
                        extraKeys: {
                          'Shift-Enter': runScript,
                        },
                        value:
`
// HOWTO
//
// Shift-Enter to render.
// PageUp and PageDown to cycle windows.

let x = union(sphere().as('a').material('metal'),
        cube({ size: 1, center: true }).translate([0.5, 0.5, 0.5]).as('b'),
        cube({ size: 1, center: true }).translate([0.5, 0, 0]).as('c').material('metal'))

writeStl({ path: 'assembly' },
   x.toSolid({ tags: ['a'] }),
   x.toSolid({ tags: ['b'] }),
   x.toSolid({ tags: ['c'] }))
    
writeStl({ path: 'sphere' },
   x.toSolid({ tags: ['a'] }));
`
                      });
  document.addEventListener("keydown",
                            e => {
                              switch (e.keyCode) {
                                case 34:
                                  // Page Down.
                                  nextPage();
                                  e.preventDefault();
                                  e.stopPropagation();
                                  break;
                                case 33: 
                                  // Page Up.
                                  lastPage();
                                  e.preventDefault();
                                  e.stopPropagation();
                                  break;
                              }
                            });
  nextPage();
};
document.addEventListener("DOMContentLoaded", setupDocument);

