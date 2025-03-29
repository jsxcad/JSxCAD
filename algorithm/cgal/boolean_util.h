#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/autorefinement.h>
#include <CGAL/Polygon_mesh_processing/clip.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polygon_mesh_processing/repair_self_intersections.h>

#include "manifold_util.h"
#include "repair_util.h"
#include "validate_util.h"

/*
The challenge with manifold is that conversion from exact to float can cause
geometry to become self-intersecting.

We don't have a way to detect self-intersection in manifold geometry, so we go
in somewhat blind. This generally isn't a huge problem, as it should fail or
return self-intersecting results, which we can detect.

In practice, in some cases we have non-self-intersecting geometry that becomes
self-intersecting geometry when made discrete, but which also causes
corefinement to fail.

What would really help is for corefinement to provide better failure reporting.

This might allow us to select a suitable repair strategy.
*/

template <typename K>
static bool repair_boolean(CGAL::Surface_mesh<typename K::Point_3>& mesh,
                           bool conservative = true) {
  repair_manifold<K>(mesh);
  repair_degeneracies<K>(mesh);
  if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
    if (!CGAL::Polygon_mesh_processing::experimental::remove_self_intersections(
            mesh)) {
      if (!repair_self_intersection_by_autorefine<EK>(mesh)) {
        return false;
      }
    }
  }
  CGAL::Polygon_mesh_processing::remove_connected_components_of_negligible_size(
      mesh);
  return true;
}

bool cut_mesh_by_mesh(Surface_mesh& a, Surface_mesh& b, bool open = false,
                      bool exact = false) {
  try {
    if (open || !CGAL::is_closed(a)) {
      Surface_mesh working_mesh(b);
      CGAL::Polygon_mesh_processing::reverse_face_orientations(working_mesh);
      if (!CGAL::Polygon_mesh_processing::clip(
              a, working_mesh, CGAL::parameters::use_compact_clipper(true),
              CGAL::parameters::use_compact_clipper(true))) {
        std::cout << "cut_mesh_by_mesh: clip failed." << std::endl;
        return false;
      }
      assert(repair_boolean<EK>(a, false));
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
        Surface_mesh working_mesh;
        buildSurfaceMeshFromManifold(target_manifold, working_mesh);
        if (repair_boolean<EK>(working_mesh)) {
          demesh(working_mesh);
          a = std::move(working_mesh);
          return true;
        } else {
          std::cout << "cut_mesh_by_mesh: Manifold repair failed." << std::endl;
        }
      }
      std::cout
          << "cut_mesh_by_mesh: Manifold cut failed. Falling back to exact cut."
          << std::endl;
    }
#endif
    Surface_mesh working_mesh(b);
    if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
            a, working_mesh, a,
            CGAL::parameters::throw_on_self_intersection(true),
            CGAL::parameters::all_default(), CGAL::parameters::all_default())) {
      std::cout << "cut_mesh_by_mesh: exact cut is non-manifold" << std::endl;
      if (!repair_boolean<EK>(a, false)) {
        return false;
      }
    }
    demesh(a);
    return true;
  } catch (const std::exception& e) {
    std::cout << "cut_mesh_by_mesh: " << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }
};

bool join_mesh_to_mesh(Surface_mesh& a, Surface_mesh& b, bool exact = false) {
#ifdef JOT_MANIFOLD_ENABLED
  if (!exact) {
    manifold::Manifold target_manifold;
    buildManifoldFromSurfaceMesh(a, target_manifold);
    manifold::Manifold nth_manifold;
    buildManifoldFromSurfaceMesh(b, nth_manifold);
    target_manifold += nth_manifold;
    if (target_manifold.Status() == manifold::Manifold::Error::NoError) {
      Surface_mesh working_mesh;
      buildSurfaceMeshFromManifold(target_manifold, working_mesh);
      if (repair_boolean<EK>(working_mesh)) {
        demesh(working_mesh);
        a = std::move(working_mesh);
        return true;
      } else {
        std::cout << "join_mesh_to_mesh: Manifold repair failed." << std::endl;
      }
    }
    std::cout << "join_mesh_to_mesh: Manifold join failed. Falling back to "
                 "exact join."
              << std::endl;
  }
#endif
  Surface_mesh working_mesh(b);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
          a, working_mesh, a, CGAL::parameters::all_default(),
          CGAL::parameters::all_default(), CGAL::parameters::all_default())) {
    std::cout << "join_mesh_to_mesh: exact join is non-manifold." << std::endl;
    assert(repair_boolean<EK>(a, false));
  }
  demesh(a);
  return true;
};

bool clip_mesh_by_mesh(Surface_mesh& a, Surface_mesh& b, bool open = false,
                       bool exact = false) {
  if (open || !CGAL::is_closed(a)) {
    Surface_mesh working_mesh(b);
    CGAL::Polygon_mesh_processing::reverse_face_orientations(working_mesh);
    if (!CGAL::Polygon_mesh_processing::clip(
            a, working_mesh, CGAL::parameters::use_compact_clipper(true),
            CGAL::parameters::use_compact_clipper(true))) {
      assert(repair_boolean<EK>(a, false));
    }
    demesh(a);
    return true;
  }
  if (!CGAL::is_closed(a)) {
    Surface_mesh working_mesh(b);
    if (!CGAL::Polygon_mesh_processing::clip(
            a, working_mesh, CGAL::parameters::use_compact_clipper(true),
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
      Surface_mesh working_mesh;
      buildSurfaceMeshFromManifold(target_manifold, working_mesh);
      if (repair_boolean<EK>(working_mesh)) {
        demesh(working_mesh);
        a = std::move(working_mesh);
        return true;
      } else {
        std::cout << "clip_mesh_by_mesh: Manifold repair failed." << std::endl;
      }
    }
    std::cout
        << "clip_mesh_by_mesh: Manifold clip failed. Falling back to exact."
        << std::endl;
  }
#endif
  Surface_mesh working_mesh(b);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_intersection(
          a, working_mesh, a, CGAL::parameters::all_default(),
          CGAL::parameters::all_default(), CGAL::parameters::all_default())) {
    std::cout << "clip_mesh_by_mesh: exact clip is non-manifold." << std::endl;
    assert(repair_boolean<EK>(a, false));
  }
  demesh(a);
  return true;
};
