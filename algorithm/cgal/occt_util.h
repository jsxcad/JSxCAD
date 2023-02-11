#pragma once

#ifdef ENABLE_OCCT

#include "BRepAlgoAPI_Fuse.hxx"
#include "BRepBuilderAPI_GTransform.hxx"
#include "BRepBuilderAPI_MakeEdge.hxx"
#include "BRepBuilderAPI_MakeFace.hxx"
#include "BRepBuilderAPI_MakeShell.hxx"
#include "BRepBuilderAPI_MakeSolid.hxx"
#include "BRepBuilderAPI_MakeWire.hxx"
#include "BRepBuilderAPI_Sewing.hxx"
#include "BRepBuilderAPI_Transform.hxx"
#include "BRepMesh_IncrementalMesh.hxx"
#include "BRepPrimAPI_MakeBox.hxx"
#include "BRepPrimAPI_MakeSphere.hxx"
#include "BRepTools.hxx"
#include "BRep_Builder.hxx"
#include "GC_MakeSegment.hxx"
#include "RWMesh_FaceIterator.hxx"
#include "StdFail_NotDone.hxx"
#include "TopoDS.hxx"
#include "TopoDS_Builder.hxx"
#include "gp_Trsf.hxx"

TopoDS_Solid sewOcctSolidFromSurfaceMesh(const Surface_mesh& mesh) {
  BRepBuilderAPI_Sewing builder;
  for (const auto& facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    if (mesh.is_removed(start)) {
      continue;
    }
    Halfedge_index edge = start;
    BRepLib_MakeWire wire_maker;
    do {
      Point cgal_s = mesh.point(mesh.source(edge));
      Point cgal_t = mesh.point(mesh.target(edge));
      gp_Pnt occt_s(CGAL::to_double(cgal_s.x().exact()),
                    CGAL::to_double(cgal_s.y().exact()),
                    CGAL::to_double(cgal_s.z().exact()));
      gp_Pnt occt_t(CGAL::to_double(cgal_t.x().exact()),
                    CGAL::to_double(cgal_t.y().exact()),
                    CGAL::to_double(cgal_t.z().exact()));
      Handle(Geom_TrimmedCurve) occt_segment = GC_MakeSegment(occt_s, occt_t);
      wire_maker.Add(BRepBuilderAPI_MakeEdge(occt_segment));
      edge = mesh.next(edge);
    } while (edge != start);
    builder.Add(BRepBuilderAPI_MakeFace(wire_maker.Wire()));
  }
  builder.Perform();
  BRepBuilderAPI_MakeSolid solid_maker;
  solid_maker.Add(TopoDS::Shell(builder.SewedShape()));
  return solid_maker.Solid();
}

TopoDS_Solid buildOcctSolidFromSurfaceMesh(const Surface_mesh& mesh) {
  BRep_Builder builder;
  TopoDS_Shell shell;
  builder.MakeShell(shell);
  for (const auto& facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    if (mesh.is_removed(start)) {
      continue;
    }
    Halfedge_index edge = start;
    BRepLib_MakeWire wire_maker;
    do {
      Point cgal_s = mesh.point(mesh.source(edge));
      Point cgal_t = mesh.point(mesh.target(edge));
      gp_Pnt occt_s(CGAL::to_double(cgal_s.x().exact()),
                    CGAL::to_double(cgal_s.y().exact()),
                    CGAL::to_double(cgal_s.z().exact()));
      gp_Pnt occt_t(CGAL::to_double(cgal_t.x().exact()),
                    CGAL::to_double(cgal_t.y().exact()),
                    CGAL::to_double(cgal_t.z().exact()));
      Handle(Geom_TrimmedCurve) occt_segment = GC_MakeSegment(occt_s, occt_t);
      wire_maker.Add(BRepBuilderAPI_MakeEdge(occt_segment));
      edge = mesh.next(edge);
    } while (edge != start);
    builder.Add(shell, BRepBuilderAPI_MakeFace(wire_maker.Wire()));
  }
  BRepBuilderAPI_MakeSolid solid_maker;
  solid_maker.Add(shell);
  return solid_maker.Solid();
}

void buildSurfaceMeshFromOcctShape(const TopoDS_Shape& shape,
                                   double deflection_tolerance,
                                   Surface_mesh& mesh) {
  Vertex_map vertices;
  for (TopExp_Explorer it(shape, TopAbs_SOLID); it.More(); it.Next()) {
    TopoDS_Solid solid = TopoDS::Solid(it.Current());
    BRepMesh_IncrementalMesh(solid, deflection_tolerance);
    // Each face is triangulated separately, but the vertices are aligned,
    // so we merge them based on their locations using ensureVertex.
    for (RWMesh_FaceIterator face(solid); face.More(); face.Next()) {
      Standard_Integer elem_first = face.ElemLower();
      Standard_Integer elem_last = face.ElemUpper();
      for (Standard_Integer elem = elem_first; elem <= elem_last; elem++) {
        const Poly_Triangle tri = face.TriangleOriented(elem);
        auto xyz_a = face.NodeTransformed(tri(1)).XYZ();
        auto xyz_b = face.NodeTransformed(tri(2)).XYZ();
        auto xyz_c = face.NodeTransformed(tri(3)).XYZ();
        const Point point_a(xyz_a.X(), xyz_a.Y(), xyz_a.Z());
        const Point point_b(xyz_b.X(), xyz_b.Y(), xyz_b.Z());
        const Point point_c(xyz_c.X(), xyz_c.Y(), xyz_c.Z());
        const Vertex_index vertex_a = ensureVertex(mesh, vertices, point_a);
        const Vertex_index vertex_b = ensureVertex(mesh, vertices, point_b);
        const Vertex_index vertex_c = ensureVertex(mesh, vertices, point_c);
        mesh.add_face(vertex_a, vertex_b, vertex_c);
      }
    }
  }
}

