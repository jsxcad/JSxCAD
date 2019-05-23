var max = Math.max
var abs = Math.abs
var pow = Math.pow
var sin = Math.sin
var cos = Math.cos
var tan = Math.tan
var acos = Math.acos
var sqrt = Math.sqrt
var ceil = Math.ceil
var τ = Math.PI * 2

module.exports = curves

function curves (px, py, cx, cy, rx, ry, xrot, large, sweep) {
  if (rx === 0 || ry === 0) return []

  xrot = xrot || 0
  large = large || 0
  sweep = sweep || 0

  var sinphi = sin(xrot * τ / 360)
  var cosphi = cos(xrot * τ / 360)

  var pxp = cosphi * (px - cx) / 2 + sinphi * (py - cy) / 2
  var pyp = -sinphi * (px - cx) / 2 + cosphi * (py - cy) / 2
  if (pxp === 0 && pyp === 0) return []

  rx = abs(rx)
  ry = abs(ry)

  var lambda = (
    pow(pxp, 2) / pow(rx, 2) +
    pow(pyp, 2) / pow(ry, 2)
  )

  if (lambda > 1) {
    rx *= sqrt(lambda)
    ry *= sqrt(lambda)
  }

  var centre = getArcCentre(px, py, cx, cy, rx, ry, large, sweep, sinphi, cosphi, pxp, pyp)
  var centrex = centre[0]
  var centrey = centre[1]
  var ang1 = centre[2]
  var ang2 = centre[3]

  var segments = max(ceil(abs(ang2) / (τ / 4)), 1)
  if (!segments) return []

  var curves = []
  ang2 /= segments
  while (segments--) {
    curves.push(approxUnitArc(ang1, ang2))
    ang1 += ang2
  }

  var result = []
  var curve, a, b, c
  var i = 0, l = curves.length

  while (i < l) {
    curve = curves[i++]
    a = mapToEllipse(curve[0], rx, ry, cosphi, sinphi, centrex, centrey)
    b = mapToEllipse(curve[1], rx, ry, cosphi, sinphi, centrex, centrey)
    c = mapToEllipse(curve[2], rx, ry, cosphi, sinphi, centrex, centrey)
    result[result.length] = [a[0], a[1], b[0], b[1], c[0], c[1]]
  }

  return result
}

function mapToEllipse (curve, rx, ry, cosphi, sinphi, centrex, centrey) {
  var x = curve[0] * rx
  var y = curve[1] * ry

  var xp = cosphi * x - sinphi * y
  var yp = sinphi * x + cosphi * y

  return [xp + centrex, yp + centrey]
}

function approxUnitArc (ang1, ang2) {
  var a = 4 / 3 * tan(ang2 / 4)

  var x1 = cos(ang1)
  var y1 = sin(ang1)
  var x2 = cos(ang1 + ang2)
  var y2 = sin(ang1 + ang2)

  return [
    [x1 - y1 * a, y1 + x1 * a ],
    [x2 + y2 * a, y2 - x2 * a],
    [x2, y2]
  ]
}

function getArcCentre (px, py, cx, cy, rx, ry, large, sweep, sinphi, cosphi, pxp, pyp) {
  var rxsq = pow(rx, 2)
  var rysq = pow(ry, 2)
  var pxpsq = pow(pxp, 2)
  var pypsq = pow(pyp, 2)

  var radicant = (rxsq * rysq) - (rxsq * pypsq) - (rysq * pxpsq)

  if (radicant < 0) radicant = 0
  radicant /= (rxsq * pypsq) + (rysq * pxpsq)
  radicant = sqrt(radicant) * (large === sweep ? -1 : 1)

  var centrexp = radicant * rx / ry * pyp
  var centreyp = radicant * -ry / rx * pxp
  var centrex = cosphi * centrexp - sinphi * centreyp + (px + cx) / 2
  var centrey = sinphi * centrexp + cosphi * centreyp + (py + cy) / 2

  var vx1 = (pxp - centrexp) / rx
  var vy1 = (pyp - centreyp) / ry
  var vx2 = (-pxp - centrexp) / rx
  var vy2 = (-pyp - centreyp) / ry

  var ang1 = vectorAngle(1, 0, vx1, vy1)
  var ang2 = vectorAngle(vx1, vy1, vx2, vy2)

  if (sweep === 0 && ang2 > 0) ang2 -= τ
  if (sweep === 1 && ang2 < 0) ang2 += τ

  return [centrex, centrey, ang1, ang2]
}

function vectorAngle (ux, uy, vx, vy) {
  var sign = (ux * vy - uy * vx < 0) ? -1 : 1
  var umag = sqrt(ux * ux + uy * uy)
  var vmag = sqrt(ux * ux + uy * uy)
  var dot = ux * vx + uy * vy

  var div = dot / (umag * vmag)
  if (div > 1) div = 1
  if (div < -1) div = -1

  return sign * acos(div)
}
