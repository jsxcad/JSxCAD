import { canonicalize } from '@jsxcad/algorithm-solid';
import { difference as solidDifference, intersection as solidIntersection, union as solidUnion } from '@jsxcad/algorithm-bsp-surfaces';
import { difference as z0Difference, intersection as z0Intersection, union as z0Union } from '@jsxcad/algorithm-z0surface';
import { assertCoplanar} from '@jsxcad/algorithm-surface';

export class Assembly {
  constructor ({ geometries = [], properties, operator = 'group' }) {
    this.geometries = geometries;
    this.properties = properties;
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

  toGeometries (options = {}) {
    return this.geometries;
  }

  toSolid (options) {
    // FIX: Handle non-solids.
    // FIX: include -> requires ?
    const { requires, excludes } = options;

    const isSelectedTags = (solidTags) => {
      if (requires !== undefined && solidTags === undefined) {
        return false;
      }
      if (excludes !== undefined && solidTags.some(solidTag => !excludes.includes(solidTag))) {
        return false;
      }
      if (requires !== undefined && solidTags.some(solidTag => !requires.includes(solidTag))) {
        return false;
      }
      return true;
    };

    const solids = this.toSolids(options).filter(solid => isSelectedTags(solid.tags));
    for (const solid of solids) {
      for (const surface of solid) assertCoplanar(surface);
    }
    const solid = solidUnion(...solids);
    for (const surface of solid) assertCoplanar(surface);
    return solid;
  }

  toSolids (options) {
    const solids = [].concat(...this.geometries.map(geometry => geometry.toSolids(options)));

    switch (this.operator) {
      case 'difference': {
        const differenced = solidDifference(...solids);
        // FIX: Keep all properties.
        differenced.tags = solids[0].tags;
        return [differenced];
      }
      case 'intersection': {
        const intersected = solidIntersection(...solids);
        // FIX: Keep all properties.
        intersected.tags = solids[0].tags;
        return [intersected];
      }
      case 'union': {
        // FIX: This is really 'group'.
        // const unioned = solidUnion(...solids);
        const holed = [];
        for (let nth = 0; nth < solids.length; nth++) {
          const cut = solidDifference(solids[nth], ...solids.slice(nth + 1));
          cut.tags = solids[nth].tags;
          holed.push(cut);
        }
        return holed;
      }
      case 'group': {
        solids.forEach(solid => { solid.tags = this.getProperty('tags'); });
        return solids;
      }
      default: {
        throw Error('die');
      }
    }
  }

  toZ0Drawing (options) {
    const { tags } = options;

    const isSelectedTags = (z0DrawingTags) => {
      if (z0DrawingTags === undefined) {
        return true;
      }
      if (tags === undefined) {
        return true;
      }
      if (z0DrawingTags.every(z0DrawingTag => !tags.includes(z0DrawingTag))) {
        return false;
      }
      return true;
    };

    const z0Drawings = this.toZ0Drawings(options);
    return [].concat(...z0Drawings.filter(z0Drawing => isSelectedTags(z0Drawing.tags)));
  }

  toZ0Drawings (options) {
    // FIX: Booleans on closed paths?
    return [].concat(...this.geometries.map(geometry => geometry.toZ0Drawings(options)));
  }

  toZ0Surface (options) {
    const { tags } = options;

    const isSelectedTags = (z0SurfaceTags) => {
      if (z0SurfaceTags === undefined) {
        return true;
      }
      if (tags === undefined) {
        return true;
      }
      if (z0SurfaceTags.every(z0SurfaceTag => !tags.includes(z0SurfaceTag))) {
        return false;
      }
      return true;
    };

    const z0Surfaces = this.toZ0Surfaces(options);
    return z0Union(...z0Surfaces.filter(z0Surface => isSelectedTags(z0Surface.tags)));
  }

  toZ0Surfaces (options) {
    const surfaces = [].concat(...this.geometries.map(geometry => geometry.toZ0Surfaces(options)));

    switch (this.operator) {
      case 'difference': {
        const differenced = z0Difference(...surfaces);
        // FIX: Keep all properties.
        differenced.tags = surfaces[0].tags;
        return [differenced];
      }
      case 'intersection': {
        const intersected = z0Intersection(...surfaces);
        // FIX: Keep all properties.
        intersected.tags = surfaces[0].tags;
        return [intersected];
      }
      case 'union': {
        // FIX: This is really 'group'.
        // const unioned = union(...surfaces);
        const holed = [];
        for (let nth = 0; nth < surfaces.length; nth++) {
          const cut = z0Difference(surfaces[nth], ...surfaces.slice(nth + 1));
          cut.tags = surfaces[nth].tags;
          holed.push(cut);
        }
        return holed;
      }
      case 'group': {
        surfaces.forEach(surfaces => { surfaces.tags = this.getProperty('tags'); });
        return surfaces;
      }
      default: {
        throw Error('die');
      }
    }
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
