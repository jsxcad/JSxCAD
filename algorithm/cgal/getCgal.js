import { emit, log, onBoot } from '@jsxcad/sys';

import Cgal from './cgal.cjs';
import hashSum from 'hash-sum';

let cgal;

export const initCgal = async () => {
  if (cgal === undefined) {
    cgal = await Cgal({
      print(...texts) {
        const text = texts.join(' ');
        const level = 'serious';
        const logEntry = { text, level };
        const hash = hashSum(log);
        emit({ log: logEntry, hash });
        log({ op: 'text', text, level });
      },
      printErr(...texts) {
        const text = texts.join(' ');
        const level = 'serious';
        const logEntry = { text, level };
        const hash = hashSum(log);
        emit({ log: logEntry, hash });
        log({ op: 'text', text, level });
      },
      locateFile(path) {
        if (path === 'cgal.wasm') {
          let url = import.meta.url;
          if (url.startsWith('file://')) {
            url = url.substring(7);
          }
          const parts = url.split('/');
          parts.pop();
          parts.push('cgal.wasm');
          return parts.join('/');
        }
        return path;
      },
    });
  }
};

export const getCgal = () => cgal;

onBoot(initCgal);
