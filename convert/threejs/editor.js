export const editor = ({ CodeMirror, addPage, api, initialScript, nextPage, lastPage }) => {
  let editor;

  const runScript = () => {
    // Evaluate.
    const code = new Function(`{ ${Object.keys(api).join(', ')} }`, editor.getDoc().getValue('\n'));
    const result = code(api);
    // Handle a return value as an implicit write.
    if (result) {
      api.writePaths({ path: 'default' }, result);
    }
    nextPage();
  };

  const setupDocument = () => {
    editor = CodeMirror((domElement) => {
      domElement.id = 'editor';
      addPage('Source').$('div').appendChild(domElement);
    },
                        {
                          autoRefresh: true,
                          mode: 'javascript',
                          theme: 'default',
                          fullScreen: true,
                          lineNumbers: true,
                          gutter: true,
                          lineWrapping: true,
                          extraKeys: {
                            'Shift-Enter': runScript
                          },
                          value: (typeof initialScript === 'undefined') ? '' : initialScript
                        });
    document.addEventListener('keydown',
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
    lastPage();
  };
  document.addEventListener('DOMContentLoaded', setupDocument);
};
