export class Assembly {
  constructor ({ geometries = [], properties }) {
    this.geometries = geometries;
    this.properties = properties;
  }

  label() {
    return this.properties['label'];
  }

  withLabel(label) {
    return this.withProperty('label', label);
  }

  withProperty(key, value) {
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
    // FIX: This is wrong -- union can't be done eagerly like this -- we'd get N copies.
    return fromGeometries({ properties: this.properties },
                          this.geometries.map(geometry => geometry.union(...geometries)));
  }
}

export const fromGeometries = ({ properties }, geometries) => new Assembly({ geometries: geometries, properties: properties });
