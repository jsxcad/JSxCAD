import { emit, isNode, log, onBoot } from '@jsxcad/sys';
import { fileURLToPath } from 'url';

import CgalBrowser from './cgal_browser.cjs';
import CgalNode from './cgal_node.cjs';
import hashSum from 'hash-sum';

let cgal;

export const initCgal = async () => {
  if (cgal === undefined) {
    const Cgal = isNode ? CgalNode : CgalBrowser;
    cgal = await Cgal({
      print(...texts) {
        const text = texts.join(' ');
        const level = 'serious';
        const logEntry = { text, level };
        const hash = hashSum(log);
        emit({ log: logEntry, hash });
        log({ op: 'text', text, level });
        console.log(texts);
      },
      printErr(...texts) {
        const text = texts.join(' ');
        const level = 'serious';
        const logEntry = { text, level };
        const hash = hashSum(log);
        emit({ log: logEntry, hash });
        log({ op: 'text', text, level });
        console.log(texts);
      },
      locateFile(path) {
        if (path === 'cgal_node.wasm' || path === 'cgal_browser.wasm') {
          let url = import.meta.url;
          if (url.startsWith('file://')) {
            url = fileURLToPath(url);
            url = url.substring(0, url.length - 10) + 'cgal_node.wasm';
            return url;
          } else {
            const parts = url.split('/');
            parts.pop();
            parts.push('cgal_browser.wasm');
            return parts.join('/');
          }
        }
        return path;
      },
    });
  }
};

export const getCgal = () => cgal;

onBoot(initCgal);
