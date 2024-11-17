// Derived from https://github.com/AnimaNoProject/mu3d under MIT license.

#include <CGAL/Polygon_mesh_processing/repair.h>
#include <CGAL/Polyhedron_3.h>
#include <CGAL/Simple_cartesian.h>
#include <CGAL/squared_distance_3.h>
#include <math.h>
#include <stdlib.h>

#include <cmath>
#include <fstream>
#include <glm.hpp>
#include <iostream>
#include <list>
#include <map>
#include <random>
#include <string>
#include <vector>

#define MU3D_NDEBUG

namespace mu3d {

typedef CGAL::Simple_cartesian<double> Kernel;
typedef CGAL::Polyhedron_3<Kernel> Polyhedron;
typedef Polyhedron::Halfedge_handle Halfedge;
typedef Polyhedron::Facet_handle Facet;

static bool inside(glm::dvec2& p, glm::dvec2& p1, glm::dvec2& p2) {
  return (p2.y - p1.y) * p.x + (p1.x - p2.x) * p.y +
             (p2.x * p1.y - p1.x * p2.y) <
         0;
}

static glm::dvec2 intersection(glm::dvec2& cp1, glm::dvec2& cp2, glm::dvec2& s,
                               glm::dvec2& e) {
  glm::dvec2 dc = {cp1.x - cp2.x, cp1.y - cp2.y};
  glm::dvec2 dp = {s.x - e.x, s.y - e.y};

  double n1 = cp1.x * cp2.y - cp1.y * cp2.x;
  double n2 = s.x * e.y - s.y * e.x;
  double n3 = 1.0f / (dc.x * dp.y - dc.y * dp.x);

  return {(n1 * dp.x - n2 * dc.x) * n3, (n1 * dp.y - n2 * dc.y) * n3};
}

static glm::dvec3 point_to_vector(const Kernel::Point_3& point) {
  return glm::dvec3(point.x(), point.y(), point.z());
}

static void planar(const glm::dvec3& A, const glm::dvec3& B,
                   const glm::dvec3& C, glm::dvec2& a, glm::dvec2& b,
                   glm::dvec2& c) {
  double lengthAB = glm::length(A - B);

  a = glm::dvec2(0, 0);
  b = glm::dvec2(lengthAB, 0);

  double s = glm::length(glm::cross(B - A, C - A)) / std::pow(lengthAB, 2);
  double cl = glm::dot(B - A, C - A) / std::pow(lengthAB, 2);

  c = glm::dvec2(a.x + cl * (b.x - a.x) - s * (b.y - a.y),
                 a.y + cl * (b.y - a.y) + s * (b.x - a.x));
}

static void planar(const glm::dvec3& P1, const glm::dvec3& P2,
                   const glm::dvec3& Pu, const glm::dvec2& p1,
                   const glm::dvec2& p2, const glm::dvec2& p3prev,
                   glm::dvec2& pu, bool flip = false) {
  double length = glm::length(p1 - p2);

  double s =
      glm::length(glm::cross((P2 - P1), (Pu - P1))) / std::pow(length, 2);
  double unkown = glm::dot((P2 - P1), (Pu - P1)) / std::pow(length, 2);

  glm::dvec2 pu1 =
      glm::dvec2(p1.x + unkown * (p2.x - p1.x) + s * (p2.y - p1.y),
                 p1.y + unkown * (p2.y - p1.y) - s * (p2.x - p1.x));

  glm::dvec2 pu2 =
      glm::dvec2(p1.x + unkown * (p2.x - p1.x) - s * (p2.y - p1.y),
                 p1.y + unkown * (p2.y - p1.y) + s * (p2.x - p1.x));

  // the points that are not shared by the triangles need to be on opposite
  // sites
  if (((((p3prev.x - p1.x) * (p2.y - p1.y) - (p3prev.y - p1.y) * (p2.x - p1.x) <
         0) &&
        ((pu1.x - p1.x) * (p2.y - p1.y) - (pu1.y - p1.y) * (p2.x - p1.x) >
         0))) ||
      ((((p3prev.x - p1.x) * (p2.y - p1.y) - (p3prev.y - p1.y) * (p2.x - p1.x) >
         0) &&
        ((pu1.x - p1.x) * (p2.y - p1.y) - (pu1.y - p1.y) * (p2.x - p1.x) <
         0)))) {
    pu = flip ? pu2 : pu1;
  } else {
    pu = flip ? pu1 : pu2;
  }
}

static void print_progress(int block_idx, double energy) {
#ifndef MU3D_NDEBUG
  for (int i = 0; i < block_idx; i++) {
    std::cout << "[]";
  }

  for (int i = block_idx; i < 10; i++) {
    std::cout << "_";
  }

  std::cout << " " << block_idx / 10.0f * 100 << "% with " << energy
            << std::endl;
#endif
}

static double sh_overlapping_area(glm::dvec2& a, glm::dvec2& b, glm::dvec2& c,
                                  glm::dvec2& p, glm::dvec2& q, glm::dvec2& r) {
  std::vector<glm::dvec2> subject_polygon = {a, b, c};
  std::vector<glm::dvec2> new_polygon = {a, b, c};
  std::vector<glm::dvec2> input_polygon;
  std::vector<glm::dvec2> clipper = {p, q, r};

  for (size_t j = 0; j < clipper.size(); j++) {
    input_polygon.clear();
    for (size_t k = 0; k < new_polygon.size(); k++) {
      input_polygon.push_back(new_polygon[k]);
    }
    new_polygon.clear();

    glm::dvec2 cp1 = clipper[j];
    glm::dvec2 cp2 = clipper[(j + 1) % 3];

    for (size_t i = 0; i < input_polygon.size(); i++) {
      glm::dvec2 s = input_polygon[i];
      glm::dvec2 e = input_polygon[(i + 1) % input_polygon.size()];

      // both vertex inside
      if (inside(s, cp1, cp2) && inside(e, cp1, cp2)) {
        new_polygon.push_back(e);
      }
      // first vertex outside, second inside
      else if (!inside(s, cp1, cp2) && inside(e, cp1, cp2)) {
        new_polygon.push_back(intersection(cp1, cp2, s, e));
        new_polygon.push_back(e);
      }
      // first vertex inside, second one outside
      else if (inside(s, cp1, cp2) && !inside(e, cp1, cp2)) {
        new_polygon.push_back(intersection(cp1, cp2, s, e));
      }
      // else both vertices outside
    }
  }

  std::sort(new_polygon.begin(), new_polygon.end(),
            [](const glm::dvec2& p1, const glm::dvec2& p2) {
              return -std::atan2(p1.x, -p1.y) < -std::atan2(p2.x, -p2.y);
            });

  double leftSum = 0.0;
  double rightSum = 0.0;

  for (size_t i = 0; i < new_polygon.size(); i++) {
    int j = (i + 1) % new_polygon.size();
    leftSum += new_polygon[i].x * new_polygon[j].y;
    rightSum += new_polygon[j].x * new_polygon[i].y;
  }

  double area = 0.5f * glm::abs(leftSum - rightSum);
  if (area < 1e-5)  // eliminate the cases where two triangles share one vertex
  {
    return 0;
  }
  return area;
}

class FaceToPlane {
 public:
  glm::dvec3 A;
  glm::dvec3 B;
  glm::dvec3 C;

