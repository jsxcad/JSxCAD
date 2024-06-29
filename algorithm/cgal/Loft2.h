#include <CGAL/AABB_traits.h>
#include <CGAL/AABB_tree.h>
#include <CGAL/AABB_triangle_primitive.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/polygon_mesh_to_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/polygon_soup_to_polygon_mesh.h>
#include <CGAL/Polygon_mesh_processing/repair_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/triangulate_faces.h>
#include <CGAL/Polygon_mesh_processing/triangulate_hole.h>

#include <algorithm>
#include <random>

#include "Geometry.h"
#include "demesh_util.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

static bool loft_between_cycles(std::vector<EK::Segment_3>& lower_segments,
                                std::vector<EK::Segment_3>& upper_segments,
                                std::vector<EK::Point_3>& points,
                                std::vector<std::vector<size_t>>& faces) {
  // Each segment forms a triangle with one point in the other set.
  // The triangles must not intersect.
  // The polygon soup must be manifold.

  auto score_triangle = [](const EK::Point_3& p0, const EK::Point_3& p1,
                           const EK::Point_3& p2) {
    // If this is flat it should be 180.
    const auto a = CGAL::abs(CGAL::approximate_angle(p0, p1, p2) - 180);
    const auto b = CGAL::abs(CGAL::approximate_angle(p2, p0, p1) - 180);
    const auto c = CGAL::abs(CGAL::approximate_angle(p1, p2, p0) - 180);
    auto minimum_angle = CGAL::min(a, CGAL::min(b, c));
    return minimum_angle;
  };

  auto score_candidate = [&](const EK::Segment_3& segment,
                             const EK::Point_3& point, EK::FT& best_score) {
    auto score = 1000 / (CGAL::sqrt(to_double(
                             CGAL::squared_distance(segment.source(), point))) +
                         CGAL::sqrt(to_double(
                             CGAL::squared_distance(segment.target(), point))));
    // auto score = score_triangle(segment.source(), point, segment.target());
    if (score > best_score) {
      best_score = score;
      return true;
    } else {
      return false;
    }
  };

  auto find_best_candidate = [&](size_t upper_begin, size_t upper_end,
                                 size_t& best_upper, size_t lower_begin,
                                 size_t lower_end, size_t& best_lower,
                                 bool& is_base_upper, EK::FT& best_score) {
    bool has_candidate = false;
    for (size_t upper = upper_begin; upper < upper_end; upper++) {
      for (size_t lower = lower_begin; lower <= lower_end; lower++) {
        if (score_candidate(upper_segments[upper],
                            lower_segments[lower].source(), best_score)) {
          best_upper = upper;
          best_lower = lower;
          is_base_upper = true;
          has_candidate = true;
        }
      }
    }
    for (size_t lower = lower_begin; lower < lower_end; lower++) {
      for (size_t upper = upper_begin; upper <= upper_end; upper++) {
        if (score_candidate(lower_segments[lower],
                            upper_segments[upper].source(), best_score)) {
          best_upper = upper;
          best_lower = lower;
          is_base_upper = false;
          has_candidate = true;
        }
      }
    }
    return has_candidate;
  };

  auto add_face_from_points = [&](const EK::Point_3& p1, const EK::Point_3& p2,
                                  const EK::Point_3& p3) {
    size_t base = points.size();
    faces.push_back({base + 0, base + 1, base + 2});
    points.push_back(p1);
    points.push_back(p2);
    points.push_back(p3);
  };

  auto add_face = [&](size_t upper, size_t lower, bool is_base_upper) {
    auto base = is_base_upper ? upper_segments[upper] : lower_segments[lower];
    auto tip = is_base_upper ? lower_segments[lower].source()
                             : upper_segments[upper].source();
    add_face_from_points(base.source(), base.target(), tip);
  };

  // Find a starting point.
  auto walk = [&](size_t upper_begin, size_t upper_end, size_t lower_begin,
                  size_t lower_end, auto& walk, size_t depth) {
    size_t upper;
    size_t lower;
    bool is_base_upper;
    EK::FT score = 0;
    if (!find_best_candidate(upper_begin, upper_end, upper, lower_begin,
                             lower_end, lower, is_base_upper, score)) {
      // We should really check to see if there are any open segments.
      return true;
    }

    add_face(upper, lower, is_base_upper);

    // Needs to detect null slices properly.
    if (is_base_upper) {
      // Split so that upper is excluded, but lower is not.
      return walk(upper_begin, upper, lower_begin, lower, walk, depth + 1) &&
             walk(upper + 1, upper_end, lower, lower_end, walk, depth + 1);
    } else {
      return walk(upper_begin, upper, lower_begin, lower, walk, depth + 1) &&
             walk(upper, upper_end, lower + 1, lower_end, walk, depth + 1);
    }
  };

  // TODO: Find the best initial candidate, then rotate so that the split is at
  // the start. Then add the overflow segment.
  {
    size_t upper;
    size_t lower;
    bool is_base_upper;
    EK::FT score = 0;
    if (!find_best_candidate(0, upper_segments.size() - 1, upper, 0,
                             lower_segments.size() - 1, lower, is_base_upper,
                             score)) {
      std::cout << "no candidates" << std::endl;
      return true;
    }
    upper_segments.pop_back();
    lower_segments.pop_back();
    std::rotate(upper_segments.begin(), upper_segments.begin() + upper,
                upper_segments.end());
    std::rotate(lower_segments.begin(), lower_segments.begin() + lower,
                lower_segments.end());
    upper_segments.emplace_back(upper_segments.back().target(),
                                upper_segments.front().source());
    lower_segments.emplace_back(lower_segments.back().target(),
                                lower_segments.front().source());
  }

  // We'll end up repeating the first selection, but that's ok for now.

  return walk(0, upper_segments.size() - 1, 0, lower_segments.size() - 1, walk,
              0);
}

