#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/clip.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>

#include "manifold_util.h"

bool cut_mesh_by_mesh(Surface_mesh& a, Surface_mesh& b, bool open = false, bool exact = false) {
  if (open || !CGAL::is_closed(a)) {
    Surface_mesh meshCopy(b);
    CGAL::Polygon_mesh_processing::reverse_face_orientations(
        meshCopy);
    if (!CGAL::Polygon_mesh_processing::clip(
            a, meshCopy,
            CGAL::parameters::use_compact_clipper(true),
            CGAL::parameters::use_compact_clipper(true))) {
      return false;
    }
    demesh(a);
    return true;
  }
#ifdef JOT_MANIFOLD_ENABLED
  if (!exact) {
    manifold::Manifold target_manifold;
    buildManifoldFromSurfaceMesh(a, target_manifold);
    manifold::Manifold nth_manifold;
    buildManifoldFromSurfaceMesh(b, nth_manifold);
    target_manifold -= nth_manifold;
    if (target_manifold.Status() == manifold::Manifold::Error::NoError) {
      a.clear();
      buildSurfaceMeshFromManifold(target_manifold, a);
      demesh(a);
      return true;
    }
    std::cout << "QQ/cut_mesh_by_mesh: Manifold cut failed. Falling back to exact." << std::endl;
  }
#endif
  Surface_mesh meshCopy(b);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
          a, meshCopy, a,
      CGAL::parameters::all_default(), CGAL::parameters::all_default(),
      CGAL::parameters::all_default())) {
    return false;
  }
  demesh(a);
  return true;
};

bool join_mesh_to_mesh(Surface_mesh& a, Surface_mesh& b, bool exact = false) {
  if (!CGAL::is_closed(a)) {
    Surface_mesh meshCopy = b;
    CGAL::Polygon_mesh_processing::reverse_face_orientations(meshCopy);
    if (!CGAL::Polygon_mesh_processing::clip(
        a, meshCopy, CGAL::parameters::use_compact_clipper(true),
        CGAL::parameters::use_compact_clipper(true))) {
      return false;
    }
    demesh(a);
    return true;
  }
#ifdef JOT_MANIFOLD_ENABLED
  if (!exact) {
    manifold::Manifold target_manifold;
    buildManifoldFromSurfaceMesh(a, target_manifold);
    manifold::Manifold nth_manifold;
    buildManifoldFromSurfaceMesh(b, nth_manifold);
    target_manifold += nth_manifold;
    if (target_manifold.Status() == manifold::Manifold::Error::NoError) {
      a.clear();
      buildSurfaceMeshFromManifold(target_manifold, a);
      demesh(a);
      return true;
    }
    std::cout << "QQ/join_mesh_to_mesh: Manifold join failed. Falling back to exact." << std::endl;
  }
#endif
  Surface_mesh meshCopy(b);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
          a, meshCopy, a,
      CGAL::parameters::all_default(), CGAL::parameters::all_default(),
      CGAL::parameters::all_default())) {
    return false;
  }
  demesh(a);
  return true;
};

bool clip_mesh_by_mesh(Surface_mesh& a, Surface_mesh& b, bool open = false, bool exact = false) {
  if (open || !CGAL::is_closed(a)) {
    Surface_mesh meshCopy = b;
    CGAL::Polygon_mesh_processing::reverse_face_orientations(meshCopy);
    if (!CGAL::Polygon_mesh_processing::clip(
        a, meshCopy, CGAL::parameters::use_compact_clipper(true),
        CGAL::parameters::use_compact_clipper(true))) {
      return false;
    }
    demesh(a);
    return true;
  }
  if (!CGAL::is_closed(a)) {
    Surface_mesh meshCopy = b;
    if (!CGAL::Polygon_mesh_processing::clip(
            a, meshCopy,
            CGAL::parameters::use_compact_clipper(true),
            CGAL::parameters::use_compact_clipper(true))) {
      return STATUS_ZERO_THICKNESS;
    }
  }
#ifdef JOT_MANIFOLD_ENABLED
  if (!exact) {
    manifold::Manifold target_manifold;
    buildManifoldFromSurfaceMesh(a, target_manifold);
    manifold::Manifold nth_manifold;
    buildManifoldFromSurfaceMesh(b, nth_manifold);
    target_manifold ^= nth_manifold;
    if (target_manifold.Status() == manifold::Manifold::Error::NoError) {
      a.clear();
      buildSurfaceMeshFromManifold(target_manifold, a);
      demesh(a);
      return true;
    }
    std::cout << "QQ/clip_mesh_by_mesh: Manifold clip failed. Falling back to exact." << std::endl;
  }
#endif
  Surface_mesh meshCopy(b);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
          a, meshCopy, a,
      CGAL::parameters::all_default(), CGAL::parameters::all_default(),
      CGAL::parameters::all_default())) {
    return false;
  }
  demesh(a);
  return true;
};
