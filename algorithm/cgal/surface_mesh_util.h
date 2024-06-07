#pragma once

#include <CGAL/Arr_segment_traits_2.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/compute_normal.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/remesh.h>
#include <CGAL/Polygon_mesh_slicer.h>
#include <CGAL/Surface_mesh.h>

#include "arrangement_util.h"
#include "random_util.h"
#include "unit_util.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

template <typename Surface_mesh, typename Plane>
static void PlaneOfSurfaceMeshFacet(const Surface_mesh& mesh,
                                    typename Surface_mesh::Face_index facet,
                                    Plane& plane) {
  const auto h = mesh.halfedge(facet);
  plane =
      Plane{mesh.point(mesh.source(h)), mesh.point(mesh.source(mesh.next(h))),
            mesh.point(mesh.source(mesh.next(mesh.next(h))))};
}

template <typename Plane, typename Surface_mesh>
static bool SomePlaneOfSurfaceMesh(Plane& plane, const Surface_mesh& mesh) {
  for (const auto& facet : mesh.faces()) {
    PlaneOfSurfaceMeshFacet(mesh, facet, plane);
    return true;
  }
  return false;
}

static bool IsPlanarSurfaceMesh(Plane& plane, const Surface_mesh& a) {
  if (CGAL::is_closed(a)) return false;
  if (a.number_of_vertices() < 3) return false;
  if (!SomePlaneOfSurfaceMesh(plane, a)) return false;
  for (const auto& vertex : a.vertices()) {
    if (!plane.has_on(a.point(vertex))) return false;
  }
  return true;
}

template <typename Surface_mesh, typename Plane>
static Plane ensureFacetPlane(
    const Surface_mesh& mesh,
    std::unordered_map<typename Surface_mesh::Face_index, Plane>&
        facet_to_plane,
    std::unordered_set<Plane>& planes,
    typename Surface_mesh::Face_index facet) {
  auto it = facet_to_plane.find(facet);
  if (it == facet_to_plane.end()) {
    Plane facet_plane;
    PlaneOfSurfaceMeshFacet(mesh, facet, facet_plane);
    // We canonicalize the planes so that the 2d projections match.
    auto canonical_plane = planes.find(facet_plane);
    if (canonical_plane == planes.end()) {
      planes.insert(facet_plane);
      facet_to_plane[facet] = facet_plane;
      return facet_plane;
    } else {
      facet_to_plane[facet] = *canonical_plane;
      if (*canonical_plane != facet_plane) {
        std::cout << "QQ/ensureFacetPlane/mismatch" << std::endl;
      }
      return *canonical_plane;
    }
  } else {
    return it->second;
  }
}

template <typename Surface_mesh, typename Vector>
static Vector NormalOfSurfaceMeshFacet(
    const Surface_mesh& mesh, typename Surface_mesh::Face_index facet) {
  const auto h = mesh.halfedge(facet);
  return CGAL::normal(mesh.point(mesh.source(h)),
                      mesh.point(mesh.source(mesh.next(h))),
                      mesh.point(mesh.source(mesh.next(mesh.next(h)))));
}

static EK::Vector_3 estimateTriangleNormals(
    const std::vector<EK::Triangle_3>& triangles) {
  EK::Vector_3 estimate(0, 0, 0);
  for (const EK::Triangle_3& triangle : triangles) {
    estimate +=
        unitVector(CGAL::Polygon_mesh_processing::internal::triangle_normal(
            triangle[0], triangle[1], triangle[2], Kernel()));
  }
  return estimate;
}

