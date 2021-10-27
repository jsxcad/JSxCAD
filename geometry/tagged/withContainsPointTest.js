import { getContainsPointTest as getContainsPointTestForGraph } from '../graph/getContainsPointTest.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { visit } from './visit.js';

export const withContainsPointTest = (geometry, thunk) => {
  const tests = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        tests.push(getContainsPointTestForGraph(geometry));
        return;
      default:
        descend();
    }
  };
  visit(toConcreteGeometry(geometry), op);
  const predicate = (x = 0, y = 0, z = 0) => {
    for (const test of tests) {
      if (test.op(x, y, z)) {
        return true;
      }
    }
    return false;
  };
  thunk(predicate);
  for (const test of tests) {
    test.release();
  }
};
