import { read } from 'shapefile';

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
      return { points: [toVec3(geometry.coordinates)], tags };
    case 'LineString':
      return { paths: [[null, ...geometry.coordinates.map(toVec3)]], tags };
    case 'Polygon':
      return {
        z0Surface: geometry.coordinates.map((path) => path.map(toVec3)),
        tags,
      };
    case 'MultiPoint':
      return { points: geometry.coordinates.map(toVec3), tags };
    case 'MultiLineString':
      return {
        paths: geometry.coordinates.map((line) => [null, ...line.map(toVec3)]),
        tags,
      };
    case 'MultiPolygon':
      return {
        assembly: geometry.coordinates.map((surface) => ({
          z0Surface: surface.map((polygon) => polygon.map(toVec3)),
          tags,
        })),
      };
    case 'GeometryCollection':
      return { assembly: geometry.geometries.map(toGeometry), tags };
    case 'FeatureCollection':
      return {
        assembly: geometry.features.map((feature) =>
          toGeometry(feature.geometry, feature.properties)
        ),
        tags,
      };
    default:
      throw Error('die');
  }
};

export const fromShapefile = async (options, shp, dbf) => {
  const geoJson = await read(shp, dbf);
  const geometry = toGeometry(geoJson);
  return geometry;
};
