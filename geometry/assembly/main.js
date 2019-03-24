export class Assembly {
  constructor ({ geometries = [], properties }) {
    this.geometries = geometries;
    this.properties = properties;
    this.isAssembly = true;
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

  toPaths (options) {
    // FIX: Probably instead of toPaths we want an interface like 'toComponentPaths' which preserves the
    // paths and properties of each component (and sub-component, and so on).
    // If they want a fused geometry, then they should ask for that.
    const { tags } = options;
    if (tags !== undefined) {
      const ourTags = this.getProperty('tags');
      if (ourTags !== undefined) {
        if (ourTags.every(tag => !tags.includes(tag))) {
          // This tagged assembly does not have the right tags -- produce no paths.
          let paths = [];
          paths.tags = tags;
          return paths;
        }
      }
    }
    let subPaths = this.geometries.map(geometry => geometry.toPaths(options));
    let paths = [].concat(...subPaths);
    // FIX: This is probably the wrong thing to do, see above.
    paths.properties = Object.assign({}, ...subPaths.map(subPath => subPath.properties || {}), this.properties || {});
    return paths;
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