static void loft_between_layers(
    std::vector<std::vector<EK::Segment_3>>& lower_cycles,
    std::vector<std::vector<EK::Segment_3>>& upper_cycles,
    std::vector<EK::Point_3>& points, std::vector<std::vector<size_t>>& faces) {
  // This is, of course, wrong.
  for (size_t lower = 0; lower < lower_cycles.size(); lower++) {
    if (lower < upper_cycles.size()) {
      loft_between_cycles(lower_cycles[lower], upper_cycles[lower], points,
                          faces);
    }
  };
}

static void build_mesh_from_triangles(std::vector<EK::Triangle_3>& triangles,
                                      CGAL::Surface_mesh<EK::Point_3>& mesh) {
  std::vector<Kernel::Point_3> vertices;
  std::vector<std::vector<std::size_t>> faces;

  for (const auto& triangle : triangles) {
    std::vector<std::size_t> face_indices;
    face_indices.push_back(vertices.size());
    vertices.push_back(triangle[2]);
    face_indices.push_back(vertices.size());
    vertices.push_back(triangle[1]);
    face_indices.push_back(vertices.size());
    vertices.push_back(triangle[0]);
    faces.push_back(face_indices);
  }

  CGAL::Polygon_mesh_processing::orient_polygon_soup(vertices, faces);
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(vertices, faces,
                                                              mesh);
}

