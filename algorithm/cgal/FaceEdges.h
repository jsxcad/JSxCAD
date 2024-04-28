#pragma once

#include <CGAL/Arr_segment_traits_2.h>
#include <CGAL/Arrangement_2.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_2.h>

#include "Geometry.h"
#include "hash_util.h"
#include "surface_mesh_util.h"

template <typename Triangle_mesh, typename K>
static bool inside_any(
    const Segment& segment,
    std::vector<CGAL::Side_of_triangle_mesh<Triangle_mesh, K>>& selections) {
  for (const auto& selection : selections) {
    if (selection(segment.source()) != CGAL::ON_UNBOUNDED_SIDE &&
        selection(segment.target()) != CGAL::ON_UNBOUNDED_SIDE) {
      return true;
    }
  }
  return false;
}

static int FaceEdges(Geometry* geometry, int count) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  typedef CGAL::Arr_segment_traits_2<EK> Traits_2;
  typedef CGAL::Arr_extended_dcel<Traits_2, size_t, size_t, size_t>
      Dcel_with_regions;
  typedef CGAL::Arrangement_2<Traits_2, Dcel_with_regions>
      Arrangement_with_regions_2;

  int size = geometry->size();

  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<CGAL::Side_of_triangle_mesh<Surface_mesh, EK>> selections;
  for (int nth = count; nth < size; nth++) {
    if (geometry->is_mesh(nth)) {
      selections.emplace_back(geometry->mesh(nth));
    }
  }

  for (int nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        int face_target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
        geometry->plane(face_target) = geometry->plane(nth);
        geometry->pwh(face_target) = geometry->pwh(nth);
        int edge_target = geometry->add(GEOMETRY_EDGES);
        const auto& plane = geometry->plane(nth);
        auto normal = unitVector(plane.orthogonal_vector());
        for (const auto& polygon : geometry->pwh(nth)) {
          for (auto s2 = polygon.outer_boundary().edges_begin();
               s2 != polygon.outer_boundary().edges_end(); ++s2) {
            EK::Segment_3 segment(plane.to_3d(s2->source()),
                                  plane.to_3d(s2->target()));
            if (selections.empty() || inside_any(segment, selections)) {
              geometry->addEdge(edge_target,
                                Edge(segment, segment.source() + normal));
            }
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto s2 = hole->edges_begin(); s2 != hole->edges_end(); ++s2) {
              EK::Segment_3 segment(plane.to_3d(s2->source()),
                                    plane.to_3d(s2->target()));
              if (selections.empty() || inside_any(segment, selections)) {
                geometry->addEdge(edge_target,
                                  Edge(segment, segment.source() + normal));
              }
            }
          }
        }
        geometry->setTransform(face_target, geometry->transform(nth));
        geometry->setTransform(edge_target, geometry->transform(nth));
        break;
      }
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        int all_edge_target = geometry->add(GEOMETRY_EDGES);

        std::unordered_set<EK::Plane_3> planes;
        std::unordered_map<Surface_mesh::Face_index, EK::Plane_3>
            facet_to_plane;
        CGAL::Unique_hash_map<Surface_mesh::Face_index,
                              Surface_mesh::Face_index>
            facet_to_face;

        // Initialize the face map.
        for (const auto& facet : mesh.faces()) {
          facet_to_face[facet] = facet;
        }

        // FIX: Make this more efficient.
        for (const auto& facet : mesh.faces()) {
          const auto& start = mesh.halfedge(facet);
          if (mesh.is_removed(start)) {
            continue;
          }
          const auto facet_plane =
              ensureFacetPlane(mesh, facet_to_plane, planes, facet);
          auto edge = start;
          do {
            EK::Plane_3 bisecting_plane;
            EK::Vector_3 edge_normal;
            bool corner = false;
            const auto& opposite_facet = mesh.face(mesh.opposite(edge));
            if (opposite_facet == mesh.null_face()) {
              bisecting_plane = facet_plane;
              corner = true;
            } else {
              const auto opposite_facet_plane = ensureFacetPlane(
                  mesh, facet_to_plane, planes, opposite_facet);
              if (facet_plane != opposite_facet_plane) {
                auto bisecting_plane =
                    CGAL::bisector(facet_plane, opposite_facet_plane);
                edge_normal = unitVector(bisecting_plane.orthogonal_vector());
                corner = true;
              } else {
                // Set up an equivalence tree toward the lowest id.
                if (facet_to_face[facet] < facet_to_face[opposite_facet]) {
                  for (const auto& f : mesh.faces()) {
                    if (facet_to_face[f] == facet_to_face[opposite_facet]) {
                      facet_to_face[f] = facet_to_face[facet];
                    }
                  }
                } else {
                  for (const auto& f : mesh.faces()) {
                    if (facet_to_face[f] == facet_to_face[facet]) {
                      facet_to_face[f] = facet_to_face[opposite_facet];
                    }
                  }
                }
              }
            }
            if (corner) {
              auto s = mesh.point(mesh.source(edge));
              auto t = mesh.point(mesh.target(edge));
              EK::Segment_3 segment = Segment(s, t);

              if (selections.empty() || inside_any(segment, selections)) {
                geometry->addEdge(all_edge_target,
                                  Edge(segment, s + edge_normal, int(facet)));
              }
            }
            const auto& next = mesh.next(edge);
            edge = next;
          } while (edge != start);
        }

        std::set<int> face_ids;

        // Update the edges with their canonical face affiliation.
        for (auto& edge : geometry->edges(all_edge_target)) {
          edge.face_id =
              int(facet_to_face[Surface_mesh::Face_index(edge.face_id)]);
          face_ids.insert(edge.face_id);
        }

        // Build edges / polygons pairs.
        for (auto& face_id : face_ids) {
          int face_target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          int edge_target = geometry->add(GEOMETRY_EDGES);
          const EK::Plane_3 plane =
              unitPlane<EK>(facet_to_plane[Surface_mesh::Face_index(face_id)]);
          auto disorientation = disorient_plane_along_z(plane);

          Arrangement_with_regions_2 arrangement;
          for (auto& edge : geometry->edges(all_edge_target)) {
            if (edge.face_id == face_id) {
              insert(arrangement,
                     EK::Segment_2(plane.to_2d(edge.segment.source()),
                                   plane.to_2d(edge.segment.target())));
              geometry->addEdge(edge_target, edge);
            }
          }
          std::vector<CGAL::Polygon_with_holes_2<EK>> pwhs;
          convertArrangementToPolygonsWithHolesEvenOdd(arrangement, pwhs);
          geometry->pwh(face_target) = std::move(pwhs);
          geometry->setTransform(edge_target, disorientation.inverse());
          geometry->setTransform(face_target, disorientation.inverse());
          geometry->plane(face_target) = plane;
        }

        geometry->setType(all_edge_target, GEOMETRY_EMPTY);
        break;
      }
      default: {
        geometry->setType(nth, GEOMETRY_EMPTY);
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
