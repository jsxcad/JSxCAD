import { eachEdge as graph } from '../graph/eachEdge.js';
import { op } from './op.js';
import { visit } from './visit.js';

const segments = ({ matrix, normal = [0, 0, 1], segments }, emit) => {
  for (const segment of segments) {
    emit(segment, normal, matrix);
  }
};

export const eachSegment = op({ graph, segments }, visit);
