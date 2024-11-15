#pragma once

#define CGAL_PMP_REMOVE_SELF_INTERSECTION_DEBUG

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
The challenge with manifold is that conversion from exact to float can cause geometry to become self-intersecting.

We don't have a way to detect self-intersection in manifold geometry, so we go in somewhat blind.
This generally isn't a huge problem, as it should fail or return self-intersecting results, which we can detect.

In practice, in some cases we have non-self-intersecting geometry that becomes self-intersecting geometry
when made discrete, but which also causes corefinement to fail.

What would really help is for corefinement to provide better failure reporting.

This might allow us to select a suitable repair strategy.
*/

template <typename K>
static bool repair_boolean(CGAL::Surface_mesh<typename K::Point_3>& mesh, bool conservative = true) {
  std::cout << "repair_boolean: repair_manifold" << std::endl;
  repair_manifold<K>(mesh);
  if (!CGAL::is_valid_polygon_mesh(mesh, true)) { return false; }
  std::cout << "repair_boolean: repair_degeneracies" << std::endl;
  repair_degeneracies<K>(mesh);
  if (!CGAL::is_valid_polygon_mesh(mesh, true)) { return false; }
  assert(number_of_non_manifold_vertices(mesh) == 0);
  if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
    std::cout << "repair_boolean: remove_self_intersections" << std::endl;
    if (!CGAL::Polygon_mesh_processing::experimental::remove_self_intersections(mesh)) {
      std::cout << "repair_boolean: autorefine begin" << std::endl;
      if (!repair_self_intersection_by_autorefine<EK>(mesh)) {
        std::cout << "repair_boolean: autorefine failed" << std::endl;
        std::cout << mesh << std::endl;
        return false;
      }
    }
  }
  std::cout << "repair_boolean: is_valid_polygon_mesh?" << std::endl;
  if (!CGAL::is_valid_polygon_mesh(mesh, true)) { return false; }
  std::cout << "repair_boolean: remove_connected_components_of_negligible_size" << std::endl;
  CGAL::Polygon_mesh_processing::remove_connected_components_of_negligible_size(mesh);
  if (!CGAL::is_valid_polygon_mesh(mesh, true)) { return false; }
  std::cout << "repair_boolean: ok" << std::endl;
  return true;
}

