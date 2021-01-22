import {
  fill as fillGeometry,
  taggedGroup,
  transform as transformGeometry,
} from '@jsxcad/geometry-tagged';

import {
  fromScaling,
  fromTranslation,
  fromZRotation,
  identity,
  multiply,
} from '@jsxcad/math-mat4';

import SvgPoints from 'svg-points/cjs/index.js';
import XmlDom from 'xmldom';
import { fromSvgPath as baseFromSvgPath } from './fromSvgPath.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';

// Normally svgPathToPaths normalized the coordinate system, but this would interfere with our own normalization.
const fromSvgPath = (svgPath, options = {}) =>
  baseFromSvgPath(
    new TextEncoder('utf8').encode(svgPath),
    Object.assign({ normalizeCoordinateSystem: false }, options)
  );

const ELEMENT_NODE = 1;
const ATTRIBUTE_NODE = 2;
const TEXT_NODE = 3;
const CDATA_SECTION_NODE = 4;
const ENTITY_REFERENCE_NODE = 5;
const ENTITY_NODE = 6;
const PROCESSING_INSTRUCTION_NODE = 7;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;
const DOCUMENT_TYPE_NODE = 10;
const DOCUMENT_FRAGMENT_NODE = 11;
const NOTATION_NODE = 12;

const applyTransforms = ({ matrix }, transformText) => {
  const match = /([^(]+)[(]([^)]*)[)] *(.*)/.exec(transformText);
  if (match) {
    const [operator, operandText, rest] = match.slice(1);
    const operandTokens = operandText
      .split(/ *, */g)
      .flatMap((token) => token.split(/ +/g));
    const operands = operandTokens.map((operand) => parseFloat(operand));
    if (operands.some((operand) => isNaN(operand))) {
      throw Error(`die: Bad operand in ${transformText}.`);
    }
    switch (operator.trim()) {
      case 'matrix': {
        // a b c
        const [a, b, c, d, tx, ty] = operands;
        matrix = multiply(matrix, [
          a,
          b,
          0,
          0,
          c,
          d,
          0,
          0,
          0,
          0,
          1,
          0,
          tx,
          ty,
          0,
          1,
        ]);
        break;
      }
      case 'translate': {
        const [x = 0, y = 0, z = 0] = operands;
        matrix = multiply(matrix, fromTranslation([x, y, z]));
        break;
      }
      case 'scale': {
        const [x = 1, y = x, z = 1] = operands;
        matrix = multiply(matrix, fromScaling([x, y, z]));
        break;
      }
      case 'rotate': {
        const [degrees = 0, x = 0, y = 0, z = 0] = operands;
        matrix = multiply(matrix, fromTranslation([x, y, z]));
        matrix = multiply(matrix, fromZRotation((degrees * Math.PI) / 180));
        matrix = multiply(matrix, fromTranslation([-x, -y, -z]));
        break;
      }
      case 'skewX': {
        // TODO: Move to math-mat4.
        const [degrees = 0] = operands;
        const [a, b, c, d, tx, ty] = [
          1,
          0,
          Math.tan((degrees * Math.PI) / 180),
          1,
          0,
          0,
        ];
        matrix = multiply(matrix, [
          a,
          b,
          0,
          0,
          c,
          d,
          0,
          0,
          0,
          0,
          1,
          0,
          tx,
          ty,
          0,
          1,
        ]);
        break;
      }
      case 'skewY': {
        // TODO: Move to math-mat4.
        const [degrees = 0] = operands;
        const [a, b, c, d, tx, ty] = [
          1,
          Math.tan((degrees * Math.PI) / 180),
          0,
          1,
          0,
          0,
        ];
        matrix = multiply(matrix, [
          a,
          b,
          0,
          0,
          c,
          d,
          0,
          0,
          0,
          0,
          1,
          0,
          tx,
          ty,
          0,
          1,
        ]);
        break;
      }
      default: {
        throw Error(`die: Unknown operator '${operator}' of ${transformText}.`);
      }
    }
    if (rest) {
      return applyTransforms({ matrix }, rest);
    }
  }
  return { matrix };
};

