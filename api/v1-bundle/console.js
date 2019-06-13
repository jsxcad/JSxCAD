export const installConsoleCSS = () => {};

export const installConsole = ({ addPage, document, watchFile }) => {
  addPage({ title: 'Console', content: '<div id="console"></div>', position: 'bottom-left', size: '600 200' });
  const viewerElement = document.getElementById('console');
  viewerElement.id = `viewer:console`;
  viewerElement.classList.add('Console');
  const decoder = new TextDecoder('utf8');
  watchFile('console/out',
            (options, file) => {
              viewerElement.appendChild(document.createTextNode(decoder.decode(file.data)));
              viewerElement.appendChild(document.createElement('br'));
              viewerElement.parentNode.scrollTop = viewerElement.parentNode.scrollHeight;
            });
  return {};
};
