#include <emscripten/bind.h>

#include "cgal.h"

namespace wrapped {
int ComputeBoundingBox(Geometry* geometry, emscripten::val emit) {
  return ::ComputeBoundingBox(
      geometry,
      [&](double xmin, double ymin, double zmin, double xmax, double ymax,
          double zmax) { emit(xmin, ymin, zmin, xmax, ymax, zmax); });
}

int ComputeImplicitVolume(Geometry* geometry, emscripten::val op, double radius,
                          double angular_bound, double radius_bound,
                          double distance_bound, double error_bound) {
  return ::ComputeImplicitVolume(
      geometry,
      [&](double x, double y, double z) -> double {
        return op(x, y, z).as<double>();
      },
      radius, angular_bound, radius_bound, distance_bound, error_bound);
}

int Disjoint(Geometry* geometry, emscripten::val getIsMasked, int mode,
             bool exact) {
  return ::Disjoint(
      geometry,
      [&](int index) -> bool { return getIsMasked(index).as<bool>(); }, mode,
      exact);
}

int EachPoint(Geometry* geometry, emscripten::val emit_point) {
  return ::EachPoint(
      geometry, [&](double x, double y, double z, const std::string& exact) {
        return emit_point(x, y, z, exact);
      });
}

int EachTriangle(Geometry* geometry, emscripten::val emit_point) {
  return ::EachTriangle(
      geometry, [&](double x, double y, double z, const std::string& exact) {
        emit_point(x, y, z, exact);
      });
}

int FromPolygonSoup(Geometry* geometry, emscripten::val fill, size_t face_count,
                    double min_error_drop, emscripten::val nextStrategy) {
  return ::FromPolygonSoup(
      geometry,
      [&](Triples* triples, Polygons* polygons) {
        return fill(triples, polygons);
      },
      face_count, min_error_drop,
      [&]() -> int { return nextStrategy().as<int>(); });
}

int FromPolygons(Geometry* geometry, bool close, emscripten::val fill) {
  return ::FromPolygons(geometry, close,
                        [&](Triples* triples, Polygons* polygons) {
                          return fill(triples, polygons);
                        });
}

int Repair(Geometry* geometry, emscripten::val nextStrategy) {
  return ::Repair(geometry, [&]() { return nextStrategy().as<int>(); });
}

int Unfold(Geometry* geometry, bool enable_tabs, emscripten::val emit_tag) {
  return ::Unfold(
      geometry, enable_tabs,
      [&](int index, const std::string& tag) { emit_tag(index, tag); });
}

int Validate(Geometry* geometry, emscripten::val get_next_strategy) {
  return ::Validate(geometry,
                    [&]() -> int { return get_next_strategy().as<int>(); });
}
}  // namespace wrapped

