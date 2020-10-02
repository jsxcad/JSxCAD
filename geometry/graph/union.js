import { fromGraph, fuse, toGraph } from '@jsxcad/algorithm-occt';

export const union = (a, b) => toGraph(fuse(fromGraph(a), fromGraph(b)));
