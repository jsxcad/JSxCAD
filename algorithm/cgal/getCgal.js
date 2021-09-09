import { emit, isNode, log, onBoot } from '@jsxcad/sys';

import CgalBrowser from './cgal_browser.cjs';
import CgalNode from './cgal_node.cjs';
import hashSum from 'hash-sum';
import { toPathnameFromUrl } from './toPathnameFromUrl.js';

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
          let pathname = toPathnameFromUrl(import.meta.url);
          const parts = pathname.split('/');
          parts.pop();
          const prefix = parts.join('/');
          const wasmPathname = `${prefix}/${path}`;
          return wasmPathname;
        }
        return path;
      },
    });
  }
};

export const getCgal = () => cgal;

onBoot(initCgal);
