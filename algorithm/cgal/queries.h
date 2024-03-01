#pragma once

#include "Geometry.h"

class SurfaceMeshQuery {
  typedef CGAL::AABB_face_graph_triangle_primitive<Surface_mesh> Primitive;
  typedef CGAL::AABB_traits<Kernel, Primitive> Traits;
  typedef CGAL::AABB_tree<Traits> Tree;
  typedef boost::optional<Tree::Intersection_and_primitive_id<Point>::Type>
      Point_intersection;
  typedef boost::optional<Tree::Intersection_and_primitive_id<Segment>::Type>
      Segment_intersection;
  typedef CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> Inside_tester;

 public:
  SurfaceMeshQuery(const Surface_mesh& mesh,
                   const Transformation& transformation)
      : is_volume_(CGAL::is_closed(mesh)) {
    mesh_.reset(new Surface_mesh(mesh));
    assert(mesh_->is_valid());
    CGAL::Polygon_mesh_processing::transform(transformation, *mesh_,
                                             CGAL::parameters::all_default());
    assert(mesh_->is_valid());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    assert(mesh_->is_valid());
    inside_tester_.reset(new Inside_tester(*tree_));
    assert(mesh_->is_valid());
  }

  SurfaceMeshQuery(const Surface_mesh* mesh,
                   const Transformation* transformation)
      : is_volume_(CGAL::is_closed(*mesh)) {
    mesh_.reset(new Surface_mesh(*mesh));
    assert(mesh_->is_valid());
    CGAL::Polygon_mesh_processing::transform(*transformation, *mesh_,
                                             CGAL::parameters::all_default());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    inside_tester_.reset(new Inside_tester(*tree_));
  }

  SurfaceMeshQuery(const Surface_mesh& mesh)
      : is_volume_(CGAL::is_closed(mesh)) {
    mesh_.reset(new Surface_mesh(mesh));
    assert(mesh_->is_valid());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    inside_tester_.reset(new Inside_tester(*tree_));
  }

  SurfaceMeshQuery(const Surface_mesh* mesh)
      : is_volume_(CGAL::is_closed(*mesh)) {
    mesh_.reset(new Surface_mesh(*mesh));
    assert(mesh_->is_valid());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    inside_tester_.reset(new Inside_tester(*tree_));
  }

  bool isIntersectingPointApproximate(double x, double y, double z) {
    return isIntersectingPoint(Point(x, y, z));
  }

  bool isIntersectingPoint(const Point& point) {
    if (is_volume_) {
      return (*inside_tester_)(point) != CGAL::ON_UNBOUNDED_SIDE;
    } else {
      return (*inside_tester_)(point) == CGAL::ON_BOUNDARY;
    }
  }

  bool isInsidePointApproximate(double x, double y, double z) {
    return isInsidePoint(Point(x, y, z));
  }

  bool isInsidePoint(const Point& point) {
    return (*inside_tester_)(point) == CGAL::ON_BOUNDED_SIDE;
  }

  bool isOutsidePointApproximate(double x, double y, double z) {
    return isOutsidePoint(Point(x, y, z));
  }

  bool isOutsidePoint(const Point& point) {
    return (*inside_tester_)(point) == CGAL::ON_UNBOUNDED_SIDE;
  }

  bool isIntersectingSegmentApproximate(double sx, double sy, double sz,
                                        double tx, double ty, double tz) {
    return isIntersectingSegment(Segment(Point(sx, sy, sz), Point(tx, ty, tz)));
  }

  bool isIntersectingSegment(const Segment& segment) {
    return tree_->do_intersect(segment);
  }

  template <typename Emit>
  void intersectSegment(bool do_clip, const Segment& segment, Emit& emit) {
    assert(mesh_->is_valid());
    Point source = segment.source();
    Point target = segment.target();
    const bool do_cut = !do_clip;
    std::list<Segment_intersection> intersections;
    tree_->all_intersections(segment, std::back_inserter(intersections));
    // Handle pointwise intersections -- through faces.
    if (is_volume_) {
      // We could just see if the closest point to the source is the source.
      bool is_source_inside =
          (*inside_tester_)(source) == CGAL::ON_BOUNDED_SIDE;
      // We could just see if the further point to the source is the target.
      bool is_target_inside =
          (*inside_tester_)(target) == CGAL::ON_BOUNDED_SIDE;
      std::vector<Point> points;
      if ((do_clip && is_source_inside) || (do_cut && !is_source_inside)) {
        points.push_back(source);
      }
      for (const auto& intersection : intersections) {
        if (!intersection) {
          continue;
        }
        // Note: intersection->second is the intersected face index.
        // CHECK: We get doubles because we're intersecting with the
        // interior of the faces.
        if (const Point* point = std::get_if<Point>(&intersection->first)) {
          points.push_back(*point);
        }
      }
      if ((do_clip && is_target_inside) || (do_cut && !is_target_inside)) {
        points.push_back(target);
      }
      if (points.size() >= 2) {
        std::sort(points.begin(), points.end(),
                  [&](const Point& a, const Point& b) {
                    return CGAL::squared_distance(a, source) <
                           CGAL::squared_distance(b, source);
                  });
        points.erase(std::unique(points.begin(), points.end()), points.end());
        // Now we should have pairs of doubled pointwise intersections.
        for (size_t index = 0; index < points.size() - 1; index += 2) {
          const Point& source = points[index + 0];
          const Point& target = points[index + 1];
          Segment segment(source, target);
          emit(segment);
        }
      }
    } else {
      // Surface
      // Handle segmentwise intersections -- along faces.
      std::vector<Point> points;
      for (const auto& intersection : intersections) {
        if (!intersection) {
          continue;
        }
        // Note: intersection->second is the intersected face index.
        if (const Segment* segment =
                std::get_if<Segment>(&intersection->first)) {
          points.push_back(segment->source());
          points.push_back(segment->target());
        }
      }
      points.push_back(source);
      points.push_back(target);
      std::sort(points.begin(), points.end(),
                [&](const Point& a, const Point& b) {
                  return CGAL::squared_distance(a, source) <
                         CGAL::squared_distance(b, source);
                });
      points.erase(std::unique(points.begin(), points.end()), points.end());
      size_t start = 0;
      if (points.size() >= 2) {
        for (size_t index = start; index < points.size() - 1; index++) {
          const Point& source = points[index + 0];
          const Point& target = points[index + 1];
          const bool on_boundary = (*inside_tester_)(CGAL::midpoint(
                                       source, target)) == CGAL::ON_BOUNDARY;
          if ((on_boundary && do_cut) || (!on_boundary && do_clip)) {
            continue;
          }
          emit(Segment(source, target));
        }
      }
    }
  }

  Surface_mesh& mesh() { return *mesh_; }

 private:
  std::unique_ptr<Surface_mesh> mesh_;
  std::unique_ptr<Tree> tree_;
  std::unique_ptr<Inside_tester> inside_tester_;
  bool is_volume_;
};
