export const installCSS = (document, text) => {
  const style = document.createElement('style');
  style.textContent = text;
  document.head.appendChild(style);
};

export const installCSSLink = (document, href) => {
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.media = 'screen';
  style.href = href;
  document.head.appendChild(style);
};