  glm::dvec2 a;
  glm::dvec2 b;
  glm::dvec2 c;

  bool _overlaps;

  long parent;
  long self;

  ~FaceToPlane() {}
  FaceToPlane() : _overlaps(false) {}

  double overlaps(FaceToPlane& other) {
    return sh_overlapping_area(a, b, c, other.a, other.b, other.c);
  }

  glm::dvec2 const& get(glm::dvec3 const& vec) const {
    if (vec == A) return a;
    if (vec == B) return b;
    if (vec == C) return c;
    throw std::invalid_argument(
        "something went wrong trying to retrieve 2D representation");
  }

  glm::dvec3 const& get(glm::dvec2 const& vec) const {
    if (vec == a) return A;
    if (vec == b) return B;
    if (vec == c) return C;
    throw std::invalid_argument(
        "something went wrong trying to retrieve 3D representation");
  }

  glm::dvec3 const& get(glm::dvec3 const& one, glm::dvec3 const& two) const {
    if (one != A && two != A) return A;
    if (one != B && two != B) return B;
    if (one != C && two != C) return C;
    throw std::invalid_argument("something went wrong");
  }

 private:
  static glm::dvec3 _color;
  static glm::dvec3 _colorOverlap;
};

class Edge {
 public:
  Edge() {}
  Edge(int sFace, int tFace, glm::dvec3 middle, Halfedge halfedge,
       Facet sFacetHandle, Facet tFacetHandle)
      : _sFace(sFace),
        _tFace(tFace),
        _sFacetHandle(sFacetHandle),
        _tFacetHandle(tFacetHandle),
        _halfedge(halfedge),
        _weight(double(std::rand()) / RAND_MAX) {
    /*
     * Calculate if the edge is bent inwards or outwards.
     * */
    isInwards = true;

    glm::dvec3 A = point_to_vector(sFacetHandle->halfedge()->vertex()->point());
    glm::dvec3 B =
        point_to_vector(sFacetHandle->halfedge()->next()->vertex()->point());
    glm::dvec3 C = point_to_vector(
        sFacetHandle->halfedge()->next()->next()->vertex()->point());

    glm::dvec3 F = point_to_vector(tFacetHandle->halfedge()->vertex()->point());
    glm::dvec3 G =
        point_to_vector(tFacetHandle->halfedge()->next()->vertex()->point());
    glm::dvec3 H = point_to_vector(
        tFacetHandle->halfedge()->next()->next()->vertex()->point());

    glm::dvec3 p;
    glm::dvec3 q;

    if (A != F && A != G && A != H) {
      p = A;
      q = B;
    } else if (B != F && B != G && B != H) {
      p = B;
      q = C;
    } else if (C != F && C != G && C != H) {
      p = C;
      q = A;
    }

    glm::dvec3 e = p - q;
    glm::dvec3 n = glm::cross(G - F, H - G);
    angle = glm::dot(e, n);
    if (angle <= 0) {
      isInwards = false;
    }
  }

