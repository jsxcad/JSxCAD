export const console = ({ addPage, watchFile }) => {
  const page = addPage('Console');
  const viewerElement = page.$('div');
  // viewerElement = document.createElement('div');
  viewerElement.id = `viewer:console`;
  viewerElement.style.height = '100%';
  viewerElement.classList.add('Console');
  viewerElement.style.overflow = 'scroll';
  watchFile('console/out',
            (options, file) => {
              viewerElement.appendChild(document.createTextNode(file.data));
              viewerElement.appendChild(document.createElement('br'));
              viewerElement.scrollTop = viewerElement.scrollHeight;
            });
};
