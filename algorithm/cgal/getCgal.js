import Cgal from './cgal.cjs';
import { onBoot } from '@jsxcad/sys';

let cgal;

export const initCgal = async () => {
  if (cgal === undefined) {
    cgal = await Cgal({
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
