import { cut, fromGraph, toGraph } from '@jsxcad/algorithm-occt';

export const difference = (a, b) => toGraph(cut(fromGraph(a), fromGraph(b)));
