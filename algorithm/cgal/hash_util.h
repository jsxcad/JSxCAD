#pragma once

namespace std {

template <typename K>
struct hash<CGAL::Plane_3<K>> {
  std::size_t operator()(const CGAL::Plane_3<K>& plane) const {
    // FIX: We can do better than this.
    return 1;
  }
};

}  // namespace std