  ~Edge() {}

  bool isNeighbour(const Edge& edge) {
    return _halfedge->vertex() == edge._halfedge->vertex() ||
           _halfedge->prev()->vertex() == edge._halfedge->vertex() ||
           _halfedge->vertex() == edge._halfedge->prev()->vertex() ||
           _halfedge->prev()->vertex() == edge._halfedge->prev()->vertex();
  }

  bool is(int A, int B) {
    return (_sFace == A && _tFace == B) || (_sFace == B && _tFace == A);
  }

  bool operator==(const Edge& other) const {
    return (_sFace == other._sFace && _tFace == other._tFace) ||
           (_sFace == other._tFace && _tFace == other._sFace);
  }

  bool operator<(const Edge& other) const { return _weight < other._weight; }

  glm::dvec2 getSourceS2(const std::vector<FaceToPlane>& f2p) const {
    return f2p[_sFace].get(
        point_to_vector(_halfedge->prev()->vertex()->point()));
  }

  glm::dvec2 getTargetS2(const std::vector<FaceToPlane>& f2p) const {
    return f2p[_sFace].get(point_to_vector(_halfedge->vertex()->point()));
  }

  glm::dvec2 getSourceT2(const std::vector<FaceToPlane>& f2p) const {
    return f2p[_tFace].get(
        point_to_vector(_halfedge->prev()->vertex()->point()));
  }

  glm::dvec2 getTargetT2(const std::vector<FaceToPlane>& f2p) const {
    return f2p[_tFace].get(point_to_vector(_halfedge->vertex()->point()));
  }

  double getAngle() const { return angle; }

  int _sFace;
  int _tFace;
  Facet _sFacetHandle;
  Facet _tFacetHandle;
  Halfedge _halfedge;
  double _weight;
  bool isInwards;
  double angle = 0;
};

class Gluetab {
 public:
  int _placedFace;
  int _targetFace;
  Edge _edge;
  glm::dvec3 _bl;
  glm::dvec3 _br;
  glm::dvec3 _tl;
  glm::dvec3 _tr;

  double _probability;

  Gluetab(Edge& edge, bool flag) : _edge(edge), _probability(0) {
    Facet face;

    if (flag) {
      _placedFace = edge._sFace;
      _targetFace = edge._tFace;
      face = edge._tFacetHandle;
    } else {
      _placedFace = edge._tFace;
      _targetFace = edge._sFace;
      face = edge._sFacetHandle;
    }

    // get the bottom left corner of the base
    _bl = glm::dvec3(_edge._halfedge->vertex()->point().x(),
                     _edge._halfedge->vertex()->point().y(),
                     _edge._halfedge->vertex()->point().z());

    // get the bottom right corner of the base
    _br = glm::dvec3(_edge._halfedge->prev()->vertex()->point().x(),
                     _edge._halfedge->prev()->vertex()->point().y(),
                     _edge._halfedge->prev()->vertex()->point().z());

    // get the vertex where the gluetab is extruded to
    glm::dvec3 target;
    // Polyhedron::Halfedge_around_facet_circulator hfc = face->facet_begin();
    auto hfc = face->facet_begin();
    do {
      target =
          glm::dvec3(hfc->vertex()->point().x(), hfc->vertex()->point().y(),
                     hfc->vertex()->point().z());

      // if the vertex is neither the bottom right or bottom left it is the
      // target
      if (target != _bl && target != _br) {
        break;
      }
    } while (++hfc != face->facet_begin());

    glm::dvec3 side = (_br - _bl) / 8.0;

    _tr = _br + (target - _br) / 3.0 - side * 1.8;
    _tl = _bl + (target - _bl) / 3.0 + side * 1.8;

    _br = _br - side;
    _bl = _bl + side;
  }

  bool operator<(const Gluetab& other) const {
    return _probability < other._probability;
  }
};

class GluetabToPlane {
 public:
  glm::dvec2 a;
  glm::dvec2 b;
  glm::dvec2 c;
  glm::dvec2 d;

  bool _overlaps;

  long faceindex;
  long self;

  Gluetab* _gluetag;

  GluetabToPlane(Gluetab* gluetab) : _gluetag(gluetab) {}

  ~GluetabToPlane() {}

  double overlaps(GluetabToPlane& other) {
    return sh_overlapping_area(a, b, c, other.a, other.b, other.c) +
           sh_overlapping_area(c, b, d, other.a, other.b, other.c) +
           sh_overlapping_area(a, b, c, other.c, other.b, other.d) +
           sh_overlapping_area(c, b, d, other.c, other.b, other.d);
  }

  double overlaps(FaceToPlane& other) {
    return sh_overlapping_area(a, b, c, other.a, other.b, other.c) +
           sh_overlapping_area(c, b, d, other.a, other.b, other.c);
  }

