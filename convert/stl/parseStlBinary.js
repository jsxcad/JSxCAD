// Adapted for ArrayBuffer from parse-stl-binary version ^1.0.1.

const LITTLE_ENDIAN = true;

const readVector = (view, off) => [
  view.getFloat32(off + 0, LITTLE_ENDIAN),
  view.getFloat32(off + 4, LITTLE_ENDIAN),
  view.getFloat32(off + 8, LITTLE_ENDIAN),
];

export const parse = (data) => {
  const view = new DataView(data.buffer);
  var off = 80; // skip header

  var triangleCount = view.getUint32(off, LITTLE_ENDIAN);
  off += 4;

  var cells = [];
  var positions = [];
  var faceNormals = [];

  for (var i = 0; i < triangleCount; i++) {
    var cell = [];
    var normal = readVector(view, off);
    off += 12; // 3 floats

    faceNormals.push(normal);

    for (var j = 0; j < 3; j++) {
      var position = readVector(view, off);
      off += 12;
      cell.push(positions.length);
      positions.push(position);
    }

    cells.push(cell);
    off += 2; // skip attribute byte count
  }

  return {
    positions: positions,
    cells: cells,
    faceNormals: faceNormals,
  };
};
