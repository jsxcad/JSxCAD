// import { emit, isNode, log, onBoot } from '@jsxcad/sys';
import { emit, log, onBoot } from '@jsxcad/sys';

import CgalBrowser from './cgal_browser.cjs';
/// import CgalNode from './cgal_node.cjs';
import hashSum from 'hash-sum';
import { toPathnameFromUrl } from './toPathnameFromUrl.js';

let cgal;

export const initCgal = async () => {
  if (cgal === undefined) {
    // const Cgal = isNode ? CgalNode : CgalBrowser;
    const Cgal = CgalBrowser;
    cgal = await Cgal({
      destroy(obj) {
        console.log(`QQ/cgal/destroy`);
      },
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
        if (path === 'cgal_node.worker.js') {
          const url = import.meta.url;
          if (url.startsWith('file://')) {
            let pathname = toPathnameFromUrl(import.meta.url);
            const parts = pathname.split('/');
            parts.pop();
            const prefix = parts.join('/');
            const workerPathname = `${prefix}/cgal_node.worker.cjs`;
            return workerPathname;
          }
        } else if (path === 'cgal_node.wasm' || path === 'cgal_browser.wasm') {
          const url = import.meta.url;
          if (url.startsWith('file://')) {
            let pathname = toPathnameFromUrl(import.meta.url);
            const parts = pathname.split('/');
            parts.pop();
            const prefix = parts.join('/');
            const wasmPathname = `${prefix}/${path}`;
            return wasmPathname;
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

export const getCgal = () => {
  if (!cgal) {
    throw Error('CGAL not initialized');
  }
  return cgal;
};

onBoot(initCgal);
