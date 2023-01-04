#pragma once

struct Edge {
  Edge(const Segment& segment, const Point& normal, int face_id)
      : segment(segment), normal(normal), face_id(face_id) {}

  Edge(const Segment& segment, const Point& normal)
      : segment(segment), normal(normal), face_id(-1) {}

  Segment segment;
  Point normal;
  int face_id;
};

typedef std::vector<Edge> Edges;