  glm::dvec2 const& get(glm::dvec3 const& vec) const {
    if (vec == _gluetag->_bl) return a;
    if (vec == _gluetag->_br) return b;
    if (vec == _gluetag->_tl) return c;
    if (vec == _gluetag->_tr) return d;
    throw std::invalid_argument(
        "something went wrong trying to retrieve 2D representation");
  }

  glm::dvec3 const& get(glm::dvec2 const& vec) const {
    if (vec == a) return _gluetag->_bl;
    if (vec == b) return _gluetag->_br;
    if (vec == c) return _gluetag->_tl;
    if (vec == d) return _gluetag->_tr;

    throw std::invalid_argument(
        "something went wrong trying to retrieve 3D representation");
  }
};

template <typename Point_2>
class Graph {
 public:
  Graph()
      : _Cenergy(0),
        _maxtemp(0),
        _optEnergy(0),
        _optimise(false),
        _opttemperature(0),
        _temperature(0),
        _distribution(0.0, 1.0) {
    srand(static_cast<unsigned int>(time(NULL)));
  }

  ~Graph() {}

  void load(Polyhedron& mesh) {
    for (auto v = mesh.vertices_begin(); v != mesh.vertices_end(); v++) {
      // there should be no non-manifold vertices
      assert(!CGAL::Polygon_mesh_processing::is_non_manifold_vertex(v, mesh));
    }

    size_t face_id = 0;
    for (Polyhedron::Facet_iterator fi = mesh.facets_begin();
         fi != mesh.facets_end(); ++fi) {
      _facets.insert(std::make_pair(face_id++, fi));
    }
  }

  bool unfold(int max_its, int opt_its) {
    srand(0);
    initialise(max_its, opt_its);

    int progress = 0;
    int blockpit = static_cast<int>(ceil(max_its / 10));
    print_progress(0, _Cenergy);

    while (_temperature > 0 && _Cenergy > 0.0f) {
      next();
      if (static_cast<int>(_temperature) % blockpit == 0) {
        progress++;
        print_progress(progress, _Cenergy);
      }
    }

    print_progress(10, _Cenergy);

    while (_opttemperature > 0.0f) {
      next_optimise();
    }

    return _Cenergy <= 0.0f;
  }

  void fillPoints(std::vector<Point_2>& points) {
    for (auto& f2p : getBestPlanarFaces()) {
      const auto& a = f2p.a;
      const auto& b = f2p.b;
      const auto& c = f2p.c;
      points.emplace_back(a.x, a.y);
      points.emplace_back(b.x, b.y);
      points.emplace_back(c.x, c.y);
    }
  }

  void fillTabs(std::vector<Point_2>& points) {
    for (auto& f2p : _CplanarGluetabs) {
      const auto& a = f2p.a;
      const auto& b = f2p.b;
      const auto& c = f2p.c;
      const auto& d = f2p.d;
      points.emplace_back(a.x, a.y);
      points.emplace_back(b.x, b.y);
      points.emplace_back(c.x, c.y);
      points.emplace_back(d.x, d.y);
    }
  }

  const std::vector<FaceToPlane>& getBestPlanarFaces() const {
    return _CplanarFaces;
  }

  const std::vector<Edge>& getBestEdges() { return _C; }

 private:
  std::map<int, Facet> _facets;
  std::vector<Edge> _edges;
  std::vector<Gluetab> _gluetags;

  /** Calculated each epoch **/
  std::vector<Edge> _mspEdges;
  std::vector<Edge> _cutEdges;
  std::vector<Gluetab> _necessaryGluetabs;
  std::vector<std::vector<size_t>> _tree;

  /** Best calculated Solution **/
  std::vector<Edge> _C;
  std::vector<Gluetab> _Cgt;
  std::vector<FaceToPlane> _CplanarFaces;
  std::vector<GluetabToPlane> _CplanarGluetabs;
  std::vector<GluetabToPlane> _CplanarMirrorGT;

  std::vector<FaceToPlane> _planarFaces;
  std::vector<GluetabToPlane> _planarGluetabs;

  double _Cenergy;
  float _maxtemp;
  double _optEnergy;
  bool _optimise;
  float _opttemperature;
  int _temperature;
  std::default_random_engine _generator;
  std::uniform_real_distribution<double> _distribution;

  void initialise(int max_its, int opt_its) {
    assign_edge_weights();

    // calculate the dualgraph and an initial MSP and Gluetags
    compute_dual();
    compute_mst();
    compute_gluetabs(_gluetags);

    _temperature = max_its;
    _maxtemp = static_cast<float>(max_its);
    _opttemperature = static_cast<float>(opt_its);
    _optimise = opt_its == 0;

    // initialize the energy with this unfolding
    unfold_mesh();
    unfold_gluetabs();

    // it is the best we have
    _Cgt = _gluetags;
    _C = _edges;
    _Cenergy = overlapping_area_mesh() + overlapping_area_gluetabs();
    _CplanarFaces = _planarFaces;
    _CplanarGluetabs = _planarGluetabs;
  }

