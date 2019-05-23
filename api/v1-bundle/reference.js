import { installCSS } from './css';

export const installReferenceCSS = () =>
  installCSS(document, `iframe { left: 0; top: 0; position: absolute; height: 100%; width: 100%; }`);

export const installReference = ({ addPage, document, watchFile }) => {
  addPage({ title: 'Reference', content: '<div id="reference"></div>', position: 'bottom-right', size: '600 200', contentOverflow: 'hidden' });
  const viewerElement = document.getElementById('reference');
  viewerElement.id = `viewer:reference`;
  const frame = document.createElement('iframe');
  frame.src = `https://jsxcad.js.org/app/UserGuide.html`;
  viewerElement.appendChild(frame);
  return {};
};
