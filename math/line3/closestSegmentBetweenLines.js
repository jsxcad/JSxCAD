// From: http://paulbourke.net/geometry/pointlineplane/

/*
//   Calculate the line segment PaPb that is the shortest route between
//   two lines P1P2 and P3P4. Calculate also the values of mua and mub where
//      Pa = P1 + mua (P2 - P1)
//      Pb = P3 + mub (P4 - P3)
//   Return FALSE if no solution exists.
int LineLineIntersect(
   XYZ p1,XYZ p2,XYZ p3,XYZ p4,XYZ *pa,XYZ *pb,
   double *mua, double *mub)
{
   XYZ p13,p43,p21;
   double d1343,d4321,d1321,d4343,d2121;
   double numer,denom;

   p13.x = p1.x - p3.x;
   p13.y = p1.y - p3.y;
   p13.z = p1.z - p3.z;
   p43.x = p4.x - p3.x;
   p43.y = p4.y - p3.y;
   p43.z = p4.z - p3.z;

   if (ABS(p43.x) < EPS && ABS(p43.y) < EPS && ABS(p43.z) < EPS)
      return(FALSE);

   p21.x = p2.x - p1.x;
   p21.y = p2.y - p1.y;
   p21.z = p2.z - p1.z;

   if (ABS(p21.x) < EPS && ABS(p21.y) < EPS && ABS(p21.z) < EPS)
      return(FALSE);

   d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z;
   d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z;
   d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z;
   d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z;
   d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z;

   denom = d2121 * d4343 - d4321 * d4321;

   if (ABS(denom) < EPS)
      return(FALSE);

   numer = d1343 * d4321 - d1321 * d4343;

   *mua = numer / denom;
   *mub = (d1343 + d4321 * (*mua)) / d4343;

   pa->x = p1.x + *mua * p21.x;
   pa->y = p1.y + *mua * p21.y;
   pa->z = p1.z + *mua * p21.z;
   pb->x = p3.x + *mub * p43.x;
   pb->y = p3.y + *mub * p43.y;
   pb->z = p3.z + *mub * p43.z;

   return(TRUE);
}
*/

const EPSILON = 1e-5;
const X = 0;
const Y = 1;
const Z = 2;

/**
 * Calculate the line segment PaPb that is the shortest route between
 * two lines P1-P2 and P3-P4.
 *
 * Calculate also the values of mua and mub where
 *   Pa = P1 + mua (P2 - P1)
 *   Pb = P3 + mub (P4 - P3)
 *
 * Return undefined if no solution exists.
 * Otherwise return the shortest connecting line segment.
 */

export const closestSegmentBetweenLines = ([p1, p2], [p3, p4]) => {
  const p13 = [p1[X] - p3[X], p1[Y] - p3[Y], p1[Z] - p3[Z]];
  const p43 = [p4[X] - p3[X], p4[Y] - p3[Y], p4[Z] - p3[Z]];

  if (
    Math.abs(p43[X]) < EPSILON &&
    Math.abs(p43[Y]) < EPSILON &&
    Math.abs(p43[Z]) < EPSILON
  ) {
    return [null, null];
  }

  const p21 = [p2[X] - p1[X], p2[Y] - p1[Y], p2[Z] - p1[Z]];

  if (
    Math.abs(p21[X]) < EPSILON &&
    Math.abs(p21[Y]) < EPSILON &&
    Math.abs(p21[Z]) < EPSILON
  ) {
    return [null, null];
  }

  const d1343 = p13[X] * p43[X] + p13[Y] * p43[Y] + p13[Z] * p43[Z];
  const d4321 = p43[X] * p21[X] + p43[Y] * p21[Y] + p43[Z] * p21[Z];
  const d1321 = p13[X] * p21[X] + p13[Y] * p21[Y] + p13[Z] * p21[Z];
  const d4343 = p43[X] * p43[X] + p43[Y] * p43[Y] + p43[Z] * p43[Z];
  const d2121 = p21[X] * p21[X] + p21[Y] * p21[Y] + p21[Z] * p21[Z];

  const denominator = d2121 * d4343 - d4321 * d4321;

  if (Math.abs(denominator) < EPSILON) {
    return [null, null];
  }

  const numerator = d1343 * d4321 - d1321 * d4343;

  const mua = numerator / denominator;
  const mub = (d1343 + d4321 * mua) / d4343;

  const pa = [p1[X] + mua * p21[X], p1[Y] + mua * p21[Y], p1[Z] + mua * p21[Z]];
  const pb = [p3[X] + mub * p43[X], p3[Y] + mub * p43[Y], p3[Z] + mub * p43[Z]];

  return [pa, pb];
};