export const fromSvg = async (input, { definitions } = {}) => {
  const svgString = new TextDecoder('utf8').decode(input);
  const geometry = taggedGroup({});
  const svg = new XmlDom.DOMParser().parseFromString(
    await svgString,
    'image/svg+xml'
  );

  const getAttribute = (node, attribute, otherwise) => {
    const value = node.getAttribute(attribute);
    if (value === '' || value === null) {
      return otherwise;
    } else {
      return value;
    }
  };

  const measureScale = (node) => {
    // FIX: This is wrong and assumes width and height are in cm. Parse the units properly.
    const width = parseFloat(getAttribute(node, 'width', '1')) * 10;
    const height = parseFloat(getAttribute(node, 'height', '1')) * 10;
    const [minX, minY, maxX, maxY] = getAttribute(
      node,
      'viewBox',
      `0 0 ${width} ${height}`
    )
      .split(/ +/)
      .map((text) => parseFloat(text));
    const scaling = [width / (maxX - minX), -height / (maxY - minY), 1];
    return scaling;
  };

  const scaling = measureScale(svg.documentElement);
  const scale = (matrix) => multiply(fromScaling(scaling), matrix);

  const walk = ({ matrix }, node) => {
    if (matrix.some((element) => isNaN(element))) {
      throw Error(`die: Bad element in matrix ${matrix}.`);
    }
    const buildShape = (...attrs) => {
      const result = { type: node.tagName };
      for (const attr of attrs) {
        const value = node.getAttribute(attr);
        // FIX: Update toPath to handle these naturally.
        // toPath has some odd requirements about its inputs.
        if (value === '') {
          if (attr === 'cx' || attr === 'cy') {
            result[attr] = 0;
          }
        } else {
          if (attr === 'points' || attr === 'd') {
            result[attr] = value;
          } else {
            result[attr] = parseFloat(value);
          }
        }
      }
      return result;
    };
    switch (node.nodeType) {
      case ELEMENT_NODE: {
        ({ matrix } = applyTransforms(
          { matrix },
          node.getAttribute('transform')
        ));

        if (matrix.some((element) => isNaN(element))) {
          throw Error(`die: Bad element in matrix ${matrix}.`);
        }

        const output = (svgPath) => {
          const paths = fromSvgPath(svgPath).paths;
          const attributes = {
            fill: node.getAttribute('fill'),
            stroke: node.getAttribute('stroke'),
            'stroke-width': node.getAttribute('stroke-width'),
          };
          const style = node.getAttribute('style');
          for (const entry of style.split(';')) {
            const [name, value] = entry.split(':');
            attributes[name] = value;
          }
          const fill = attributes.fill;
          if (fill !== undefined && fill !== 'none' && fill !== '') {
            // Does fill, etc, inherit?
            const tags = toTagsFromName(fill, definitions);
            geometry.content.push(
              transformGeometry(
                scale(matrix),
                fillGeometry({
                  type: 'paths',
                  paths: paths,
                  tags,
                })
              )
            );
          }
          const stroke = attributes.stroke;
          const hasStroke =
            stroke !== undefined && stroke !== 'none' && stroke !== '';
          const strokeWidth = attributes['stroke-width'];
          const hasStrokeWidth =
            strokeWidth !== undefined &&
            strokeWidth !== 'none' &&
            strokeWidth !== '';
          if (hasStroke || hasStrokeWidth) {
            if (matrix.some((element) => isNaN(element))) {
              throw Error(`die: Bad element in matrix ${matrix}.`);
            }
            const scaledMatrix = scale(matrix);
            if (scaledMatrix.some((element) => isNaN(element))) {
              throw Error(`die: Bad element in matrix ${matrix}.`);
            }
            const tags = toTagsFromName(stroke, definitions);
            geometry.content.push(
              transformGeometry(scaledMatrix, {
                type: 'paths',
                paths: paths,
                tags,
              })
            );
          }
        };

        // FIX: Should output a path given a stroke, should output a surface given a fill.
        switch (node.tagName) {
          case 'path':
            output(node.getAttribute('d'));
            break;
          case 'circle':
            output(SvgPoints.toPath(buildShape('cx', 'cy', 'r')));
            break;
          case 'ellipse':
            output(SvgPoints.toPath(buildShape('cx', 'cy', 'rx', 'ry')));
            break;
          case 'line':
            output(SvgPoints.toPath(buildShape('x1', 'x2', 'y1', 'y2')));
            break;
          case 'polygon':
            output(SvgPoints.toPath(buildShape('points')));
            break;
          case 'polyline':
            output(SvgPoints.toPath(buildShape('points')));
            break;
          case 'rect':
            output(
              SvgPoints.toPath(
                buildShape('height', 'width', 'x', 'y', 'rx', 'ry')
              )
            );
            break;
          default:
            break;
        }
        break;
      }
      case ATTRIBUTE_NODE:
      case TEXT_NODE:
      case CDATA_SECTION_NODE:
      case ENTITY_REFERENCE_NODE:
      case ENTITY_NODE:
      case PROCESSING_INSTRUCTION_NODE:
      case COMMENT_NODE:
      case DOCUMENT_NODE:
      case DOCUMENT_TYPE_NODE:
      case DOCUMENT_FRAGMENT_NODE:
      case NOTATION_NODE:
        break;
      default:
        throw Error(`Unexpected svg node type: ${node.nodeType}`);
    }
    if (node.childNodes) {
      for (let nth = 0; nth < node.childNodes.length; nth++) {
        const childNode = node.childNodes[nth];
        walk({ matrix }, childNode);
      }
    }
  };

  walk({ matrix: identity() }, svg);
  return geometry;
};

export default fromSvg;
