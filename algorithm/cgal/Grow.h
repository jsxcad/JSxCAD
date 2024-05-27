#pragma once

#include <CGAL/Constrained_Delaunay_triangulation_2.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/compute_normal.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/transform.h>
#include <CGAL/Polygon_triangulation_decomposition_2.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/boost/graph/generators.h>
#include <CGAL/connect_holes.h>
#include <CGAL/convex_hull_3.h>
#include <CGAL/mark_domain_in_triangulation.h>
#include <CGAL/partition_2.h>

#include "Geometry.h"
#include "manifold_util.h"
#include "transform_util.h"

static int Grow(Geometry* geometry, size_t count) {
  try {
    typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputPointsToOutputPoints();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->transformToAbsoluteFrame();
    geometry->convertPlanarMeshesToPolygons();

    std::vector<EK::Point_3> tool_points;

    auto add_hull = [&](size_t nth, const std::vector<EK::Point_3>& points) {
      size_t target = geometry->add(GEOMETRY_MESH);
      CGAL::convex_hull_3(points.begin(), points.end(), geometry->mesh(target));
      geometry->origin(target) = nth;
    };

    // For now we assume the tool is convex.
    for (size_t nth = count; nth < size; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_MESH:
          to_points<EK>(geometry->mesh(nth), tool_points);
          break;
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          const auto& plane = geometry->plane(nth);
          for (const auto& pwh : geometry->pwh(nth)) {
            to_points<EK>(pwh, plane, tool_points);
          }
          break;
        }
        case GEOMETRY_SEGMENTS:
          for (const auto& segment : geometry->segments(nth)) {
            to_points<EK>(segment, tool_points);
          }
          break;
        case GEOMETRY_POINTS:
          for (const auto& point : geometry->points(nth)) {
            to_points<EK>(point, tool_points);
          }
          break;
      }
    }

    for (size_t nth = 0; nth < count; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          typedef CGAL::Nef_polyhedron_3<Epeck_kernel> Nef;
          auto& mesh = geometry->mesh(nth);

          Nef nef(mesh);

          try {
            CGAL::convex_decomposition_3(nef);
          } catch (const std::exception& e) {
            throw;
          }

          auto ci = nef.volumes_begin();
          if (ci == nef.volumes_end()) {
            // The mesh was empty.
            break;
          }

          EK::Point_3 zero(0, 0, 0);

          if (++ci == nef.volumes_end()) {
            // The mesh is already completely convex.
            std::vector<EK::Point_3> points;
            for (const auto& vertex : mesh.vertices()) {
              const auto& offset = mesh.point(vertex) - zero;
              for (const auto& point : tool_points) {
                points.push_back(point + offset);
              }
            }
            add_hull(nth, points);
          } else {
            mesh.clear();
            // Split out the convex parts.
            for (; ci != nef.volumes_end(); ++ci) {
              CGAL::Polyhedron_3<Epeck_kernel> shell;
              nef.convert_inner_shell_to_polyhedron(ci->shells_begin(), shell);
              std::vector<EK::Point_3> points;
              for (const auto& point : shell.points()) {
                const auto& offset = point - zero;
                for (const auto& point : tool_points) {
                  points.push_back(point + offset);
                }
              }
              add_hull(nth, points);
            }
          }
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
        case GEOMETRY_POINTS: {
          CGAL::Surface_mesh<EK::Point_3> tool;
          CGAL::convex_hull_3(tool_points.begin(), tool_points.end(), tool);
          for (const auto& point : geometry->points(nth)) {
            size_t target = geometry->add(GEOMETRY_MESH);
            geometry->mesh(target) = tool;
            CGAL::Polygon_mesh_processing::transform(translate_to(point),
                                                     geometry->mesh(target));
          }
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          EK::Point_3 zero(0, 0, 0);
          for (const auto& segment : geometry->segments(nth)) {
            const EK::Vector_3 source_offset = segment.source() - zero;
            const EK::Vector_3 target_offset = segment.target() - zero;
            std::vector<EK::Point_3> points;
            for (const auto& point : tool_points) {
              points.push_back(point + source_offset);
              points.push_back(point + target_offset);
            }
            add_hull(nth, points);
          }
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          EK::Point_3 zero(0, 0, 0);
          CGAL::Polygon_triangulation_decomposition_2<EK> triangulator;
          // We need to copy plane to survive vector reallocation due to
          // geometry->add().
          const auto plane = geometry->plane(nth);
          for (const auto& pwh : geometry->pwh(nth)) {
            if (pwh.holes_begin() == pwh.holes_end()) {
              // We can use optimal partitioning if there are no holes.
              typedef CGAL::Partition_traits_2<EK> Traits;
              typedef Traits::Polygon_2 Polygon_2;
              typedef std::list<Polygon_2> Polygon_list;
              Polygon_list partition_polys;
              // We invest more here to minimize unions below.
              CGAL::optimal_convex_partition_2(
                  pwh.outer_boundary().vertices_begin(),
                  pwh.outer_boundary().vertices_end(),
                  std::back_inserter(partition_polys));
              for (const auto& polygon : partition_polys) {
                std::vector<EK::Point_3> points;
                for (const auto& point_2 : polygon) {
                  const auto point = plane.to_3d(point_2);
                  const auto offset = point - zero;
                  for (const auto& tool_point : tool_points) {
                    points.push_back(tool_point + offset);
                  }
                }
                add_hull(nth, points);
              }
            } else {
              typedef CGAL::Exact_predicates_tag Itag;
              typedef CGAL::Constrained_Delaunay_triangulation_2<
                  EK, CGAL::Default, Itag>
                  CDT;
              CDT cdt;
              cdt.insert_constraint(pwh.outer_boundary().vertices_begin(),
                                    pwh.outer_boundary().vertices_end(), true);
              for (auto hole = pwh.holes_begin(); hole != pwh.holes_end();
                   ++hole) {
                cdt.insert_constraint(hole->vertices_begin(),
                                      hole->vertices_end(), true);
              }
              std::unordered_map<CDT::Face_handle, bool> in_domain_map;
              boost::associative_property_map<
                  std::unordered_map<CDT::Face_handle, bool>>
                  in_domain(in_domain_map);
              CGAL::mark_domain_in_triangulation(cdt, in_domain);
              for (auto face : cdt.finite_face_handles()) {
                if (!get(in_domain, face)) {
                  continue;
                }
                std::vector<EK::Point_3> points;
                auto add_point = [&](const EK::Point_2& p2) {
                  auto offset = plane.to_3d(p2) - zero;
                  for (const auto& tool_point : tool_points) {
                    points.push_back(tool_point + offset);
                  }
                };
                add_point(face->vertex(0)->point());
                add_point(face->vertex(1)->point());
                add_point(face->vertex(2)->point());
                add_hull(nth, points);
              }
            }
          }
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
      }
    }

    geometry->removeEmptyMeshes();
    geometry->convertPlanarMeshesToPolygons();
    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "Grow: " << e.what() << std::endl;
    throw;
  }
}
