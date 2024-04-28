#pragma once

template <typename Kernel>
static typename Kernel::Plane_3 unitPlane(const typename Kernel::Plane_3& p) {
  typedef typename Kernel::Plane_3 Plane_3;
  typedef typename Kernel::Vector_3 Vector_3;
  Vector_3 normal = p.orthogonal_vector();
  // We can handle the axis aligned planes exactly.
  if (normal.direction() == Vector_3(0, 0, 1).direction()) {
    return Plane_3(p.point(), Vector_3(0, 0, 1));
  } else if (normal.direction() == Vector_3(0, 0, -1).direction()) {
    return Plane_3(p.point(), Vector_3(0, 0, -1));
  } else if (normal.direction() == Vector_3(0, 1, 0).direction()) {
    return Plane_3(p.point(), Vector_3(0, 1, 0));
  } else if (normal.direction() == Vector_3(0, -1, 0).direction()) {
    return Plane_3(p.point(), Vector_3(0, -1, 0));
  } else if (normal.direction() == Vector_3(1, 0, 0).direction()) {
    return Plane_3(p.point(), Vector_3(1, 0, 0));
  } else if (normal.direction() == Vector_3(-1, 0, 0).direction()) {
    return Plane_3(p.point(), Vector_3(-1, 0, 0));
  } else {
    // But the general case requires an approximation.
    Vector_3 unit_normal =
        normal / CGAL_NTS approximate_sqrt(normal.squared_length());
    return Plane_3(p.point(), unit_normal);
  }
}

template <typename Vector>
static Vector unitVector(const Vector& vector) {
  // We can handle the axis aligned planes exactly.
  if (vector.direction() == Vector(0, 0, 1).direction()) {
    return Vector(0, 0, 1);
  } else if (vector.direction() == Vector(0, 0, -1).direction()) {
    return Vector(0, 0, -1);
  } else if (vector.direction() == Vector(0, 1, 0).direction()) {
    return Vector(0, 1, 0);
  } else if (vector.direction() == Vector(0, -1, 0).direction()) {
    return Vector(0, -1, 0);
  } else if (vector.direction() == Vector(1, 0, 0).direction()) {
    return Vector(1, 0, 0);
  } else if (vector.direction() == Vector(-1, 0, 0).direction()) {
    return Vector(-1, 0, 0);
  } else {
    // But the general case requires an approximation.
    Vector unit_vector =
        vector / CGAL_NTS approximate_sqrt(vector.squared_length());
    return unit_vector;
  }
}

template <typename Vector_2>
static Vector_2 unitVector2(const Vector_2& vector) {
  // We can handle the axis aligned planes exactly.
  if (vector.direction() == Vector_2(0, 1).direction()) {
    return Vector_2(0, 1);
  } else if (vector.direction() == Vector_2(0, -1).direction()) {
    return Vector_2(0, -1);
  } else if (vector.direction() == Vector_2(1, 0).direction()) {
    return Vector_2(1, 0);
  } else if (vector.direction() == Vector_2(-1, 0).direction()) {
    return Vector_2(-1, 0);
  } else {
    // But the general case requires an approximation.
    Vector_2 unit_vector =
        vector / CGAL_NTS approximate_sqrt(vector.squared_length());
    return unit_vector;
  }
}
