#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/transform.h>

#include "Geometry.h"

static double MinimizeOverhang(Geometry* geometry, double threshold,
                               bool split) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  IK::Vector_3 upright(0, 0, 1);
  IK::Plane_3 floor(IK::Point_3(0, 0, 0), upright);

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    auto& mesh = geometry->epick_mesh(nth);
    auto compute_area = [&](double& minimizing_z) -> double {
      std::map<double, std::pair<double, double>> level;
      double total_area = 0;
      for (auto face : mesh.faces()) {
        auto normal =
            CGAL::Polygon_mesh_processing::compute_face_normal(face, mesh);
        auto degrees = CGAL::approximate_angle(normal, upright);
        if (degrees > threshold) {
          auto h = mesh.halfedge(face);
          auto a = mesh.point(mesh.source(h));
          auto b = mesh.point(mesh.target(h));
          auto c = mesh.point(mesh.target(mesh.next(h)));
          double bottom = CGAL::to_double(std::min({a.z(), b.z(), c.z()}));
          double area = CGAL::to_double(CGAL::abs(
              CGAL::area(floor.to_2d(a), floor.to_2d(b), floor.to_2d(c))));
          auto it(level.lower_bound(bottom));
          if (it == level.end() || bottom < it->first) {
            it = level.insert(it, std::make_pair(bottom, std::make_pair(0, 0)));
          }
          it->second.first += area;
          total_area += area;
        } else if (split && degrees < 180 - threshold) {
          auto h = mesh.halfedge(face);
          auto a = mesh.point(mesh.source(h));
          auto b = mesh.point(mesh.target(h));
          auto c = mesh.point(mesh.target(mesh.next(h)));
          double top = CGAL::to_double(std::max({a.z(), b.z(), c.z()}));
          double area = CGAL::to_double(CGAL::abs(
              CGAL::area(floor.to_2d(a), floor.to_2d(b), floor.to_2d(c))));
          auto it(level.lower_bound(top));
          if (it == level.end() || top < it->first) {
            it = level.insert(it, std::make_pair(top, std::make_pair(0, 0)));
          }
          it->second.second += area;
        }
      }
      if (split) {
        // Now step through each break point to see where the sum of
        // total_up_area and total_down_area is minimized. Note that
        // total_down_area start maximized.
        //
        // Note: Using area biases toward vertical orientation. It may be fairer
        // to measure volume instead.
        auto minimal_level = level.begin();
        double minimal_area = total_area;
        for (auto it = level.begin(); it != level.end(); ++it) {
          const double up = it->second.first;
          const double down = it->second.second;
          total_area -= up;
          total_area += down;
          if (total_area < minimal_area) {
            minimal_area = total_area;
            minimal_level = it;
          }
        }
        minimizing_z = minimal_level->first;
        return minimal_area;
      } else {
        return total_area;
      }
    };

    // Use a deterministic seed.
    CGAL::Random random(0);

    double best_area = std::numeric_limits<double>::infinity();
    double best_z = 0;
    CGAL::Aff_transformation_3<EK> accumulated_et;
    for (double h = 1.0; h > 0.01; h *= 0.95) {
      CGAL::Aff_transformation_3<IK> it;
      CGAL::Aff_transformation_3<EK> et;
      double r = random.get_double(0, h);
      if (random.get_bool()) {
        it = TransformationFromYTurn<CGAL::Aff_transformation_3<IK>, IK::RT>(r);
        et = TransformationFromYTurn<CGAL::Aff_transformation_3<EK>, IK::RT>(r);
      } else {
        it = TransformationFromXTurn<CGAL::Aff_transformation_3<IK>, IK::RT>(r);
        et = TransformationFromXTurn<CGAL::Aff_transformation_3<EK>, IK::RT>(r);
      }
      CGAL::Polygon_mesh_processing::transform(it, mesh);

      double z = 0;
      double minimal_area = compute_area(z);
      if (minimal_area < best_area) {
        // Commit.
        best_area = minimal_area;
        best_z = z;
        accumulated_et =
            translate(EK::Vector_3(0, 0, -best_z)) * et * accumulated_et;
        CGAL::Polygon_mesh_processing::transform(
            translate(IK::Vector_3(0, 0, -best_z)), mesh);
      } else {
        // Backtrack.
        CGAL::Polygon_mesh_processing::transform(it.inverse(), mesh);
      }
    }

    CGAL::Polygon_mesh_processing::transform(accumulated_et,
                                             geometry->mesh(nth));
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