EMSCRIPTEN_BINDINGS(module) {
  emscripten::class_<Transformation>("Transformation")
      .smart_ptr<std::shared_ptr<const Transformation>>("Transformation");
  emscripten::function("Transformation__compose", &Transformation__compose);
  emscripten::function("Transformation__identity", &Transformation__identity);
  emscripten::function("Transformation__inverse", &Transformation__inverse);
  emscripten::function("Transformation__from_approximate",
                       &Transformation__from_approximate);
  emscripten::function("Transformation__from_exact",
                       &Transformation__from_exact);
  emscripten::function("Transformation__to_approximate",
                       &Transformation__to_approximate);
  emscripten::function("Transformation__to_exact", &Transformation__to_exact);
  emscripten::function("Transformation__translate", &Transformation__translate);
  emscripten::function("Transformation__scale", &Transformation__scale);
  emscripten::function(
      "Transformation__rotate_x",
      &Transformation__rotate_x<Epeck_transformation, Epeck_kernel::RT>);
  emscripten::function(
      "Transformation__rotate_y",
      &Transformation__rotate_y<Epeck_transformation, Epeck_kernel::RT>);
  emscripten::function(
      "Transformation__rotate_z",
      &Transformation__rotate_z<Epeck_transformation, Epeck_kernel::RT>);
  emscripten::function("Transformation__rotate_x_to_y0",
                       &Transformation__rotate_x_to_y0);
  emscripten::function("Transformation__rotate_y_to_x0",
                       &Transformation__rotate_y_to_x0);
  emscripten::function("Transformation__rotate_z_to_y0",
                       &Transformation__rotate_z_to_y0);
  emscripten::function("InverseSegmentTransform", &InverseSegmentTransform);

  emscripten::class_<Triples>("Triples")
      .constructor<>()
      .function("push_back",
                select_overload<void(const Triple&)>(&Triples::push_back))
      .function("size", select_overload<size_t() const>(&Triples::size));

  emscripten::function("addTriple", &addTriple,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Polygon>("Polygon").constructor<>().function(
      "size", select_overload<size_t() const>(&Polygon::size));

  emscripten::function("Polygon__push_back", &Polygon__push_back,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Polygons>("Polygons")
      .constructor<>()
      .function("push_back",
                select_overload<void(const Polygon&)>(&Polygons::push_back))
      .function("size", select_overload<size_t() const>(&Polygons::size));

  emscripten::class_<Point>("Point")
      .constructor<float, float, float>()
      .function("hx", &Point::hx)
      .function("hy", &Point::hy)
      .function("hz", &Point::hz)
      .function("hw", &Point::hw)
      .function("x", &Point::x)
      .function("y", &Point::y)
      .function("z", &Point::z);

  emscripten::class_<Polygon_2>("Polygon_2")
      .constructor<>()
      .function("add", &Polygon_2__add, emscripten::allow_raw_pointers())
      .function("addExact", &Polygon_2__addExact,
                emscripten::allow_raw_pointers());

  emscripten::class_<Polygon_with_holes_2>("Polygon_with_holes_2")
      .constructor<>();

  emscripten::class_<Face_index>("Face_index").constructor<std::size_t>();
  emscripten::class_<Halfedge_index>("Halfedge_index")
      .constructor<std::size_t>();
  emscripten::class_<Vertex_index>("Vertex_index").constructor<std::size_t>();

  emscripten::class_<Surface_mesh>("Surface_mesh")
      .smart_ptr<std::shared_ptr<const Surface_mesh>>("Surface_mesh")
      .function("is_valid",
                select_overload<bool(bool) const>(&Surface_mesh::is_valid))
      .function("is_empty", &Surface_mesh::is_empty)
      .function("number_of_vertices", &Surface_mesh::number_of_vertices)
      .function("number_of_halfedges", &Surface_mesh::number_of_halfedges)
      .function("number_of_edges", &Surface_mesh::number_of_edges)
      .function("number_of_faces", &Surface_mesh::number_of_faces)
      .function("has_garbage", &Surface_mesh::has_garbage);

  emscripten::class_<Quadruple>("Quadruple").constructor<>();
  emscripten::function("fillQuadruple", &fillQuadruple,
                       emscripten::allow_raw_pointers());
  emscripten::function("fillExactQuadruple", &fillExactQuadruple,
                       emscripten::allow_raw_pointers());

  emscripten::function("DeserializeMesh", &DeserializeMesh);
  emscripten::function("SerializeMesh", &SerializeMesh);

  // New classes
  emscripten::class_<Geometry>("Geometry")
      .constructor<>()
      .function("addInputPoint", &Geometry::addInputPoint)
      .function("addInputPointExact", &Geometry::addInputPointExact)
      .function("addInputSegment", &Geometry::addInputSegment)
      .function("addInputSegmentExact", &Geometry::addInputSegmentExact)
      .function("convertPlanarMeshesToPolygons",
                &Geometry::convertPlanarMeshesToPolygons)
      .function("convertPolygonsToPlanarMeshes",
                &Geometry::convertPolygonsToPlanarMeshes)
      .function("copyInputMeshesToOutputMeshes",
                &Geometry::copyInputMeshesToOutputMeshes)
      .function("deserializeInputMesh", &Geometry::deserializeInputMesh)
      .function("fillPolygonsWithHoles", &Geometry::fillPolygonsWithHoles)
      .function("emitPoints", &Geometry::emitPoints)
      .function("emitPolygonsWithHoles", &Geometry::emitPolygonsWithHoles)
      .function("emitEdges", &Geometry::emitEdges)
      .function("emitSegments", &Geometry::emitSegments)
      .function("getInputMesh", &Geometry::getMesh)
      .function("getMesh", &Geometry::getMesh)
      .function("getOrigin", &Geometry::getOrigin)
      .function("getSerializedInputMesh", &Geometry::getSerializedInputMesh)
      .function("getSerializedMesh", &Geometry::getSerializedMesh)
      .function("getSize", &Geometry::getSize)
      .function("getTransform", &Geometry::getTransform)
      .function("getType", &Geometry::getType)
      .function("has_mesh", &Geometry::has_mesh)
      .function("setTestMode", &Geometry::setTestMode)
      .function("setInputMesh", &Geometry::setInputMesh)
      .function("setSize", &Geometry::setSize)
      .function("setTransform", &Geometry::setTransform)
      .function("setType", &Geometry::setType)
      .function("transformToAbsoluteFrame",
                &Geometry::transformToAbsoluteFrame);

  emscripten::class_<AabbTreeQuery>("AabbTreeQuery")
      .constructor<>()
      .function("addGeometry", &AabbTreeQuery::addGeometry,
                emscripten::allow_raw_pointers())
      .function("intersectSegmentApproximate",
                &AabbTreeQuery::intersectSegmentApproximate)
      .function("isIntersectingPointApproximate",
                &AabbTreeQuery::isIntersectingPointApproximate)
      .function("isIntersectingSegmentApproximate",
                &AabbTreeQuery::isIntersectingSegmentApproximate);

  // New primitives
  emscripten::function("Approximate", &Approximate,
                       emscripten::allow_raw_pointers());
  emscripten::function("Bend", &Bend, emscripten::allow_raw_pointers());
  emscripten::function("Cast", &Cast, emscripten::allow_raw_pointers());
  emscripten::function("Clip", &Clip, emscripten::allow_raw_pointers());
  emscripten::function("ComputeArea", &ComputeArea,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeBoundingBox", &wrapped::ComputeBoundingBox,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeOrientedBoundingBox",
                       &ComputeOrientedBoundingBox,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeCentroid", &ComputeCentroid,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeImplicitVolume", &wrapped::ComputeImplicitVolume,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeNormal", &ComputeNormal,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeReliefFromImage", &ComputeReliefFromImage,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeSkeleton", &ComputeSkeleton,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeToolpath", &ComputeToolpath,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeVolume", &ComputeVolume,
                       emscripten::allow_raw_pointers());
  emscripten::function("ConvexHull", &ConvexHull,
                       emscripten::allow_raw_pointers());
  emscripten::function("ConvertPolygonsToMeshes", &ConvertPolygonsToMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("Cut", &Cut, emscripten::allow_raw_pointers());
  emscripten::function("Deform", &Deform, emscripten::allow_raw_pointers());
  emscripten::function("Demesh", &Demesh, emscripten::allow_raw_pointers());
  emscripten::function("DilateXY", &DilateXY, emscripten::allow_raw_pointers());
  emscripten::function("Disjoint", &wrapped::Disjoint,
                       emscripten::allow_raw_pointers());
  emscripten::function("EachPoint", &wrapped::EachPoint,
                       emscripten::allow_raw_pointers());
  emscripten::function("EachTriangle", &wrapped::EachTriangle,
                       emscripten::allow_raw_pointers());
  emscripten::function("EagerTransform", &EagerTransform,
                       emscripten::allow_raw_pointers());
  emscripten::function("Extrude", &Extrude, emscripten::allow_raw_pointers());
  emscripten::function("Fair", &Fair, emscripten::allow_raw_pointers());
  emscripten::function("FaceEdges", &FaceEdges,
                       emscripten::allow_raw_pointers());
  emscripten::function("Fill", &Fill, emscripten::allow_raw_pointers());
  emscripten::function("Fix", &Fix, emscripten::allow_raw_pointers());
  emscripten::function("FromPolygons", &wrapped::FromPolygons,
                       emscripten::allow_raw_pointers());
  emscripten::function("FromPolygonSoup", &wrapped::FromPolygonSoup,
                       emscripten::allow_raw_pointers());
  emscripten::function("Fuse", &Fuse, emscripten::allow_raw_pointers());
  emscripten::function("GenerateEnvelope", &GenerateEnvelope,
                       emscripten::allow_raw_pointers());
  emscripten::function("Grow", &Grow, emscripten::allow_raw_pointers());
  emscripten::function("Inset", &Inset, emscripten::allow_raw_pointers());
  emscripten::function("Involute", &Involute, emscripten::allow_raw_pointers());
  emscripten::function("Iron", &Iron, emscripten::allow_raw_pointers());
  emscripten::function("Join", &Join, emscripten::allow_raw_pointers());
  emscripten::function("Link", &Link, emscripten::allow_raw_pointers());
  emscripten::function("Loft", &Loft, emscripten::allow_raw_pointers());
  emscripten::function("MakeAbsolute", &MakeAbsolute,
                       emscripten::allow_raw_pointers());
  emscripten::function("MakeUnitSphere", &MakeUnitSphere,
                       emscripten::allow_raw_pointers());
  emscripten::function("MinimizeOverhang", &MinimizeOverhang,
                       emscripten::allow_raw_pointers());
  emscripten::function("Offset", &Offset, emscripten::allow_raw_pointers());
  emscripten::function("Outline", &Outline, emscripten::allow_raw_pointers());
  emscripten::function("Reconstruct", &Reconstruct,
                       emscripten::allow_raw_pointers());
  emscripten::function("Refine", &Refine, emscripten::allow_raw_pointers());
  emscripten::function("Remesh", &Remesh, emscripten::allow_raw_pointers());
  emscripten::function("Repair", &wrapped::Repair,
                       emscripten::allow_raw_pointers());
  emscripten::function("Route", &Route, emscripten::allow_raw_pointers());
  emscripten::function("Seam", &Seam, emscripten::allow_raw_pointers());
  emscripten::function("Section", &Section, emscripten::allow_raw_pointers());
  emscripten::function("Separate", &Separate, emscripten::allow_raw_pointers());
  emscripten::function("Shell", &Shell, emscripten::allow_raw_pointers());
  emscripten::function("Simplify", &Simplify, emscripten::allow_raw_pointers());
  emscripten::function("Smooth", &Smooth, emscripten::allow_raw_pointers());
  emscripten::function("Twist", &Twist, emscripten::allow_raw_pointers());
  emscripten::function("Unfold", &wrapped::Unfold,
                       emscripten::allow_raw_pointers());
  emscripten::function("Validate", &wrapped::Validate,
                       emscripten::allow_raw_pointers());
  emscripten::function("Wrap", &Wrap, emscripten::allow_raw_pointers());

  emscripten::function("FT__to_double", &FT__to_double,
                       emscripten::allow_raw_pointers());

  // emscripten::function("Surface_mesh__explore", &Surface_mesh__explore,
  // emscripten::allow_raw_pointers());
  // emscripten::function("Surface_mesh__triangulate_faces",
  // &Surface_mesh__triangulate_faces, emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__is_closed", &Surface_mesh__is_closed,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_empty", &Surface_mesh__is_empty,
                       emscripten::allow_raw_pointers());
  // emscripten::function("Surface_mesh__is_valid_halfedge_graph",
  // &Surface_mesh__is_valid_halfedge_graph, emscripten::allow_raw_pointers());
  // emscripten::function("Surface_mesh__is_valid_face_graph",
  // &Surface_mesh__is_valid_face_graph, emscripten::allow_raw_pointers());
  // emscripten::function("Surface_mesh__is_valid_polygon_mesh",
  // &Surface_mesh__is_valid_polygon_mesh, emscripten::allow_raw_pointers());
  // emscripten::function("Surface_mesh__bbox", &Surface_mesh__bbox,
  // emscripten::allow_raw_pointers());
}
