/* global location */

import { installCSS, installCSSLink } from './css';

import { installFilesystemview } from './filesystemview';

/*
const installProject = async () => {
  const hash = location.hash.substring(1);
  const [project, source] = hash.split('@');
  // Use the project identifier to select the filesystem.
  setupFilesystem({ fileBase: project });
  if (source !== undefined) {
    // GIST
    if (source.startsWith('https://api.github.com/gists/')) {
      // We expect a url like:
      // https://api.github.com/gists/3c39d513e91278681eed2eea27b0e589
      // FIX: Initialize the whole filesystem.
      const response = await window.fetch(source);
      if (response.ok) {
        const text = await response.text();
        const data = JSON.parse(text);
        if (data.files && data.files.script && data.files.script.content) {
          return { initialScript: data.files.script.content };
        }
      }
    }
    // GITHUB WIKI
    if (source.startsWith('https://raw.githubusercontent.com/wiki/')) {
      const response = await window.fetch(source);
      if (response.ok) {
        const text = await response.text();
        let capture = false;
        const captured = [];
        for (const line of text.split('\n')) {
          if (line === '```') {
            capture = !capture;
          } else if (capture) {
            captured.push(line);
          }
        }
        return { initialScript: captured.join('\n') };
      }
    }
    // PASTEBIN
    if (source.startsWith('https://pastebin.com/raw/')) {
      const response = await window.fetch(source);
      if (response.ok()) {
        const text = await response.text();
        return { initialScript: text };
      }
    }
  }
  return {};
};
*/

window.bootstrapCSS = async () => {
  // Editor
  await installCSSLink(document, 'https://codemirror.net/lib/codemirror.css');
  await installCSS(document, `.CodeMirror { border-top: 1px solid black; border-bottom: 1px solid black; font-family: "Corier Neu", monospace; font-size: 20px; height: 100% }`);

  // Display
  await installCSSLink(document, 'https://jspanel.de/dist/jspanel.min.css');
  await installCSSLink(document, 'https://fonts.googleapis.com/icon?family=Material+Icons');
  await installCSS(document, `
               .dg { position: absolute; top: 2px; left: 2px; background: #ffffff; color: #000000 }
               .dg.main.taller-than-window .close-button { border-top: 1px solid #ddd; }
               .dg.main .close-button { background-color: #ccc; } 
               .dg.main .close-button:hover { background-color: #ddd; }
               .dg { color: #555; text-shadow: none !important; } 
               .dg.main::-webkit-scrollbar { background: #fafafa; } 
               .dg.main::-webkit-scrollbar-thumb { background: #bbb; } 
               .dg li:not(.folder) { background: #fafafa; border-bottom: 1px solid #ddd; } 
               .dg li.save-row .button { text-shadow: none !important; } 
               .dg li.title { background: #e8e8e8 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat; }
               .dg .cr.function:hover,.dg .cr.boolean:hover { background: #fff; } 
               .dg .c input[type=text] { background: #e9e9e9; } 
               .dg .c input[type=text]:hover { background: #eee; } 
               .dg .c input[type=text]:focus { background: #eee; color: #555; } 
               .dg .c .slider { background: #e9e9e9; } 
               .dg .c .slider:hover { background: #eee; }
             `);
};

window.bootstrap = async () => {
  const hash = location.hash.substring(1);
  const [project, source] = hash.split('@');
  await installFilesystemview({ document, project, source });
};

window.bootstrapCSS().then(_ => _).catch(_ => _);

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
