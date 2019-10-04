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
  /*
  await installConsoleCSS(document);
  await installEditorCSS(document);
  await installDisplayCSS(document);
  await installEvaluatorCSS(document);
  await installReferenceCSS(document);
  */
};

window.bootstrap = async () => {
  /*
  let { initialScript } = await installProject();
  if (initialScript === undefined) {
    initialScript = await readFile({}, 'script');
  }
  if (initialScript === undefined) {
    initialScript = defaultScript;
  }
  const { addPage, nextPage, lastPage } = await installDisplay({ document, readFile, watchFile, watchFileCreation, window });
  const { evaluator } = await installEvaluator({});
  await installEditor({ addPage, document, evaluator, initialScript, nextPage, lastPage });
  */
  await installFilesystemview({ document });
  /*
  await installConsole({ addPage, document, watchFile });
  await installReference({ addPage, document });
  for (const filesystem of await listFilesystems()) {
    console.log(`QQ/filesystem: ${filesystem}`);
  }
  for (const file of await listFiles()) {
    console.log(`QQ/file: ${file}`);
  }
  */
};

window.bootstrapCSS().then(_ => _).catch(_ => _);

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