static void computeNormalOfSurfaceMesh(
    EK::Vector_3& normal, const CGAL::Surface_mesh<EK::Point_3>& mesh) {
  std::vector<EK::Triangle_3> triangles;
  for (const auto& facet : mesh.faces()) {
    if (mesh.is_removed(facet)) {
      continue;
    }
    const auto h = mesh.halfedge(facet);
    triangles.push_back(EK::Triangle_3(
        mesh.point(mesh.source(h)), mesh.point(mesh.source(mesh.next(h))),
        mesh.point(mesh.source(mesh.next(mesh.next(h))))));
  }
  EK::Plane_3 plane;
  linear_least_squares_fitting_3(triangles.begin(), triangles.end(), plane,
                                 CGAL::Dimension_tag<2>());
  normal = plane.orthogonal_vector();
  if (CGAL::scalar_product(normal, estimateTriangleNormals(triangles)) < 0) {
    normal = -normal;
  }
}

template <typename Kernel, typename Surface_mesh>
static void prepare_selection(
    Surface_mesh& mesh, std::vector<const Surface_mesh*>& selections,
    std::set<typename Surface_mesh::Face_index>& unconstrained_faces,
    std::set<typename Surface_mesh::Vertex_index>& constrained_vertices,
    std::set<typename Surface_mesh::Edge_index>& constrained_edges) {
  // Could these be unordered_set?
  std::set<typename Surface_mesh::Vertex_index> unconstrained_vertices;
  if (selections.size() > 0) {
    for (const Surface_mesh* selection : selections) {
      {
        Surface_mesh working_selection(*selection);
        CGAL::Polygon_mesh_processing::corefine(
            mesh, working_selection, CGAL::parameters::all_default(),
            CGAL::parameters::all_default());
      }
    }
    for (const Surface_mesh* selection : selections) {
      CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(*selection);
      for (typename Surface_mesh::Vertex_index vertex : mesh.vertices()) {
        if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
          // This vertex may be remeshed.
          unconstrained_vertices.insert(vertex);
        }
      }
      for (typename Surface_mesh::Face_index face : mesh.faces()) {
        const typename Surface_mesh::Halfedge_index start = mesh.halfedge(face);
        typename Surface_mesh::Halfedge_index edge = start;
        bool include = true;
        do {
          if (inside(mesh.point(mesh.source(edge))) ==
              CGAL::ON_UNBOUNDED_SIDE) {
            include = false;
            break;
          }
          edge = mesh.next(edge);
        } while (edge != start);
        if (include) {
          unconstrained_faces.insert(face);
        }
      }
    }
  } else {
    for (typename Surface_mesh::Face_index face : mesh.faces()) {
      unconstrained_faces.insert(face);
    }
  }
  // The vertices are always constrained.
  for (typename Surface_mesh::Vertex_index vertex : mesh.vertices()) {
    constrained_vertices.insert(vertex);
  }
  for (typename Surface_mesh::Edge_index edge : mesh.edges()) {
    const typename Surface_mesh::Halfedge_index halfedge = mesh.halfedge(edge);
    const typename Surface_mesh::Vertex_index& source = mesh.source(halfedge);
    const typename Surface_mesh::Vertex_index& target = mesh.target(halfedge);
    if (constrained_vertices.count(source) &&
        constrained_vertices.count(target)) {
      constrained_edges.insert(edge);
    }
  }
}

template <typename Kernel, typename Surface_mesh>
static void remesh(Surface_mesh& mesh,
                   std::vector<const Surface_mesh*>& selections, int iterations,
                   int relaxation_steps, double target_edge_length) {
  std::set<typename Surface_mesh::Face_index> unconstrained_faces;
  std::set<typename Surface_mesh::Vertex_index> constrained_vertices;
  std::set<typename Surface_mesh::Edge_index> constrained_edges;
  prepare_selection<Kernel, Surface_mesh>(mesh, selections, unconstrained_faces,
                                          constrained_vertices,
                                          constrained_edges);
  CGAL::Boolean_property_map<std::set<typename Surface_mesh::Vertex_index>>
      constrained_vertex_map(constrained_vertices);
  CGAL::Boolean_property_map<std::set<typename Surface_mesh::Edge_index>>
      constrained_edge_map(constrained_edges);
  MakeDeterministic();
  CGAL::Polygon_mesh_processing::isotropic_remeshing(
      unconstrained_faces, target_edge_length, mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
          iterations)
          .vertex_point_map(mesh.points())
          .edge_is_constrained_map(constrained_edge_map)
          .number_of_relaxation_steps(relaxation_steps));
}