static int Loft(Geometry* geometry, bool close) {
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;

  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  std::vector<std::vector<std::vector<EK::Segment_3>>> positive_layers;
  std::vector<std::vector<std::vector<EK::Segment_3>>> negative_layers;

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        std::vector<std::vector<EK::Segment_3>> cycles;
        auto& mesh = geometry->mesh(nth);
        std::vector<typename Surface_mesh::halfedge_index> border_cycles;
        CGAL::Polygon_mesh_processing::extract_boundary_cycles(
            mesh, std::back_inserter(border_cycles));
        for (const auto& start : border_cycles) {
          std::vector<EK::Segment_3> cycle;
          Surface_mesh::Halfedge_index edge = start;
          do {
            cycle.emplace_back(mesh.point(mesh.source(edge)),
                               mesh.point(mesh.target(edge)));
            edge = mesh.next(edge);
          } while (edge != start);
          cycle.emplace_back(cycle.back().target(), cycle.front().source());
          cycles.push_back(std::move(cycle));
        }
        // Close the loop.
        positive_layers.push_back(std::move(cycles));
        negative_layers.push_back({});
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        std::vector<std::vector<EK::Segment_3>> positive_cycles;
        std::vector<std::vector<EK::Segment_3>> negative_cycles;
        for (auto& pwh : geometry->pwh(nth)) {
          {
            std::vector<EK::Segment_3> cycle;
            polygon_to_segments(geometry->plane(nth), pwh.outer_boundary(),
                                cycle);
            cycle.emplace_back(cycle.back().target(), cycle.front().source());
            positive_cycles.push_back(std::move(cycle));
          }
          for (auto hole = pwh.holes_begin(); hole != pwh.holes_end(); ++hole) {
            std::vector<EK::Segment_3> cycle;
            polygon_to_segments(geometry->plane(nth), *hole, cycle);
            cycle.emplace_back(cycle.back().target(), cycle.front().source());
            negative_cycles.push_back(std::move(cycle));
          }
        }
        positive_layers.push_back(std::move(positive_cycles));
        negative_layers.push_back(std::move(negative_cycles));
        break;
      }
      default: {
        break;
      }
    }
  }
  if (positive_layers.size() < 2) {
    std::cout << "Loft: needs at least two positive layers." << std::endl;
    return STATUS_EMPTY;
  }

  std::vector<EK::Point_3> positive_points;
  std::vector<std::vector<size_t>> positive_faces;
  for (size_t nth = 0; nth + 1 < positive_layers.size(); nth++) {
    loft_between_layers(positive_layers[nth], positive_layers[nth + 1],
                        positive_points, positive_faces);
  }

  std::vector<EK::Point_3> negative_points;
  std::vector<std::vector<size_t>> negative_faces;
  for (size_t nth = 0; nth + 1 < negative_layers.size(); nth++) {
    loft_between_layers(negative_layers[nth], negative_layers[nth + 1],
                        negative_points, negative_faces);
  }

  auto build_mesh = [&](std::vector<EK::Point_3>& points,
                        std::vector<std::vector<size_t>>& faces, bool close,
                        Surface_mesh& mesh) {
    CGAL::Polygon_mesh_processing::repair_polygon_soup(points, faces);

    // Unfortunately this may be inverted.
    // If we close the mesh it will be re-oriented to bound the volume.
    // Otherwise the orientation is accidental.
    // FIX: Could we intersect the surface with a ray to figure out the winding
    // order?
    CGAL::Polygon_mesh_processing::orient_polygon_soup(points, faces);

    CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, faces,
                                                                mesh);

    if (close) {
      std::vector<typename Surface_mesh::halfedge_index> border_cycles;
      CGAL::Polygon_mesh_processing::extract_boundary_cycles(
          mesh, std::back_inserter(border_cycles));
      for (const Surface_mesh::Halfedge_index edge : border_cycles) {
        std::vector<Surface_mesh::Face_index> faces;
        CGAL::Polygon_mesh_processing::triangulate_hole(
            mesh, edge, std::back_inserter(faces),
            CGAL::parameters::use_2d_constrained_delaunay_triangulation(false));
      }
      if (CGAL::is_closed(mesh)) {
        CGAL::Polygon_mesh_processing::orient_to_bound_a_volume(mesh);
      }
    }
  };

  Surface_mesh positive_mesh;
  build_mesh(positive_points, positive_faces, close, positive_mesh);

  Surface_mesh negative_mesh;
  build_mesh(negative_points, negative_faces, close, negative_mesh);

  if (CGAL::is_closed(positive_mesh)) {
    if (!cut_mesh_by_mesh(positive_mesh, negative_mesh)) {
      return STATUS_ZERO_THICKNESS;
    }
  } else {
    CGAL::Polygon_mesh_processing::reverse_face_orientations(positive_mesh);
    positive_mesh.join(negative_mesh);
  }

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setIdentityTransform(target);
  demesh(positive_mesh);
  geometry->mesh(target) = std::move(positive_mesh);
  return STATUS_OK;
}
