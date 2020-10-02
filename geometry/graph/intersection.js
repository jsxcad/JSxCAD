import { common, fromGraph, toGraph } from '@jsxcad/algorithm-occt';

export const intersection = (a, b) =>
  toGraph(common(fromGraph(a), fromGraph(b)));
