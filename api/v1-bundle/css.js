export const installCSS = (document, text) => {
  const style = document.createElement('style');
  style.textContent = text;
  document.head.appendChild(style);
};

export const installCSSLink = async (document, href) =>
  new Promise((resolve, reject) => {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = 'screen';
    link.href = href;
    link.onload = resolve;
    document.head.appendChild(link);
  });
