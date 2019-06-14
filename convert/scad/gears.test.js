import SCADParser from 'scad-parser';
import { readFileSync } from 'fs';
import stringify from 'json-stringify-pretty-compact';
import test from 'ava';

const strip = (ast) => {
  if (ast instanceof Array) {
    return ast.map(strip);
  } else if (ast instanceof Object) {
    const copy = {};
    for (const key of Object.keys(ast)) {
      if (key === 'tokens') {
        continue;
      }
      copy[key] = strip(ast[key]);
    }
    return copy;
  } else {
    return ast;
  }
};

const convertChildren = (children) => children.map(convertAst).join(', ');

const convertValue = ({ value }) => value;

const convertArg = (options) => {
  const { name } = options;
  if (name) {
    return `${name}: ${convertValue(options)}`;
  } else {
    return convertValue(options);
  }
};

const convertArgs = (args) => {
  if (args instanceof Array) {
    return `{ ${args.map(convertArg).join(', ')} }`;
  } else {
    return convertArg(args);
  }
};

const convertAst = ({ name, args = [], children = [] }) => `${name}(${convertArgs(args)}, ${convertChildren(children)})`;

test('Parse CSG', t => {
  const code = readFileSync('./gears.test.csg', { encoding: 'utf8' });
  const ast = new SCADParser().parse(code, 'gears.test.csg');
  console.log(`QQ/convert: ${convertAst(ast)}`);
  console.log(`QQ/ast: ${stringify(strip(ast))}`);
  console.log(`QQ/ast: ${stringify(strip(ast))}`);
  t.true(true);
});
