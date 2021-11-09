import { eachEdge as graph } from '../graph/eachEdge.js';
import { op } from './op.js';
import { visit } from './visit.js';

const segments = ({ matrix, orientation = [[0, 0, 0], [0, 0, 1], [1, 0, 0]], segments }, emit) => {
  for (const segment of segments) {
    emit(segment, orientation);
  }
};

export const eachSegment = op({ graph, segments }, visit);
