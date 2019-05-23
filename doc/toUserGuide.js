import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import fs from 'fs';
import jsdocExtractor from 'jsdoc-extractor';
import { toEcmascript } from '@jsxcad/compiler';
import { toSvg } from '@jsxcad/convert-threejs';

const { readFile } = fs.promises;

// The illustration operator.
// This is a kind of immediate, single-expression version of the language.
// FIX: Figure out the language generally.
const toOperator = ({ api }, script) => {
  let ecmascript;
  try {
    ecmascript = toEcmascript({}, script);
    const code = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
    return code(api).main;
  } catch (error) {
    console.log(`toOperator/script: ${script}`);
    console.log(`toOperator/ecmascript: ${ecmascript}`);
    console.log(error.toString());
    throw error;
  }
};

const toMarkdown = (comment) => {
  const lines = comment.split('\n');
  if (lines.length <= 4) {
    return;
  }
  if (lines[0] !== '/**' || lines[lines.length - 1] !== ' **/') {
    return;
  }
  for (let nth = 1; nth < lines.length - 1; nth++) {
    const line = lines[nth];
    if (line !== ' *' && !line.startsWith(' * ')) {
      return;
    }
  }
  // Detected markdown comment.
  const markdown = [];
  for (let nth = 1; nth < lines.length - 1; nth++) {
    // Remove the leading ' * '
    markdown.push(lines[nth].substring(3));
  }
  return markdown.join('\n');
};

export const toUserGuide = async ({ api, paths, root }) => {
  const markdowns = [];
  for (const path of paths) {
    for (const [buffer] of jsdocExtractor(await readFile(path))) {
      const entry = buffer.toString('utf8');
      const extraction = toMarkdown(entry);
      if (extraction !== undefined) {
        markdowns.push(extraction);
      }
    }
  }
  const markdown = markdowns.join('\n');
  const md = new MarkdownIt();
  const patches = [];
  const render = (tokens, idx) => {
    switch (tokens[idx].type) {
      case 'container_illustration_close':
        return `</td></tr></table>`;
      case 'container_illustration_open': {
        const start = idx;
        let end = idx;
        while (end < tokens.length && tokens[end].type !== 'container_illustration_close') {
          end += 1;
        }
        const defaults = { view: { position: [0, 0, 60] }, pageSize: [128, 128], grid: true };
        let options = {};
        const prefix = ' illustration ';
        if (tokens[start].info.startsWith(prefix)) {
          const json = tokens[start].info.substring(prefix.length);
          const provided = JSON.parse(json);
          options = { ...defaults, ...provided };
        } else {
          options = defaults;
        }
        const chunks = [];
        for (let idx = start; idx < end; idx++) {
          const token = tokens[idx];
          if (token.content !== null && token.content !== '') {
            chunks.push(token.content);
          } else if (token.children !== null) {
            for (const child of token.children) {
              if (child.type === 'text') {
                chunks.push(child.content);
              }
            }
          }
        }
        const text = chunks.join('\n');
        // Place the geometry very slightly above the grid.
        const patch = `<<<${patches.length}>>>`;
        patches.push({ patch, options, text });
        return `<table><tr><td>${patch}</td><td>`;
      }
    }
  };
  md.use(MarkdownItContainer, 'illustration', { render });
  let markdownHtml = md.render(markdown);
  for (const { patch, options, text } of patches) {
    const geometry = await toOperator({ api }, text)();
    const svg = await toSvg(options, geometry.above().translate([0, 0, 0.001]).toDisjointGeometry());
    markdownHtml = markdownHtml.replace(patch, svg);
  }
  const html = `
<html>
 <head>
  <link href="https://fonts.googleapis.com/css?family=Lato&display=swap" rel="stylesheet">
  <style>
   * {font-family: 'Lato', sans-serif; }
   code {font-family: 'monospace', sans-serif; text-align: left }
   svg { text-align: center; }
   table { border-collapse:separate; border:solid black 1px; border-radius:6px; -moz-border-radius:6px; display: inline-block; margin: 10px; }
   tr { vertical-align: top; }
   td { padding: 10px; }
  </style>
 </head>
 <body>
  ${markdownHtml}
 </body>
</html>
`;
  return html;
};
