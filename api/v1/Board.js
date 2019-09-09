import { Cube } from './Cube';
import { assertNumber } from './assert';
import { dispatch } from './dispatch';

/**
 *
 * # Board
 *
 **/

const fromDimensions = ({ width = 1, length = 1, height = 1 }) =>
  Cube(width, length, height)
      .material('wood');

export const Board = dispatch(
  'Board',
  // cube()
  (width, length, height = 1) => {
    assertNumber(width);
    assertNumber(length);
    assertNumber(height);
    return () => fromDimensions({ width, length, height });
  });