  void next() {
    rand_step();
    // calculate a new spanning tree and gluetags
    compute_mst();
    compute_gluetabs(_gluetags);
    // unfold and check for overlaps
    unfold_mesh();
    unfold_gluetabs();
    double newEnergy = overlapping_area_mesh() + overlapping_area_gluetabs();

    // if it got better we take the new graph
    if (newEnergy < _Cenergy ||
        // or acceptance probability high enough
        std::exp((_Cenergy - newEnergy) / _temperature) / 100.0 >
            _distribution(_generator)) {
      _Cgt.clear();
      _C.clear();

      _Cgt = _gluetags;
      _C = _edges;
      _Cenergy = newEnergy;

      _CplanarFaces.clear();
      _CplanarGluetabs.clear();

      _CplanarFaces = _planarFaces;
      _CplanarGluetabs = _planarGluetabs;
    }
    // continue working with the best
    else {
      _edges.clear();
      _gluetags.clear();

      _edges = _C;
      _gluetags = _Cgt;
    }

    if (_Cenergy <= 0.0f) {
      _optimise = true;
      _optEnergy = compactness();
    }

    // end epoch
    _temperature -= 1;
  }

  void next_optimise() {
    rand_step();

    // calculate a new spanning tree and gluetags
    compute_mst();
    compute_gluetabs(_gluetags);

    // unfold and check for overlaps
    unfold_mesh();
    double trioverlaps = overlapping_area_mesh();
    double gtoverlaps = 0;

    if (trioverlaps <= 0) {
      unfold_gluetabs();
      gtoverlaps = overlapping_area_gluetabs();

      if (gtoverlaps > 0) {
        _edges.clear();
        _gluetags.clear();

        _edges = _C;
        _gluetags = _Cgt;
      }
    } else {
      _edges.clear();
      _gluetags.clear();

      _edges = _C;
      _gluetags = _Cgt;
    }

    double newEnergy = compactness();
    // if it got better we take the new graph
    if (newEnergy <= _optEnergy) {
      _Cgt.clear();
      _C.clear();

      _Cgt = _gluetags;
      _C = _edges;
      _optEnergy = newEnergy;

      _CplanarFaces.clear();
      _CplanarGluetabs.clear();

      _CplanarFaces = _planarFaces;
      _CplanarGluetabs = _planarGluetabs;
    }
    // continue working with the best
    else {
      _edges.clear();
      _gluetags.clear();

      _edges = _C;
      _gluetags = _Cgt;
    }

    // end epoch
    _opttemperature -= 1;
  }

  void compute_gluetab_target(std::vector<GluetabToPlane>& gluetabs) {
    for (auto gttp : gluetabs) {
      int index = gttp._gluetag->_targetFace;
      Polyhedron::Halfedge_around_facet_circulator hfc =
          _facets[index]->facet_begin();
      const auto& gt = gttp._gluetag;
      do {
        glm::dvec3 Pu = point_to_vector(hfc->vertex()->point());

        // if this vertex is not shared it is the unkown one
        if (Pu != point_to_vector(gt->_edge._halfedge->vertex()->point()) &&
            Pu != point_to_vector(
                      gt->_edge._halfedge->prev()->vertex()->point())) {
          glm::dvec3 P1 =
              point_to_vector(hfc->next()->vertex()->point());  // bottom left
          glm::dvec3 P2 = point_to_vector(
              hfc->next()->next()->vertex()->point());  // bottom right

          glm::dvec2 p1 = _planarFaces[size_t(index)].get(P1);
          glm::dvec2 p2 = _planarFaces[size_t(index)].get(P2);
          glm::dvec2 p3prev = _planarFaces[size_t(index)].get(Pu);

          GluetabToPlane mirror(gt);

          if (P1 == gt->_br) {
            mirror.a = p1;
            mirror.b = p2;
          } else {
            mirror.b = p1;
            mirror.a = p2;
          }

          glm::dvec2 side = (mirror.b - mirror.a) / 8.0;

          mirror.b = mirror.b - side;
          mirror.a = mirror.a + side;

          planar(gt->_br, gt->_bl, gt->_tr, mirror.a, mirror.b, p3prev,
                 mirror.c, true);
          planar(gt->_br, gt->_bl, gt->_tl, mirror.a, mirror.b, p3prev,
                 mirror.d, true);

          _CplanarMirrorGT.push_back(mirror);
        }
      } while (++hfc != _facets[int(index)]->facet_begin());
    }
  }

  void compute_dual() {
    // loop through all faces
    for (std::pair<int, Facet> facet : _facets) {
      int faceId = facet.first;

      // loop through halfedges of all faces and add the dual edges, that were
      // not added yet use distance as weight
      Polyhedron::Halfedge_around_facet_circulator hfc =
          facet.second->facet_begin();
      do {
        // get the opposing face
        int oppositeFaceId = find(hfc->opposite()->facet());

        // center of the edge
        glm::dvec3 center = (point_to_vector(hfc->prev()->vertex()->point()) +
                             point_to_vector(hfc->vertex()->point())) *
                            (double)0.5;

        Edge e(faceId, oppositeFaceId, center, hfc, _facets[faceId],
               _facets[oppositeFaceId]);

        // if this edge doesn't exist already, add it (don't consider direction)
        if (!find(e)) {
          _edges.push_back(e);
        }

      } while (++hfc != facet.second->facet_begin());
    }

    // calculate all possible gluetags
    for (Edge& e : _edges) {
      Gluetab gt = Gluetab(e, true);
      _gluetags.push_back(gt);
      gt = Gluetab(e, false);
      _gluetags.push_back(gt);
    }
  }

