export class Assembly {
  constructor ({ geometries = [], properties }) {
    this.geometries = geometries;
    this.properties = properties;
    this.isAssembly = true;
  }

  label () {
    return this.properties['label'];
  }

  withLabel (label) {
    return this.withProperty('label', label);
  }

  withProperty (key, value) {
    const properties = Object.assign({}, this.properties);
    properties[key] = value;
    return fromGeometries({ geometries: this.geometries, properties: properties });
  }

  difference (...geometries) {
    return fromGeometries({ properties: this.properties },
                          this.geometries.map(geometry => geometry.difference(...geometries)));
  }

  flip () {
    return fromGeometries({ properties: this.properties },
                          this.geometries.map(geometry => geometry.flip()));
  }

  intersection (...geometries) {
    return fromGeometries({ properties: this.properties },
                          this.geometries.map(geometry => geometry.intersection(...geometries)));
  }

  merge (...geometries) {
    return fromGeometries({ properties: this.properties }, [...this.toGeometries(), ...geometries]);
  }

  toGeometries (options = {}) {
    return this.geometries;
  }

  toPaths (options = {}) {
    // PROVE; Is concatenation sufficient, or do we need a pathwise union?
    return [].concat(...this.geometries.map(geometry => geometry.toPaths(options)));
  }

  transform (matrix) {
    // Assembly transforms are eager, but the component transforms may be lazy.
    return fromGeometries({ properties: this.properties },
                          this.geometries.map(geometry => geometry.transform(matrix)));
  }

  union (...geometries) {
    let unioned = this;
    while (geometries.length > 0) {
      const added = geometries.shift();
      unioned = unioned.difference(added);
      unioned = unioned.merge(added);
    }
    return unioned;
  }
}

export const fromGeometries = ({ properties }, geometries) => {
  return new Assembly({ geometries: geometries, properties: properties });
};