bool cut_mesh_by_mesh(Surface_mesh& a, Surface_mesh& b, bool open = false, bool exact = false) {
  try {
  assert(!CGAL::Polygon_mesh_processing::does_self_intersect(a));
  assert(!CGAL::Polygon_mesh_processing::does_self_intersect(b));

  if (open || !CGAL::is_closed(a)) {
    Surface_mesh working_mesh(b);
    CGAL::Polygon_mesh_processing::reverse_face_orientations(
        working_mesh);
    if (!CGAL::Polygon_mesh_processing::clip(
            a, working_mesh,
            CGAL::parameters::use_compact_clipper(true),
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
        std::cout << working_mesh << std::endl;
      }
    }
    switch (target_manifold.Status()) {
      case manifold::Manifold::Error::NoError: std::cout << "NoError" << std::endl; break;
      case manifold::Manifold::Error::NonFiniteVertex: std::cout << "NonFiniteVertex" << std::endl; break;
      case manifold::Manifold::Error::NotManifold: std::cout << "NotManifold" << std::endl; break;
      case manifold::Manifold::Error::VertexOutOfBounds: std::cout << "VertexOutOfBounds" << std::endl; break;
      case manifold::Manifold::Error::PropertiesWrongLength: std::cout << "PropertiesWrongLength" << std::endl; break;
      case manifold::Manifold::Error::MissingPositionProperties: std::cout << "MissingPositionProperties" << std::endl; break;
      case manifold::Manifold::Error::MergeVectorsDifferentLengths: std::cout << "MergeVectorsDifferentLengths" << std::endl; break;
      case manifold::Manifold::Error::MergeIndexOutOfBounds: std::cout << "MergeIndexOutOfBounds" << std::endl; break;
      case manifold::Manifold::Error::TransformWrongLength: std::cout << "TransformWrongLength" << std::endl; break;
      case manifold::Manifold::Error::RunIndexWrongLength: std::cout << "RunIndexWrongLength" << std::endl; break;
      case manifold::Manifold::Error::FaceIDWrongLength: std::cout << "FaceIDWrongLength" << std::endl; break;
      case manifold::Manifold::Error::InvalidConstruction: std::cout << "InvalidConstruction" << std::endl; break;
    }
    std::cout << "cut_mesh_by_mesh: Manifold cut failed. Falling back to exact cut." << std::endl;
  }
#endif
  if (CGAL::Polygon_mesh_processing::does_self_intersect(a)) {
    std::cout << "cut_mesh_by_mesh: input a is self-intersecting" << std::endl;
  }
  if (CGAL::Polygon_mesh_processing::does_self_intersect(b)) {
    std::cout << "cut_mesh_by_mesh: input b is self-intersecting" << std::endl;
  }
  std::cout << "Repair a" << std::endl;
  assert(repair_boolean<EK>(a, false));
  std::cout << "Repair b" << std::endl;
  assert(repair_boolean<EK>(b, false));
  Surface_mesh working_mesh(b);
  assert(number_of_non_manifold_vertices(a) == 0);
  assert(number_of_non_manifold_vertices(working_mesh) == 0);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
          a, working_mesh, a,
      CGAL::parameters::throw_on_self_intersection(true), CGAL::parameters::all_default(),
      CGAL::parameters::all_default())) {
    std::cout << "cut_mesh_by_mesh: exact cut is non-manifold" << std::endl;
  }
  if (!repair_boolean<EK>(a, false)) {
    return false;
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
        std::cout << working_mesh << std::endl;
      }
    }
    std::cout << "join_mesh_to_mesh: Manifold join failed. Falling back to exact join." << std::endl;
  }
#endif
  Surface_mesh working_mesh(b);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
          a, working_mesh, a,
      CGAL::parameters::all_default(), CGAL::parameters::all_default(),
      CGAL::parameters::all_default())) {
    std::cout << "join_mesh_to_mesh: exact join is non-manifold." << std::endl;
  }
      assert(repair_boolean<EK>(a, false));
  demesh(a);
  return true;
};

bool clip_mesh_by_mesh(Surface_mesh& a, Surface_mesh& b, bool open = false, bool exact = false) {
  if (open || !CGAL::is_closed(a)) {
    Surface_mesh working_mesh(b);
    CGAL::Polygon_mesh_processing::reverse_face_orientations(working_mesh);
    if (!CGAL::Polygon_mesh_processing::clip(
        a, working_mesh, CGAL::parameters::use_compact_clipper(true),
        CGAL::parameters::use_compact_clipper(true))) {
      return false;
    }
      assert(repair_boolean<EK>(a, false));
    demesh(a);
    return true;
  }
  if (!CGAL::is_closed(a)) {
    Surface_mesh working_mesh(b);
    if (!CGAL::Polygon_mesh_processing::clip(
            a, working_mesh,
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
      Surface_mesh working_mesh;
      buildSurfaceMeshFromManifold(target_manifold, working_mesh);
      if (repair_boolean<EK>(working_mesh)) {
        demesh(working_mesh);
        a = std::move(working_mesh);
        return true;
      } else {
        std::cout << "clip_mesh_by_mesh: Manifold repair failed." << std::endl;
        std::cout << working_mesh << std::endl;
      }
    }
    std::cout << "clip_mesh_by_mesh: Manifold clip failed. Falling back to exact." << std::endl;
  }
#endif
  Surface_mesh working_mesh(b);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
          a, working_mesh, a,
      CGAL::parameters::all_default(), CGAL::parameters::all_default(),
      CGAL::parameters::all_default())) {
    std::cout << "clip_mesh_by_mesh: exact clip is non-manifold." << std::endl;
  }
      assert(repair_boolean<EK>(a, false));
  demesh(a);
  return true;
};
