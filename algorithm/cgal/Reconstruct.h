#pragma once

#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/GLPK_mixed_integer_program_traits.h>
#include <CGAL/IO/read_points.h>
#include <CGAL/Polygon_mesh_processing/triangulate_faces.h>
#include <CGAL/Polygonal_surface_reconstruction.h>
#include <CGAL/Shape_detection/Efficient_RANSAC.h>
#include <CGAL/Shape_regularization/regularize_planes.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/centroid.h>
#include <CGAL/property_map.h>

#include "Geometry.h"

static int Reconstruct(Geometry* geometry, double offset) {
  typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;
  typedef CGAL::Surface_mesh<IK::Point_3> Epick_surface_mesh;
  try {
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->transformToAbsoluteFrame();

    for (size_t nth = 0; nth < size; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_MESH: {
          typedef boost::tuple<IK::Point_3, IK::Vector_3, int> PNI;
          typedef CGAL::Nth_of_tuple_property_map<0, PNI> Point_map;
          typedef CGAL::Nth_of_tuple_property_map<1, PNI> Normal_map;
          typedef CGAL::Nth_of_tuple_property_map<2, PNI> Plane_id_map;
          typedef std::vector<PNI> Point_vector;

          const Epick_surface_mesh& mesh = geometry->epick_mesh(nth);
          Point_vector points;
          std::unordered_map<Epick_surface_mesh::Face_index, int> facet_index;
          std::vector<int> facet_plane;
          std::vector<IK::Plane_3> planes;
          std::vector<IK::Plane_3> regulated_planes;
          std::vector<int> point_plane_index;
          std::vector<int> plane_indices;
          // FIX: number_of_faces might not equal to the maximum facet value.
          facet_plane.reserve(mesh.number_of_faces());
          std::unordered_map<Epick_surface_mesh::Face_index, IK::Plane_3>
              plane_by_facet;
          std::unordered_set<IK::Plane_3> unique_planes;
          for (const auto& facet : mesh.faces()) {
            IK::Plane_3 plane =
                ensureFacetPlane(mesh, plane_by_facet, unique_planes, facet);
            // PlaneOfSurfaceMeshFacet(mesh, facet, plane);
            plane = unitPlane<Epick_kernel>(plane);
            auto tx = translate(unitVector(plane.orthogonal_vector()) * offset);
            plane = plane.transform(tx);
            size_t plane_index = planes.size();
            plane_indices.push_back(plane_index);
            // These will remain original.
            planes.push_back(plane);
            // These will be regulated.
            regulated_planes.push_back(plane);

            auto a = mesh.halfedge(facet);
            auto b = mesh.next(a);
            auto c = mesh.next(b);
            auto center = CGAL::centroid(mesh.point(mesh.source(a)),
                                         mesh.point(mesh.source(b)),
                                         mesh.point(mesh.source(c)))
                              .transform(tx);
            // A centroid xor corners is insufficient.
            // A centroid and corners are sufficient for reconstruction.
            // Presumably the three midpoints of the centroid and each corner
            // would also work.
            // Let's try a tight cluster at the center of the face.
            points.emplace_back(center, plane.orthogonal_vector(), plane_index);
            point_plane_index.push_back(plane_index);

            points.emplace_back(center + (unitVector(plane.base1()) * 0.01),
                                plane.orthogonal_vector(), plane_index);
            point_plane_index.push_back(plane_index);

            points.emplace_back(center + (unitVector(plane.base2()) * 0.01),
                                plane.orthogonal_vector(), plane_index);
            point_plane_index.push_back(plane_index);
          }

          Point_map point_map;

          struct Plane_range
              : public CGAL::Iterator_range<
                    typename std::vector<IK::Plane_3>::const_iterator> {
            typedef CGAL::Iterator_range<
                typename std::vector<IK::Plane_3>::const_iterator>
                Base;
            explicit Plane_range(std::vector<IK::Plane_3>& planes)
                : Base(make_range(planes.begin(), planes.end())) {}
          };

          CGAL::Random_access_property_map facet_plane_map(planes);
          CGAL::Random_access_property_map regulated_facet_plane_map(
              regulated_planes);

#if 1
          CGAL::Shape_regularization::Planes::regularize_planes(
              points, point_map, plane_indices, /* plane index to plane */
              regulated_facet_plane_map,        /* plane_map = facet to plane */
              CGAL::Random_access_property_map(
                  point_plane_index), /* point index to plane index */
              /*regularize_parallelism=*/true,
              /*regularize_orthogonality=*/true,
              /*regularize_coplanarity=*/true,
              /*regularize_axis_symmetry=*/true,
              /*tolerance_angle=*/Epick_kernel::FT(25),
              /*tolerance_coplanarity=*/Epick_kernel::FT(1) /
                  Epick_kernel::FT(100));
#endif

          // regularize_planes does not move the points, so we need to do this
          // ourselves.
          std::unordered_map<IK::Plane_3, int> regulated_plane_index;
          for (auto& [point, normal, plane_id] : points) {
            const auto& plane = planes[plane_id];
            const auto& regulated_plane = regulated_planes[plane_id];
            // Deduplicate regulated planes.
            for (int nth = 0; nth < plane_id; nth++) {
              if (regulated_planes[nth] == regulated_plane) {
                plane_id = nth;
                break;
              }
            }
            // Remap the point to the regulated plane.
            auto regulated_point = regulated_plane.to_3d(plane.to_2d(point));
            normal = regulated_plane.orthogonal_vector();
            point = regulated_point;
          }

          typedef CGAL::GLPK_mixed_integer_program_traits<double> MIP_Solver;
          typedef CGAL::Polygonal_surface_reconstruction<Epick_kernel>
              Polygonal_surface_reconstruction;

          for (const auto& [point, vector, plane_id] : points) {
            std::cout << "PNI(IK::Point_3(" << point << "), IK::Vector_3("
                      << vector << "), " << plane_id << "), " << std::endl;
          }
          Polygonal_surface_reconstruction algo(points, Point_map(),
                                                Normal_map(), Plane_id_map());

          Epick_surface_mesh reconstructed_mesh;
          if (!algo.reconstruct<MIP_Solver>(reconstructed_mesh)) {
            std::cerr << " Failed: " << algo.error_message() << std::endl;
            return STATUS_INVALID_INPUT;
          }
          CGAL::Polygon_mesh_processing::triangulate_faces(reconstructed_mesh);
          geometry->mesh(nth).clear();
          copy_face_graph(reconstructed_mesh, geometry->mesh(nth));
        }
        case GEOMETRY_UNKNOWN:
        case GEOMETRY_POLYGONS_WITH_HOLES:
        case GEOMETRY_SEGMENTS:
        case GEOMETRY_POINTS:
        case GEOMETRY_EMPTY:
        case GEOMETRY_REFERENCE:
        case GEOMETRY_EDGES:
          break;
      }
    }

    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "QQ/Reconstruct/exception" << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }
}
