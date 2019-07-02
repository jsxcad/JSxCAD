export const installReferenceCSS = () => {};

const content = `
<h1>Pre-Alpha Version</h1>
<p>This is a pre-alpha release.</p>
<p>Please understand that things will probably be broken.</p>
<p>See the <a href="https://jsxcad.js.org/preAlpha/UserGuide.html" target="_blank">User Guide</a> for examples and more information.</p>
`;

export const installReference = ({ addPage, document, watchFile }) => {
  addPage({ title: 'Reference', content, position: 'bottom-right', size: '600 200', contentOverflow: 'hidden' });
  return {};
};
