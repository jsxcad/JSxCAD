import { Cube } from "./Cube";

/**
 *
 * # Board
 *
 **/

const ofSize = (width = 1, length = 1, height = 1) =>
  Cube(width, length, height).material("wood");

export const Board = (...args) => ofSize(...args);

Board.ofSize = ofSize;

export default Board;
