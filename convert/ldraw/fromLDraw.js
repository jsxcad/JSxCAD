import { flip, isStrictlyCoplanar } from '@jsxcad/math-poly3';
import { fromPolygons, rotateX, scale } from '@jsxcad/geometry-solid';

import { fromValues as fromValuesToMatrix } from '@jsxcad/math-mat4';
import { readFile } from '@jsxcad/sys';
import { transform } from '@jsxcad/geometry-polygons';

const RESOLUTION = 10000;

const readPart = async (part) => {
  part = part.toLowerCase().replace(/\\/, '/');
  return readFile({ sources: [{ url: `http://www.ldraw.org/library/official/parts/${part}` },
                              { url: `http://www.ldraw.org/library/official/p/48/${part}` },
                              { url: `http://www.ldraw.org/library/official/p/${part}` }] },
                  `tmp/ldraw-part-${part}`);
};

const loadPart = async (part) => {
  let code = [];
  let source = await readPart(part);
  for (let line of source.split('\r\n')) {
    let args = line.replace(/^\s+/, '').split(/\s+/);
    code.push(args);
  }
  return { type: source.type, code: code, name: source.name };
};

const flt = (text) => parseFloat(text);
const ldu = (text) => Math.round(flt(text) * RESOLUTION) / RESOLUTION;

const fromPartToPolygons = async ({ part, invert = false, stack = [] }) => {
  let code = await loadPart(part);
  let polygons = [];
  let direction = 'CCW';
  let invertNext = 0;

  function Direction () {
    if (invert) {
      return { CCW: 'CW', CW: 'CCW' }[direction];
    } else {
      return direction;
    }
  }

  for (let args of code.code) {
    switch (parseInt(args[0])) {
      case 0: { // meta
        switch (args[1]) {
          case 'BFC':
            switch (args[2]) {
              case 'CERTIFY': {
                switch (args[3]) {
                  case 'CW': {
                    direction = 'CW';
                    break;
                  }
                  case 'CCW': {
                    direction = 'CCW';
                    break;
                  }
                }
                break;
              }
              case 'INVERTNEXT': {
                invertNext = 2;
                break;
              }
            }
            break;
        }
        break;
      }
      case 1: { // sub-part
        let [, , x, y, z, a, b, c, d, e, f, g, h, i, subPart] = args;
        let subInvert = invert;
        if (invertNext > 0) {
          subInvert = !subInvert;
        }
        stack.push(subPart);
        let matrix = fromValuesToMatrix(flt(a), flt(d), flt(g), 0.0,
                                        flt(b), flt(e), flt(h), 0.0,
                                        flt(c), flt(f), flt(i), 0.0,
                                        ldu(x), ldu(y), ldu(z), 1.0);
        polygons.push(...transform(matrix, await fromPartToPolygons({ part: subPart, invert: subInvert, stack })));
        stack.pop();
        break;
      }
      case 2: { // display line
        break;
      }
      case 3: { // triangle
        let [, , x1, y1, z1, x2, y2, z2, x3, y3, z3] = args;
        let polygon = [[ldu(x1), ldu(y1), ldu(z1)],
                       [ldu(x2), ldu(y2), ldu(z2)],
                       [ldu(x3), ldu(y3), ldu(z3)]];
        if (!isStrictlyCoplanar(polygon)) throw Error('die');
        if (Direction() === 'CW') {
          polygons.push(flip(polygon));
        } else {
          polygons.push(polygon);
        }
        break;
      }
      case 4: { // quad
        let [, , x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4] = args;
        let p = [[ldu(x1), ldu(y1), ldu(z1)],
                 [ldu(x2), ldu(y2), ldu(z2)],
                 [ldu(x3), ldu(y3), ldu(z3)],
                 [ldu(x4), ldu(y4), ldu(z4)]];
        if (Direction() === 'CW') {
          if (isStrictlyCoplanar(p)) {
            polygons.push(flip(p));
          } else {
            polygons.push(flip([p[0], p[1], p[3]]));
            polygons.push(flip([p[2], p[3], p[1]]));
          }
        } else {
          if (isStrictlyCoplanar(p)) {
            polygons.push(p);
          } else {
            polygons.push([p[0], p[1], p[3]]);
            polygons.push([p[2], p[3], p[1]]);
          }
        }
        break;
      }
      case 5: { // optional line
        break;
      }
    }
    if (invertNext > 0) {
      invertNext -= 1;
    }
  }
  return polygons;
};

export const fromLDraw = async ({ part }) =>
  ({
    solid: rotateX(-90 * Math.PI / 180,
                   scale([0.4, 0.4, 0.4],
                         fromPolygons({}, await fromPartToPolygons({ part }))))
  });