  void compute_mst() {
    // clear the previous msp edges
    _mspEdges.clear();
    _cutEdges.clear();

    // sort edges from smallest to biggest, better cut big ones
    std::sort(_edges.begin(), _edges.end());

    // create the adjacence list
    std::vector<std::vector<int>> adjacenceList;
    adjacenceList.resize(_facets.size());

    // go through all possible edges
    for (Edge& edge : _edges) {
      // add edge to msp, add adjacent faces
      _mspEdges.push_back(edge);
      adjacenceList[size_t(edge._sFace)].push_back(edge._tFace);
      adjacenceList[size_t(edge._tFace)].push_back(edge._sFace);

      // list storing discovered nodes
      std::vector<bool> discovered(_facets.size());

      // if the MSP is now cyclic, the added edge needs to be removed again
      for (int i = 0; i < int(_facets.size()); i++) {
        // if the node is alone (no incident edges), or already discovered, no
        // need to check
        if (adjacenceList[size_t(i)].empty() || discovered[size_t(i)]) continue;

        // if the graph is cyclic
        if (!is_acyclic(adjacenceList, i, discovered, -1)) {
          _mspEdges.erase(remove(_mspEdges.begin(), _mspEdges.end(), edge),
                          _mspEdges.end());

          // add edge to the "to be cut" list
          _cutEdges.push_back(edge);

          // cleanup the adjacence list
          adjacenceList[size_t(edge._sFace)].erase(
              remove(adjacenceList[size_t(edge._sFace)].begin(),
                     adjacenceList[size_t(edge._sFace)].end(), edge._tFace),
              adjacenceList[size_t(edge._sFace)].end());
          adjacenceList[size_t(edge._tFace)].erase(
              remove(adjacenceList[size_t(edge._tFace)].begin(),
                     adjacenceList[size_t(edge._tFace)].end(), edge._sFace),
              adjacenceList[size_t(edge._tFace)].end());

          // no need to continue checking
          break;
        }
      }
    }

#ifndef MU3D_NDEBUG
    // show the number of faces and edgesd::endl;
    std::cout << "number of faces: " << _facets.size() << std::endl;
    std::cout << "number of edges: " << _mspEdges.size() << std::endl;

    // show all edges of the MSP
    std::cout << "MSP over the edges" << std::endl;
    for (Edge& edge : _mspEdges)
      std::cout << "Edge: " << edge._sFace << "<->" << edge._tFace << std::endl;

    // check if the graph is a single component
    if (is_single_component(adjacenceList))
      std::cout << "Graph is a single component!" << std::endl;
    else
      std::cout << "Graph is a NOT single component!" << std::endl;
#endif
  }

  void compute_gluetabs(std::vector<Gluetab> gluetabs) {
    // clear old gluetags
    _necessaryGluetabs.clear();

#ifndef MU3D_NDEBUG
    std::cout << "Gluetags: " << _cutEdges.size() << std::endl;
    std::cout << "Edges 'to be bent': " << _mspEdges.size() << std::endl;
#endif

    std::vector<bool> tagged;
    tagged.resize(_facets.size());

    for (Gluetab& gt : gluetabs) {
      // if the edge the gluetag is attached to is not a cut edge we skip this
      // gluetag
      if (std::find(_cutEdges.begin(), _cutEdges.end(), gt._edge) ==
          _cutEdges.end()) {
        continue;
      }

      // go through all already added gluetags, if the complimentary gluetag was
      // already added we skip this one
      bool found = false;
      for (Gluetab& other : _necessaryGluetabs) {
        if (gt._edge == other._edge) {
          found = true;
          break;
        }
      }

      if (found) {
        continue;
      }

      // count all the cut-edge-neighbours of this gluetags edge
      int neighbours = 0;
      for (Edge& edge : _cutEdges) {
        if (edge.isNeighbour(gt._edge)) {
          neighbours++;
        }
      }

      // now check how many of the cut-edge-neighbours have a gluetag
      for (Gluetab& gluneighbours : _necessaryGluetabs) {
        if (gt._edge.isNeighbour(gluneighbours._edge)) {
          neighbours--;
        }
      }

      // if neither the placed Face nor the target Face are tagged OR 2 or more
      // cut-edge-neighbours have no gluetag THEN this one is necessary
      if ((!tagged[size_t(gt._placedFace)] &&
           !tagged[size_t(gt._targetFace)]) ||
          neighbours > 1) {
        tagged[size_t(gt._placedFace)] = true;
        tagged[size_t(gt._targetFace)] = true;
        _necessaryGluetabs.push_back(gt);
      }
    }

#ifndef MU3D_NDEBUG
    std::cout << "Necessary Gluetags: " << _necessaryGluetabs.size()
              << std::endl;
#endif
  }

