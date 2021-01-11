import { negate } from '@jsxcad/math-vec3';

class Edge {
  constructor(data, change) {
    Object.assign(this, data, change);
    if (this._high[X] < this._low[X]) {
      [this._high[X], this._low[X]] = [this._low[X], this._high[X]];
    }
    if (this._high[Y] < this._low[Y]) {
      [this._high[Y], this._low[Y]] = [this._low[Y], this._high[Y]];
    }
    if (this._high[Z] < this._low[Z]) {
      [this._high[Z], this._low[Z]] = [this._low[Z], this._high[Z]];
    }
  }

  at(at) {
    this._at = at;
    return this.update({ _at: at });
  }
  sides(sides) {
    this._sides = sides;
    return this.update({ _sides: sides });
  }
  edge(x = 0, y = 0, z = 0) {
    return this.update({ _low: [x, y, z] });
  }
  to(x = 0, y = 0, z = 0) {
    return this.update({ _to: [x, y, z] });
  }

  update(change) {
    return new Edge(this, change);
  }
}

const X = 0;
const Y = 1;
const Z = 2;

export const edge = (x = 0, y = 0, z = 0) => {
  const high = [x, y, z];
  return new Edge({
    type: 'edge',
    _at: [0, 0, 0],
    _high: high,
    _low: negate(high),
    _sides: 32,
  });
};
