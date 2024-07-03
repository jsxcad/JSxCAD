#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/extrude.h>
#include <CGAL/Polygon_mesh_processing/measure.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polygon_mesh_processing/triangulate_faces.h>
#include <CGAL/Surface_mesh.h>

#include "Geometry.h"
#include "surface_mesh_util.h"

template <typename MAP>
struct Project {
  Project(MAP map, EK::Vector_3 vector) : map(map), vector(vector) {}

  template <typename VD, typename T>
  void operator()(const T&, VD vd) const {
    put(map, vd, get(map, vd) + vector);
  }

  MAP map;
  EK::Vector_3 vector;
};

static int Extrude(Geometry* geometry, size_t count) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;

  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputPointsToOutputPoints();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  typedef typename boost::property_map<CGAL::Surface_mesh<EK::Point_3>,
                                       CGAL::vertex_point_t>::type VPMap;

  const auto top = geometry->transform(count);
  const auto bottom = geometry->transform(count + 1);

  auto up = EK::Point_3(0, 0, 0).transform(top) - EK::Point_3(0, 0, 0);
  auto down = EK::Point_3(0, 0, 0).transform(bottom) - EK::Point_3(0, 0, 0);

  if (up != EK::Vector_3(0, 0, 0) || down != EK::Vector_3(0, 0, 0)) {
    for (size_t nth = 0; nth < size; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          const auto& mesh = geometry->mesh(nth);
          if (CGAL::is_closed(mesh) || CGAL::is_empty(mesh)) {
            // TODO: Support extrusion of an upper envelope of a solid.
            continue;
          }
          // No protection against self-intersection.
          auto extruded_mesh = std::make_unique<Surface_mesh>();
          Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), up);
          Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), down);
          CGAL::Polygon_mesh_processing::extrude_mesh(mesh, *extruded_mesh,
                                                      bottom, top);
          CGAL::Polygon_mesh_processing::triangulate_faces(*extruded_mesh);
          EK::FT volume = CGAL::Polygon_mesh_processing::volume(
              *extruded_mesh, CGAL::parameters::all_default());
          if (volume == 0) {
            std::cout << "Extrude/zero-volume" << std::endl;
            continue;
          } else if (volume < 0) {
            CGAL::Polygon_mesh_processing::reverse_face_orientations(
                *extruded_mesh);
          }
          geometry->setMesh(nth, extruded_mesh);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          Surface_mesh flat_mesh;
          std::map<Surface_mesh::Point, Surface_mesh::Vertex_index> vertex_map;
          if (!PolygonsWithHolesToSurfaceMesh(geometry->plane(nth),
                                              geometry->pwh(nth), flat_mesh,
                                              vertex_map)) {
            std::cout << "Conversion of polygons to mesh failed" << std::endl;
            continue;
          }
          if (CGAL::is_empty(flat_mesh)) {
            std::cout << "Conversion of polygons produced empty mesh"
                      << std::endl;
            continue;
          }
          if (CGAL::is_closed(flat_mesh)) {
            std::cout << "Conversion of polygons produced closed mesh"
                      << std::endl;
            continue;
          }
          auto extruded_mesh = std::make_unique<Surface_mesh>();
          Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), up);
          Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), down);
          CGAL::Polygon_mesh_processing::extrude_mesh(flat_mesh, *extruded_mesh,
                                                      bottom, top);
          CGAL::Polygon_mesh_processing::triangulate_faces(*extruded_mesh);
          EK::FT volume = CGAL::Polygon_mesh_processing::volume(
              *extruded_mesh, CGAL::parameters::all_default());
          if (volume == 0) {
            std::cout << "Extrude/zero-volume" << std::endl;
            continue;
          } else if (volume < 0) {
            CGAL::Polygon_mesh_processing::reverse_face_orientations(
                *extruded_mesh);
          }
          geometry->setType(nth, GEOMETRY_MESH);
          geometry->setMesh(nth, extruded_mesh);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          typedef std::map<EK::Point_3,
                           CGAL::Surface_mesh<EK::Point_3>::Vertex_index>
              Vertex_map;
          Vertex_map vertices;
          // FIX: Group polygons by common plane.
          for (const auto& segment : geometry->segments(nth)) {
            size_t target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
            geometry->origin(target) = nth;
            auto& pwh = geometry->pwh(target);
            const auto& s = segment.source();
            const auto& t = segment.target();
            auto a = s + down;
            auto b = t + down;
            auto c = t + up;
            auto d = s + up;
            EK::Plane_3 plane(a, b, c);
            geometry->plane(target) = plane;
            CGAL::Polygon_2<EK> polygon;
            polygon.push_back(plane.to_2d(a));
            polygon.push_back(plane.to_2d(b));
            polygon.push_back(plane.to_2d(c));
            polygon.push_back(plane.to_2d(d));
            pwh.emplace_back(std::move(polygon));
          }
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
        case GEOMETRY_POINTS: {
          auto& segments = geometry->segments(nth);
          for (const auto& point : geometry->points(nth)) {
            segments.emplace_back(point + down, point + up);
          }
          geometry->setType(nth, GEOMETRY_SEGMENTS);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
