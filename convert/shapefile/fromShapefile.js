import { read } from 'shapefile';

const toGeometry = (geoJson) => {
  switch (geoJson.type) {
    case 'Point':
      return { points: [geoJson.coordinates] };
    case 'LineString':
      return { paths: [[null, ...geoJson.coordinates]] };
    case 'Polygon':
      return { z0Surface: geoJson.coordinates };
    case 'MultiPoint':
      return { points: geoJson.coordinates };
    case 'MultiLineString':
      return { paths: geoJson.coordinates.map(line => [null, ...line]) };
    case 'MultiPolygon':
      return { z0Surface: [].concat(...geoJson.coordinates) };
    case 'GeometryCollection':
      return { assemble: geoJson.geometries.map(toGeometry) };
    case 'FeatureCollection':
      return { assemble: geoJson.features.map(feature => toGeometry(feature.geometry)) };
    default:
      throw Error('die');
  }
};

export const fromShapefile = async (options, shp, dbf) => {
  const geoJson = await read(shp, dbf);
  return toGeometry(geoJson);
};
