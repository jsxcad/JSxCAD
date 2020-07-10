import Shapefile from 'shapefile/dist/shapefile.js';

const toVec3 = ([x = 0, y = 0, z = 0]) => [x, y, z];

const toTags = (properties) => {
  const tags = [];
  if (properties !== undefined) {
    for (const key of Object.keys(properties)) {
      tags.push(`user/shapefile/${key}/${properties[key]}`);
    }
  }
  return tags;
};

const toGeometry = (geometry, properties) => {
  const tags = toTags(properties);
  switch (geometry.type) {
    case 'Point':
      return { type: 'points', points: [toVec3(geometry.coordinates)], tags };
    case 'LineString':
      return {
        type: 'paths',
        paths: [[null, ...geometry.coordinates.map(toVec3)]],
        tags,
      };
    case 'Polygon':
      return {
        type: 'z0Surface',
        z0Surface: geometry.coordinates.map((path) => path.map(toVec3)),
        tags,
      };
    case 'MultiPoint':
      return { type: 'points', points: geometry.coordinates.map(toVec3), tags };
    case 'MultiLineString':
      return {
        type: 'paths',
        paths: geometry.coordinates.map((line) => [null, ...line.map(toVec3)]),
        tags,
      };
    case 'MultiPolygon':
      return {
        type: 'assembly',
        content: geometry.coordinates.map((surface) => ({
          type: 'z0Surface',
          z0Surface: surface.map((polygon) => polygon.map(toVec3)),
          tags,
        })),
      };
    case 'GeometryCollection':
      return {
        type: 'assembly',
        content: geometry.geometries.map(toGeometry),
        tags,
      };
    case 'FeatureCollection':
      return {
        type: 'assembly',
        content: geometry.features.map((feature) =>
          toGeometry(feature.geometry, feature.properties)
        ),
        tags,
      };
    default:
      throw Error('die');
  }
};

export const fromShapefile = async (shp, dbf) => {
  const geoJson = await Shapefile.read(shp, dbf);
  const geometry = toGeometry(geoJson);
  return geometry;
};