std::shared_ptr<const TopoDS_Shape> DeserializeOcctShape(
    std::string serialization) {
  std::istringstream ss(serialization);
  BRep_Builder b;
  TopoDS_Shape* s = new TopoDS_Shape;
  std::shared_ptr<const TopoDS_Shape> result(s);
  BRepTools::Read(*s, ss, b);
  return result;
}

std::string serializeOcctShape(const TopoDS_Shape& shape) {
  std::ostringstream ss;
  BRepTools::Write(shape, ss);
  auto r = ss.str();
  return r;
}

std::string SerializeOcctShape(std::shared_ptr<const TopoDS_Shape>& shape) {
  return serializeOcctShape(*shape);
}

int MakeOcctSphere(Geometry* geometry, double radius) {
  std::shared_ptr<const TopoDS_Shape> shape(
      new TopoDS_Shape(BRepPrimAPI_MakeSphere(radius)));
  int target = geometry->add(GEOMETRY_MESH);
  geometry->setOcctShape(target, shape);
  geometry->setIdentityTransform(target);
  return STATUS_OK;
}

int MakeOcctBox(Geometry* geometry, double x_length, double y_length,
                double z_length) {
  std::shared_ptr<const TopoDS_Shape> shape(
      new TopoDS_Shape(BRepPrimAPI_MakeBox(x_length, y_length, z_length)));
  int target = geometry->add(GEOMETRY_MESH);
  geometry->setOcctShape(target, shape);
  geometry->setIdentityTransform(target);
  return STATUS_OK;
}

gp_Trsf occtTransformFromCgalTransform(const Transformation& t) {
  Standard_Real a11 = CGAL::to_double(t.m(0, 0));
  Standard_Real a12 = CGAL::to_double(t.m(0, 1));
  Standard_Real a13 = CGAL::to_double(t.m(0, 2));
  Standard_Real a14 = CGAL::to_double(t.m(0, 3));
  Standard_Real a21 = CGAL::to_double(t.m(1, 0));
  Standard_Real a22 = CGAL::to_double(t.m(1, 1));
  Standard_Real a23 = CGAL::to_double(t.m(1, 2));
  Standard_Real a24 = CGAL::to_double(t.m(1, 3));
  Standard_Real a31 = CGAL::to_double(t.m(2, 0));
  Standard_Real a32 = CGAL::to_double(t.m(2, 1));
  Standard_Real a33 = CGAL::to_double(t.m(2, 2));
  Standard_Real a34 = CGAL::to_double(t.m(2, 3));
  gp_Trsf trsf;
  trsf.SetValues(a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34);
  return trsf;
}

gp_GTrsf occtGeometryTransformFromCgalTransform(const Transformation& t) {
  Standard_Real a11 = CGAL::to_double(t.m(0, 0));
  Standard_Real a12 = CGAL::to_double(t.m(0, 1));
  Standard_Real a13 = CGAL::to_double(t.m(0, 2));
  Standard_Real a14 = CGAL::to_double(t.m(0, 3));
  Standard_Real a21 = CGAL::to_double(t.m(1, 0));
  Standard_Real a22 = CGAL::to_double(t.m(1, 1));
  Standard_Real a23 = CGAL::to_double(t.m(1, 2));
  Standard_Real a24 = CGAL::to_double(t.m(1, 3));
  Standard_Real a31 = CGAL::to_double(t.m(2, 0));
  Standard_Real a32 = CGAL::to_double(t.m(2, 1));
  Standard_Real a33 = CGAL::to_double(t.m(2, 2));
  Standard_Real a34 = CGAL::to_double(t.m(2, 3));

  const gp_GTrsf r(gp_Mat(a11, a12, a13, a21, a22, a23, a31, a32, a33),
                   gp_XYZ(a14, a24, a34));
  return r;
}

std::shared_ptr<const TopoDS_Shape> transformOcctShape(
    const Transformation& t, const TopoDS_Shape& shape) {
  BRepBuilderAPI_Transform op(shape, occtTransformFromCgalTransform(t));
  return std::shared_ptr<const TopoDS_Shape>(new TopoDS_Shape(op.Shape()));
}

std::shared_ptr<const TopoDS_Shape> transformGeometryOfOcctShape(
    const Transformation& t, const TopoDS_Shape& shape) {
  gp_GTrsf g = occtGeometryTransformFromCgalTransform(t);
  // This causes memory corruption.
  BRepBuilderAPI_GTransform op(shape, g);
  return std::shared_ptr<const TopoDS_Shape>(new TopoDS_Shape(op.Shape()));
}

#endif
