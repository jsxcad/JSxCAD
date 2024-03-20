#pragma once

#include "mu3d.h"

struct UnfoldTag {
  UnfoldTag(int face, const std::string& name) : face(face), name(name) {}

  int face;
  const std::string name;
};

static int Unfold(Geometry* geometry, bool enable_tabs,
                  std::vector<UnfoldTag>& tags) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        CGAL::Polyhedron_3<CGAL::Simple_cartesian<double>> polyhedron;
        copy_face_graph(geometry->mesh(nth), polyhedron);
        mu3d::Graph<Point_2> g;
        g.load(polyhedron);
        if (!g.unfold(20000, 0)) {
          return STATUS_INVALID_INPUT;
        }
        std::vector<Point_2> points;
        g.fillPoints(points);
        int faces = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
        tags.emplace_back(faces, "unfold:faces");
        geometry->plane(faces) = Plane(0, 0, 1, 0);
        geometry->setIdentityTransform(faces);
        for (size_t nth = 0; nth < points.size(); nth += 3) {
          Polygon_2 polygon;
          polygon.push_back(points[nth + 0]);
          polygon.push_back(points[nth + 1]);
          polygon.push_back(points[nth + 2]);
          geometry->pwh(faces).emplace_back(polygon);
        }

        if (enable_tabs) {
          std::vector<Point_2> points;
          g.fillTabs(points);
          int faces = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          tags.emplace_back(faces, "unfold:tabs");
          // We want each of these to be a separate shape.
          for (size_t nth = 0; nth < points.size(); nth += 4) {
            Polygon_2 polygon;
            polygon.push_back(points[nth + 0]);
            polygon.push_back(points[nth + 1]);
            polygon.push_back(points[nth + 3]);
            polygon.push_back(points[nth + 2]);
            geometry->pwh(faces).emplace_back(polygon);
          }
        }

        const auto& bestPlanarFaces = g.getBestPlanarFaces();
        for (const auto& edge : g.getBestEdges()) {
          // TODO: Include angle magnitude.
          const auto vs1 = edge.getSourceS2(bestPlanarFaces);
          const auto vs2 = edge.getTargetS2(bestPlanarFaces);
          const Point s1(vs1.x, vs1.y, 0);
          const Point s2(vs2.x, vs2.y, 0);
          const auto vt1 = edge.getSourceT2(bestPlanarFaces);
          const auto vt2 = edge.getTargetT2(bestPlanarFaces);
          const Point t1(vt1.x, vt1.y, 0);
          const Point t2(vt2.x, vt2.y, 0);
          if (edge.getAngle() == 0) {
            // We exclude flat edges, since they do not contribute to the
            // geometry.
          } else if (t1 != s1 || t2 != s2) {
            // This edge was split, include both sides.
            {
              int edge = geometry->add(GEOMETRY_SEGMENTS);
              Transformation t =
                  computeInverseSegmentTransform(s1, s2, Vector(0, 0, 1));
              geometry->segments(edge).emplace_back(s1, s2);
              geometry->setTransform(edge, t.inverse());
              tags.emplace_back(edge, "unfold:edge");
            }
            {
              int edge = geometry->add(GEOMETRY_SEGMENTS);
              Transformation t =
                  computeInverseSegmentTransform(t2, t1, Vector(0, 0, 1));
              geometry->segments(edge).emplace_back(t2, t1);
              geometry->setTransform(edge, t.inverse());
              tags.emplace_back(edge, "unfold:edge");
            }
          } else {
            // This edge was not split, but with a fold -- include one side.
            int edge = geometry->add(GEOMETRY_SEGMENTS);
            Transformation t =
                computeInverseSegmentTransform(s1, s2, Vector(0, 0, 1));
            geometry->segments(edge).emplace_back(s1, s2);
            geometry->setTransform(edge, t.inverse());
            tags.emplace_back(edge, "unfold:edge");
          }
        }
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