template <typename Surface_mesh>
static typename Surface_mesh::Vertex_index ensureVertex(
    Surface_mesh& mesh,
    std::map<typename Surface_mesh::Point, typename Surface_mesh::Vertex_index>&
        vertices,
    const typename Surface_mesh::Point& point) {
  auto it = vertices.find(point);
  if (it == vertices.end()) {
    auto new_vertex = mesh.add_vertex(point);
    vertices[point] = new_vertex;
    return new_vertex;
  }
  return it->second;
}

// This handles potentially overlapping facets.
template <typename General_polygon_set_2>
static void PlanarSurfaceMeshFacetsToPolygonSet(
    const EK::Plane_3& plane, const CGAL::Surface_mesh<EK::Point_3>& mesh,
    General_polygon_set_2& set) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef CGAL::Arr_extended_dcel<Traits_2, size_t, size_t, size_t>
      Dcel_with_regions;
  typedef CGAL::Arrangement_2<Traits_2, Dcel_with_regions>
      Arrangement_with_regions_2;

  typedef Traits_2::X_monotone_curve_2 Segment_2;

  std::set<std::vector<EK::FT>> segments;

  for (const auto& facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    if (mesh.is_removed(start)) {
      continue;
    }
    // Do we really need an arrangement here?
    Arrangement_with_regions_2 arrangement;
    typename Surface_mesh::Halfedge_index edge = start;
    do {
      auto source = plane.to_2d(mesh.point(mesh.source(edge)));
      auto target = plane.to_2d(mesh.point(mesh.target(edge)));
      if (source != target) {
        Segment_2 segment{source, target};
        insert(arrangement, segment);
      }
      edge = mesh.next(edge);
    } while (edge != start);
    // The arrangement shouldn't produce polygons with holes, so this might be
    // simplified.
    // FIX: This is probably completely wrong.
    std::vector<CGAL::Polygon_with_holes_2<EK>> polygons;
    convertArrangementToPolygonsWithHolesEvenOdd(arrangement, polygons);
    for (const auto& polygon : polygons) {
      set.join(polygon);
    }
  }
}

template <typename Polygons_with_holes_2>
static bool SurfaceMeshSectionToPolygonsWithHoles(
    const CGAL::Surface_mesh<EK::Point_3>& mesh, const EK::Plane_3& plane,
    Polygons_with_holes_2& pwhs) {
  typedef CGAL::Arr_segment_traits_2<EK> Traits_2;
  typedef CGAL::Arr_extended_dcel<Traits_2, size_t, size_t, size_t>
      Dcel_with_regions;
  typedef CGAL::Arrangement_2<Traits_2, Dcel_with_regions>
      Arrangement_with_regions_2;

  CGAL::Polygon_mesh_slicer<Surface_mesh, Kernel> slicer(mesh);
  Arrangement_with_regions_2 arrangement;
  Polylines polylines;
  slicer(plane, std::back_inserter(polylines));
  for (const auto& polyline : polylines) {
    std::size_t length = polyline.size();
    if (length < 3 || polyline.front() != polyline.back()) {
      continue;
    }
    for (std::size_t nth = 1; nth < length; nth++) {
      Point_2 source = plane.to_2d(polyline[nth - 1]);
      Point_2 target = plane.to_2d(polyline[nth]);
      if (source == target) {
        continue;
      }
      Segment_2 segment(source, target);
      insert(arrangement, segment);
    }
  }
  if (!convertArrangementToPolygonsWithHolesEvenOdd(arrangement, pwhs)) {
    std::cout << "QQ/SurfaceMeshSectionToPolygonsWithHoles/failure: "
              << std::setprecision(20) << std::endl;
    return false;
  }
  return true;
}