  void unfold_mesh() {
    std::vector<bool> discovered;
    discovered.resize(_facets.size());
    _planarFaces.clear();
    _planarFaces.resize(_facets.size());
    _planarGluetabs.clear();
    reset_tree();
    unfold_mesh(0, discovered, 0);
  }

  void unfold_mesh(int index, std::vector<bool>& discovered, int parent) {
    // only the case for the first triangle
    if (index == parent) {
      Facet facet = _facets[int(index)];

      _planarFaces[size_t(index)].A =
          point_to_vector(facet->facet_begin()->vertex()->point());
      _planarFaces[size_t(index)].B =
          point_to_vector(facet->facet_begin()->next()->vertex()->point());
      _planarFaces[size_t(index)].C = point_to_vector(
          facet->facet_begin()->next()->next()->vertex()->point());

      planar(_planarFaces[size_t(index)].A, _planarFaces[size_t(index)].B,
             _planarFaces[size_t(index)].C, _planarFaces[size_t(index)].a,
             _planarFaces[size_t(index)].b, _planarFaces[size_t(index)].c);

      _planarFaces[size_t(index)].parent = index;
      _planarFaces[size_t(index)].self = index;
    } else {
      // determine which Vertices are known
      Polyhedron::Halfedge_around_facet_circulator hfc =
          _facets[int(index)]->facet_begin();
      do {
        glm::dvec3 Pu = point_to_vector(hfc->vertex()->point());
        // if this vertex is not shared it is the unkown one
        if (Pu != _planarFaces[size_t(parent)].A &&
            Pu != _planarFaces[size_t(parent)].B &&
            Pu != _planarFaces[size_t(parent)].C) {  // bottom right
          glm::dvec3 P1 = point_to_vector(hfc->next()->vertex()->point());
          glm::dvec3 P2 =
              point_to_vector(hfc->next()->next()->vertex()->point());

          glm::dvec2 p1 = _planarFaces[size_t(parent)].get(P1);
          glm::dvec2 p2 = _planarFaces[size_t(parent)].get(P2);
          glm::dvec2 p3prev = _planarFaces[size_t(parent)].get(
              _planarFaces[size_t(parent)].get(P1, P2));

          _planarFaces[size_t(index)].A = P1;
          _planarFaces[size_t(index)].B = P2;
          _planarFaces[size_t(index)].C = Pu;
          _planarFaces[size_t(index)].a = p1;
          _planarFaces[size_t(index)].b = p2;

          _planarFaces[size_t(index)].self = int(index);
          _planarFaces[size_t(index)].parent = int(parent);

          planar(P1, P2, Pu, p1, p2, p3prev, _planarFaces[size_t(index)].c);
          break;
        }
      } while (++hfc != _facets[int(index)]->facet_begin());
    }

    discovered[size_t(index)] = true;
    // go through all adjacent edges
    for (size_t i = 0; i < _tree[size_t(index)].size(); ++i) {
      if (!discovered[size_t(_tree[size_t(index)][i])]) {
        unfold_mesh(int(_tree[int(index)][i]), discovered, int(index));
      }
    }
  }

  void unfold_gluetabs() {
    _planarGluetabs.clear();
    for (Gluetab& gt : _necessaryGluetabs) {
      int index = gt._placedFace;
      Polyhedron::Halfedge_around_facet_circulator hfc =
          _facets[index]->facet_begin();
      do {
        glm::dvec3 Pu = point_to_vector(hfc->vertex()->point());

        // if this vertex is not shared it is the unkown one
        if (Pu != point_to_vector(gt._edge._halfedge->vertex()->point()) &&
            Pu != point_to_vector(
                      gt._edge._halfedge->prev()->vertex()->point())) {
          glm::dvec3 P1 =
              point_to_vector(hfc->next()->vertex()->point());  // bottom left
          glm::dvec3 P2 = point_to_vector(
              hfc->next()->next()->vertex()->point());  // bottom right

          glm::dvec2 p1 = _planarFaces[size_t(index)].get(P1);
          glm::dvec2 p2 = _planarFaces[size_t(index)].get(P2);
          glm::dvec2 p3prev = _planarFaces[size_t(index)].get(Pu);

          GluetabToPlane tmp(&gt);

          if (P1 == gt._bl) {
            tmp.a = p1;
            tmp.b = p2;
          } else {
            tmp.b = p1;
            tmp.a = p2;
          }

          glm::dvec2 side = (tmp.b - tmp.a) / 8.0;

          tmp.b = tmp.b - side;
          tmp.a = tmp.a + side;

          planar(gt._bl, gt._br, gt._tl, tmp.a, tmp.b, p3prev, tmp.c);
          planar(gt._bl, gt._br, gt._tr, tmp.a, tmp.b, p3prev, tmp.d);

          tmp._overlaps = false;
          tmp.faceindex = index;

          _planarGluetabs.push_back(tmp);
        }
      } while (++hfc != _facets[int(index)]->facet_begin());
    }
  }

