#pragma once

#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/GLPK_mixed_integer_program_traits.h>
#include <CGAL/IO/read_points.h>
#include <CGAL/Polygonal_surface_reconstruction.h>
#include <CGAL/Shape_detection/Efficient_RANSAC.h>
#include <CGAL/Shape_regularization/regularize_planes.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/property_map.h>

#if 0
namespace CGAL {

template <typename Container>
class Random_access_property_map {
  Container& m_container;

 public:
  using Iterator = std::conditional_t<std::is_const<Container>::value,
                                      typename Container::const_iterator,
                                      typename Container::iterator>;
  typedef std::size_t key_type;
  typedef typename std::iterator_traits<Iterator>::value_type value_type;
  typedef typename std::iterator_traits<Iterator>::reference reference;
  typedef boost::lvalue_property_map_tag category;

  Random_access_property_map(Container& container) : m_container(container) {}

  friend reference get(Random_access_property_map map, key_type index) {
    return map.m_container[index];
  }

  template <class Key>
  friend void put(Random_access_property_map map, Key index,
                  const value_type& value,
                  std::enable_if_t<!std::is_const<Container>::value>* = 0) {
    map.m_container[index] = value;
  }

  decltype(auto) operator[](key_type index) const { return m_container[index]; }
};

template <class Container>
Random_access_property_map<Container> make_random_access_property_map(
    Container& container) {
  return Random_access_property_map<Container>(container);
}
}  // namespace CGAL
#endif

int Reconstruct(Geometry* geometry) {
  try {
    std::cout << "QQ/Reconstruct/1" << std::endl;
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->transformToAbsoluteFrame();

    for (int nth = 0; nth < size; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_MESH: {
          std::cout << "QQ/Reconstruct/2" << std::endl;
          typedef boost::tuple<Epick_point, Epick_vector,
                               // Epick_surface_mesh::Face_index,
                               // Epick_surface_mesh::Vertex_index,
                               int>
              PNI;
          typedef CGAL::Nth_of_tuple_property_map<0, PNI> Point_map;
          typedef CGAL::Nth_of_tuple_property_map<1, PNI> Normal_map;
          // typedef CGAL::Nth_of_tuple_property_map<2, PNI> Face_index_map;
          // typedef CGAL::Nth_of_tuple_property_map<3, PNI> Vertex_index_map;
          typedef CGAL::Nth_of_tuple_property_map<2, PNI> Plane_id_map;
          typedef std::vector<PNI> Point_vector;

          using Traits = CGAL::Shape_detection::Efficient_RANSAC_traits<
              Epick_kernel, Point_vector, Point_map, Normal_map>;
          using Plane_map = CGAL::Shape_detection::Plane_map<Traits>;

          const Epick_surface_mesh& mesh = geometry->epick_mesh(nth);
          Point_vector points;
          std::unordered_map<Epick_surface_mesh::Face_index, int> facet_index;
          std::vector<int> facet_plane;
          std::vector<Epick_plane> planes;
          std::vector<Epick_plane> regulated_planes;
          std::vector<int> point_plane_index;
          std::vector<int> plane_indices;
          // FIX: number_of_faces might not equal to the maximum facet value.
          facet_plane.reserve(mesh.number_of_faces());
          for (const auto& facet : mesh.faces()) {
            Epick_plane plane;
            PlaneOfSurfaceMeshFacet(mesh, facet, plane);
            plane = unitPlane<Epick_kernel>(plane);
            size_t plane_index = planes.size();
            plane_indices.push_back(plane_index);
            // These will remain original.
            planes.push_back(plane);
            // These will be regulated.
            regulated_planes.push_back(plane);

            Epick_surface_mesh::Halfedge_index a = mesh.halfedge(facet);
            Epick_surface_mesh::Halfedge_index b = mesh.next(a);
            Epick_surface_mesh::Halfedge_index c = mesh.next(b);
            Epick_point center = CGAL::centroid(mesh.point(mesh.source(a)),
                                                mesh.point(mesh.source(b)),
                                                mesh.point(mesh.source(c)));
            // A centroid xor corners is insufficient.
            // A centroid and corners are sufficient for reconstruction.
            // Presumably the three midpoints of the centroid and each corner
            // would also work.
            points.emplace_back(center, plane.orthogonal_vector(), plane_index);
            point_plane_index.push_back(plane_index);

            points.emplace_back(mesh.point(mesh.source(a)),
                                plane.orthogonal_vector(), plane_index);
            point_plane_index.push_back(plane_index);

            points.emplace_back(mesh.point(mesh.source(b)),
                                plane.orthogonal_vector(), plane_index);
            point_plane_index.push_back(plane_index);

            points.emplace_back(mesh.point(mesh.source(c)),
                                plane.orthogonal_vector(), plane_index);
            point_plane_index.push_back(plane_index);
          }

          std::cout << "QQ/Reconstruct/3" << std::endl;

          Plane_map plane_map;
          Point_map point_map;
          Normal_map normal_map;
          // Face_index_map face_index_map;

          struct Plane_range
              : public CGAL::Iterator_range<
                    typename std::vector<Epick_plane>::const_iterator> {
            typedef CGAL::Iterator_range<
                typename std::vector<Epick_plane>::const_iterator>
                Base;
            explicit Plane_range(std::vector<Epick_plane>& planes)
                : Base(make_range(planes.begin(), planes.end())) {}
          };

          CGAL::Random_access_property_map facet_plane_map(planes);
          CGAL::Random_access_property_map regulated_facet_plane_map(
              regulated_planes);

#if 0
          std::cout << "QQ/Reconstruct/4" << std::endl;
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
          std::unordered_map<Epick_plane, int> regulated_plane_index;
          int next_regulated_plane_id = 0;
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

          std::cout << "QQ/Reconstruct/5" << std::endl;
          for (const auto& [point, vector, plane_id] : points) {
            std::cout << "PNI(Epick_point(" << point << "), Epick_vector("
                      << vector << "), " << plane_id << "), " << std::endl;
          }
          Polygonal_surface_reconstruction algo(points, Point_map(),
                                                Normal_map(), Plane_id_map());

          Epick_surface_mesh reconstructed_mesh;
          std::cout << "QQ/Reconstruct/6" << std::endl;
          if (!algo.reconstruct<MIP_Solver>(reconstructed_mesh)) {
            std::cerr << " Failed: " << algo.error_message() << std::endl;
            return STATUS_INVALID_INPUT;
          }
          std::cout << "QQ/Reconstruct/6: reconstructed_mesh="
                    << reconstructed_mesh << std::endl;
          CGAL::Polygon_mesh_processing::triangulate_faces(reconstructed_mesh);
          // CGAL::Polygon_mesh_processing::orient_to_bound_a_volume(reconstructed_mesh);
          geometry->mesh(nth).clear();
          copy_face_graph(reconstructed_mesh, geometry->mesh(nth));
          std::cout << "QQ/Reconstruct/mesh=" << geometry->mesh(nth)
                    << std::endl;

          std::cout << "QQ/Reconstruct/8" << std::endl;
        }
      }
    }

    std::cout << "QQ/Reconstruct/9" << std::endl;
    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "QQ/EachPoint/exception" << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }
}