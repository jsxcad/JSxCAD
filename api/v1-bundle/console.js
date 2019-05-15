export const installConsoleCSS = () => {};

export const installConsole = ({ addPage, document, watchFile }) => {
  addPage({ title: 'Console', content: '<div id="console"></div>', position: 'bottom-left', size: '600 200' });
  const viewerElement = document.getElementById('console');
  viewerElement.id = `viewer:console`;
  viewerElement.classList.add('Console');
  watchFile('console/out',
            (options, file) => {
              viewerElement.appendChild(document.createTextNode(file.data));
              viewerElement.appendChild(document.createElement('br'));
              viewerElement.scrollTop = viewerElement.scrollHeight;
            });
  return {};
};