  double overlapping_area_mesh() {
    double overlaps = 0;

    for (size_t i = 0; i < _planarFaces.size(); i++) {
      if (_planarFaces[i]._overlaps) continue;

      for (size_t j = i + 1; j < _planarFaces.size(); j++) {
        if (_planarFaces[j]._overlaps) continue;

        if (_planarFaces[i].self == _planarFaces[j].self ||
            _planarFaces[i].parent == _planarFaces[j].self ||
            _planarFaces[i].self == _planarFaces[j].parent ||
            _planarFaces[i].parent == _planarFaces[j].parent)
          continue;

        double area = _planarFaces[j].overlaps(_planarFaces[i]);
        if (area > 0) {
          overlaps += area;
          _planarFaces[j]._overlaps = true;
          _planarFaces[i]._overlaps = true;
          break;
        }
      }
    }
    return overlaps;
  }

  double overlapping_area_gluetabs() {
    double overlaps = 0;

    for (GluetabToPlane& gt : _planarGluetabs) {
      for (FaceToPlane& face : _planarFaces) {
        if (gt.faceindex == face.self) continue;

        double area = gt.overlaps(face);
        if (area > 0) {
          overlaps += area;
          gt._overlaps = true;
          break;
        }
      }
    }

    for (size_t i = 0; i < _planarGluetabs.size(); i++) {
      for (size_t j = i + 1; j < _planarGluetabs.size(); j++) {
        double area = _planarGluetabs[j].overlaps(_planarGluetabs[i]);
        if (area > 0) {
          overlaps += area;
          _planarGluetabs[j]._overlaps = true;
          break;
        }
      }
    }
    return overlaps;
  }

  void rand_step() {
    // take a random edge and change it's weight
    size_t random = size_t(rand()) % (_edges.size());
    _edges[random]._weight = ((double)rand() / (RAND_MAX)) + 1;
  }

  void reset_tree() {
    _tree.clear();
    _tree.resize(_facets.size());
    for (int i = 0; i < int(_facets.size()); ++i) {
      for (Edge& edge : _mspEdges) {
        if (edge._sFace != i) continue;

        _tree[size_t(i)].push_back(edge._tFace);
        _tree[size_t(edge._tFace)].push_back(edge._sFace);
      }
    }
  }

  bool is_single_component(std::vector<std::vector<int>>& adjacenceList) {
    // list storing discovered nodes
    std::vector<bool> discovered(_facets.size());

    // check if it is acyclic from the first node
    if (!is_acyclic(adjacenceList, 0, discovered, -1)) {
      return false;
    }

    // if not all nodes have been discovered, the graph is not connected
    for (size_t i = 0; i < discovered.size(); i++) {
      // if node at index i was not discovered the graph is not connected
      if (!discovered[i]) {
#ifndef MU3D_NDEBUG
        std::cout << "not connected face: " << i << std::endl;
#endif
        return false;
      }
    }
    return true;
  }

  bool is_acyclic(std::vector<std::vector<int>> const& adjacenceList, int start,
                  std::vector<bool>& discovered, int parent) {
    // mark current node as discovered
    discovered[start] = true;

    // loop through every edge from (start -> node(s))
    for (int node : adjacenceList[start]) {
      // if this node was not discovered
      if (!discovered[node]) {
        if (!is_acyclic(adjacenceList, int(node), discovered,
                        int(start)))  // start dfs from node
          return false;
      }
      // node is discovered but not a parent => back-edge (cycle)
      else if (node != parent) {
        return false;
      }
    }

    // graph is acyclic
    return true;
  }

  void assign_edge_weights() {
    // init edge weights
    for (Edge& edge : _edges) {
      edge._weight = ((double)rand() / (RAND_MAX)) + 1;
    }
    // init gluetag probabilities
    for (Gluetab& gluetag : _gluetags) {
      gluetag._probability = ((double)rand() / (RAND_MAX)) + 1;
    }
  }

  double compactness() {
    std::vector<glm::dvec2> points;
    for (FaceToPlane& face : _planarFaces) {
      points.push_back(face.a);
      points.push_back(face.b);
      points.push_back(face.c);
    }

    auto xExtrema =
        std::minmax_element(points.begin(), points.end(),
                            [](const glm::dvec2& lhs, const glm::dvec2& rhs) {
                              return lhs.x < rhs.x;
                            });
    auto yExtrema =
        std::minmax_element(points.begin(), points.end(),
                            [](const glm::dvec2& lhs, const glm::dvec2& rhs) {
                              return lhs.y < rhs.y;
                            });

    glm::dvec2 ul(xExtrema.first->x, yExtrema.first->y);
    glm::dvec2 lr(xExtrema.second->x, yExtrema.second->y);

    return std::abs(lr.x - ul.x) + std::abs(ul.y - lr.y);
  }

  int find(Facet facet) {
    std::map<int, Facet>::iterator it = _facets.begin();

    // iterate through faces of the graph and return the index if found
    while (it != _facets.end()) {
      if (it->second == facet) {
        return it->first;
      }
      it++;
    }
    // else return -1
    return -1;
  }

  bool find(Edge& edge) {
    return std::find(_edges.begin(), _edges.end(), edge) != _edges.end();
  }
};

}  // namespace mu3d
