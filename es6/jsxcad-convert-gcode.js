import { toKeptGeometry, getPaths } from './jsxcad-geometry-tagged.js';
import { getEdges } from './jsxcad-geometry-path.js';

// Runs each axis at maximum velocity until matches, so may make dog-legs.
const rapidPositioningTo = ([x = 0, y = 0, z = 0]) => `G0 X${x} Y${y} Z${z}`;

// Straight motion at set speed.
const linearInterpolateTo = ([x = 0, y = 0, z = 0]) => `G1 X${x} Y${y} Z${z}`;

// WARNING: The generated code is dangerous because it does not consider the physical reality of the device.
// To generate gcode properly seems like it would require a total plan of the device operation and material layout.
const toGcode = async (options = {}, geometry) => {
  const codes = [];
  const keptGeometry = toKeptGeometry(geometry);
  for (const { paths } of getPaths(keptGeometry)) {
    for (const path of paths) {
      for (const [start, end] of getEdges(path)) {
        // FIX: This will probably destroy a milling head by running into an uncut part.
        codes.push(rapidPositioningTo(start));
        codes.push(linearInterpolateTo(end));
      }
    }
  }
  codes.push(``);
  return new TextEncoder('utf8').encode(codes.join('\n'));
};

export { toGcode };
