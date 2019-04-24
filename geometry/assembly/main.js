import { assemble, difference, intersection, union } from '@jsxcad/algorithm-assembly';
import { assertCoplanar } from '@jsxcad/algorithm-surface';

export class Assembly {
  constructor ({ geometries = [], tags = [], operator = 'group' }) {
    this.geometries = geometries;
    this.tags = tags;
    this.isAssembly = true;
    this.operator = operator;
  }

  getProperty (key, defaultValue) {
    if (this.properties === undefined) {
      return defaultValue;
    }
    if (this.properties[key] === undefined) {
      return defaultValue;
    }
    return this.properties[key];
  }

  withProperty (key, value) {
    const properties = Object.assign({}, this.properties);
    properties[key] = value;
    return fromGeometries({ properties: properties }, this.geometries);
  }

  assemble (...geometries) {
    return fromGeometries({ properties: this.properties, operator: 'assemble' },
                          this.geometries.map(geometry => geometry.difference(...geometries)));
  }

  difference (...geometries) {
    return fromGeometries({ properties: this.properties, operator: 'difference' },
                          this.geometries.map(geometry => geometry.difference(...geometries)));
  }

  flip () {
    return fromGeometries({ properties: this.properties, operator: this.operator },
                          this.geometries.map(geometry => geometry.flip()));
  }

  intersection (...geometries) {
    return fromGeometries({ properties: this.properties, operator: 'intersection' },
                          this.geometries.map(geometry => geometry.intersection(...geometries)));
  }

  merge (...geometries) {
    return fromGeometries({ properties: this.properties }, [...this.toGeometries(), ...geometries]);
  }

  toSolid (options) {
    return toSolid(options, this.toTaggedGeometries(options));
  }

  applyOperator (taggedGeometries) {
    switch (this.operator) {
      case 'assemble': return assemble(...taggedGeometries);
      case 'difference': return difference(...taggedGeometries);
      case 'intersection': return intersection(...taggedGeometries);
      case 'union': return union(...taggedGeometries);
      default: throw Error('die');
    }
  }

  toTaggedGeometries (options) {
    if (this.taggedGeometries === undefined) {
      this.taggedGeometries = {
        assembly: this.applyOperator([].concat(...this.geometries.map(geometry => geometry.toTaggedGeometries(options))),
        tags: this.tags
      };
    }
    return this.taggedGeometries;
  }

  transform (matrix) {
    // Assembly transforms are eager, but the component transforms may be lazy.
    return fromGeometries({ properties: this.properties, operator: this.operator },
                          this.geometries.map(geometry => geometry.transform(matrix)));
  }

  union (...geometries) {
    return fromGeometries({ properties: this.properties, operator: 'union' }, [...this.toGeometries(), ...geometries]);
  }
}

export const fromGeometries = ({ properties, operator }, geometries) => {
  return new Assembly({ geometries, properties, operator });
};
