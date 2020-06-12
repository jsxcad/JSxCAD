var arc = require("./arc-to-curves");

module.exports = curvify;

function curvify(path) {
  var result = [];
  var cmd, prev, curves;
  var x = 0,
    y = 0;
  var bx = 0,
    by = 0;
  var sx = 0,
    sy = 0;
  var qx, qy, cx, cy;
  var i = 0,
    j,
    m,
    sl;
  var l = path.length;
  var c, seg;

  while (i < l) {
    (seg = path[i++]), (cmd = seg[0]);

    if (cmd == "M") (sx = seg[1]), (sy = seg[2]);
    else if (cmd == "L") seg = line(x, y, seg[1], seg[2]);
    else if (cmd == "H") seg = line(x, y, seg[1], y);
    else if (cmd == "V") seg = line(x, y, x, seg[1]);
    else if (cmd == "Z") seg = line(x, y, sx, sy);
    else if (cmd == "A") {
      curves = arc(
        x,
        y,
        seg[6],
        seg[7],
        seg[1],
        seg[2],
        seg[3],
        seg[4],
        seg[5]
      );

      m = curves.length;
      if (!m) continue;
      j = 0;

      while (j < m) {
        c = curves[j++];
        seg = ["C", c[0], c[1], c[2], c[3], c[4], c[5]];
        if (j < m) result[result.length] = seg;
      }
    } else if (cmd == "S") {
      (cx = x), (cy = y);
      if (prev == "C" || prev == "S") {
        (cx += cx - bx), (cy += cy - by);
      }
      seg = ["C", cx, cy, seg[1], seg[2], seg[3], seg[4]];
    } else if (cmd == "T") {
      if (prev == "Q" || prev == "T") {
        (qx = x * 2 - qx), (qy = y * 2 - qy);
      } else (qx = x), (qy = y);
      seg = quadratic(x, y, qx, qy, seg[1], seg[2]);
    } else if (cmd == "Q") {
      (qx = seg[1]), (qy = seg[2]);
      seg = quadratic(x, y, seg[1], seg[2], seg[3], seg[4]);
    }

    sl = seg.length;
    (x = seg[sl - 2]), (y = seg[sl - 1]);
    if (sl > 4) (bx = seg[sl - 4]), (by = seg[sl - 3]);
    else (bx = x), (by = y);
    prev = cmd;

    result[result.length] = seg;
  }

  return result;
}

function line(x1, y1, x2, y2) {
  return ["C", x1, y1, x2, y2, x2, y2];
}

function quadratic(x1, y1, cx, cy, x2, y2) {
  return [
    "C",
    x1 / 3 + (2 / 3) * cx,
    y1 / 3 + (2 / 3) * cy,
    x2 / 3 + (2 / 3) * cx,
    y2 / 3 + (2 / 3) * cy,
    x2,
    y2,
  ];
}
