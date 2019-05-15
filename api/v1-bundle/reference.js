import { installCSS } from './css';

export const installReferenceCSS = () =>
  installCSS(document, `.Reference { height: 100%; width: 100%; }`);

export const installReference = ({ addPage, document, watchFile }) => {
  addPage({ title: 'Reference', content: '<div id="reference"></div>', position: 'bottom-right', size: '600 200', contentOverflow: 'hidden' });
  const viewerElement = document.getElementById('reference');
  viewerElement.id = `viewer:reference`;
  const frame = document.createElement('iframe');
  frame.src = `https://en.wikibooks.org/wiki/JSxCAD_User_Guide`;
  // frame.src = `https://jsxcad.js.org/reference/user_guide.html?a=a`;
  frame.classList.add('Reference');
  viewerElement.appendChild(frame);
  return {};
};
