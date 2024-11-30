#pragma once

#include "Geometry.h"
#include "cast_util.h"
#include "offset_util.h"
#include "point_util.h"
#include "printing.h"
#include "transform_util.h"

static int Pack(Geometry* geometry, size_t count,
                std::vector<double>& orientations, double perimeter_weight,
                double bounds_weight, double holes_weight,
                std::vector<size_t>& sheet_by_input) {
  struct Sheet {
    // Index of the associated sheet geometry.
    size_t geometry_index;

    bool is_bounded;

    // The available region of the sheet.
    std::vector<CGAL::Polygon_with_holes_2<EK>> pwhs;

    // For debugging purposes we keep the last no fit polygon of the sheet.
    std::vector<CGAL::Polygon_with_holes_2<EK>> nfps;
  };

  struct Part {
    // Index of the associated part geometry.
    size_t geometry_index;

    // Footprints of the part for packing.
    std::vector<CGAL::Polygon_with_holes_2<EK>> pwhs;

    // Reversed footprint for inner nfp generation.
    std::vector<CGAL::Polygon_with_holes_2<EK>> npwhs;

    // Offset so that pwhs[0].outer_boundary()[0] is at (0, 0)
    EK::Vector_2 pwhs_offset;

    // By default parts are placed in order of decreasing area.
    EK::FT area;

    bool is_placed;

    // The geometry index of the sheet the part was placed in.
    size_t sheet_index;

    // Where the part was placed.
    EK::Point_2 location;

    // Which orientation the part is in.
    double orientation;

    // Transform to move the geometry into place
    CGAL::Aff_transformation_3<EK> transform;
  };

  EK::FT kIota = 0.01;  // Make this smaller.

  try {
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->copyInputPointsToOutputPoints();
    geometry->transformToAbsoluteFrame();
    geometry->convertPlanarMeshesToPolygons();

    const CGAL::Point_2<EK> zero(0, 0);

    sheet_by_input.resize(count);

    std::vector<Sheet> sheets;
    std::vector<Part> parts;

    orientations.push_back(0);

    auto move_pwhs = [&](std::vector<CGAL::Polygon_with_holes_2<EK>>& pwhs,
                         const EK::Vector_2& offset) {
      for (auto& pwh : pwhs) {
        CGAL::Polygon_2<EK> nb;
        assert(pwh.outer_boundary().orientation() == CGAL::Sign::POSITIVE);
        for (auto& point : pwh.outer_boundary()) {
          nb.push_back(point + offset);
        }
        std::vector<CGAL::Polygon_2<EK>> nhs;
        for (auto& hole : pwh.holes()) {
          CGAL::Polygon_2<EK> nh;
          for (auto& point : hole) {
            assert(hole.orientation() == CGAL::Sign::NEGATIVE);
            nh.push_back(point + offset);
          }
          nhs.push_back(std::move(nh));
        }
        pwh = CGAL::Polygon_with_holes_2<EK>(nb, nhs.begin(), nhs.end());
      }
    };

    auto scale_pwhs = [&](std::vector<CGAL::Polygon_with_holes_2<EK>>& pwhs,
                          const EK::FT& factor) {
      for (auto& pwh : pwhs) {
        CGAL::Polygon_2<EK> nb;
        assert(pwh.outer_boundary().orientation() == CGAL::Sign::POSITIVE);
        for (auto& point : pwh.outer_boundary()) {
          nb.push_back(zero + (point - zero) * factor);
        }
        std::vector<CGAL::Polygon_2<EK>> nhs;
        for (auto& hole : pwh.holes()) {
          CGAL::Polygon_2<EK> nh;
          for (auto& point : hole) {
            assert(hole.orientation() == CGAL::Sign::NEGATIVE);
            nb.push_back(zero + (point - zero) * factor);
          }
          nhs.push_back(std::move(nh));
        }
        pwh = CGAL::Polygon_with_holes_2<EK>(nb, nhs.begin(), nhs.end());
      }
    };

    auto rotate_pwhs = [&](std::vector<CGAL::Polygon_with_holes_2<EK>>& pwhs,
                           double turn) {
      auto rotation = zturn2<EK>(turn);
      for (auto& pwh : pwhs) {
        CGAL::Polygon_2<EK> nb;
        for (auto& point : pwh.outer_boundary()) {
          nb.push_back(point.transform(rotation));
        }
        std::vector<CGAL::Polygon_2<EK>> nhs;
        for (auto& hole : pwh.holes()) {
          CGAL::Polygon_2<EK> nh;
          for (auto& point : hole) {
            nh.push_back(point.transform(rotation));
          }
          nhs.push_back(std::move(nh));
        }
        pwh = CGAL::Polygon_with_holes_2<EK>(nb, nhs.begin(), nhs.end());
      }
    };

    auto setup_part = [&](Part& part) {
      part.is_placed = false;

      if (part.pwhs.size() < 1) {
        return;
      }
      auto& pwh = part.pwhs[0];
      if (pwh.outer_boundary().size() < 1) {
        return;
      }
      part.area = 0;
      part.pwhs_offset = EK::Point_2(0, 0) - pwh.outer_boundary()[0];
      move_pwhs(part.pwhs, part.pwhs_offset);

      // The npwhs is a reflection of the pwhs.
      for (auto& pwh : part.pwhs) {
        CGAL::Polygon_2<EK> nb;
        for (auto& point : pwh.outer_boundary()) {
          nb.push_back(zero + (zero - point));
        }
        std::vector<CGAL::Polygon_2<EK>> nhs;
        for (auto& hole : pwh.holes()) {
          CGAL::Polygon_2<EK> nh;
          for (auto& point : hole) {
            nh.push_back(zero + (zero - point));
          }
          nhs.push_back(std::move(nh));
        }
        part.npwhs.push_back(
            CGAL::Polygon_with_holes_2<EK>(nb, nhs.begin(), nhs.end()));
      }
    };

    auto display_pwhs =
        [&](const std::vector<CGAL::Polygon_with_holes_2<EK>>& pwhs,
            const std::string& tag) {
        };

    auto cut_part_from_sheet =
        [&](Sheet& sheet, const Part& part,
            std::vector<CGAL::Polygon_with_holes_2<EK>>& cut_sheet_pwhs) {
          auto pwhs = part.pwhs;
          move_pwhs(pwhs, (part.location - part.pwhs_offset) - zero);
          // FIX: Why not represent the sheet area with a Polygon_set_2?
          CGAL::Polygon_set_2<EK> polygon_set;
          for (const auto& pwh : sheet.pwhs) {
            polygon_set.insert(pwh);
          }
          for (const auto& pwh : pwhs) {
            polygon_set.difference(pwh);
          }
          std::vector<CGAL::Polygon_with_holes_2<EK>> complex_cut_sheet_pwhs;
          polygon_set.polygons_with_holes(
              std::back_inserter(complex_cut_sheet_pwhs));
          cut_sheet_pwhs.clear();
          simplifyPolygonsWithHoles(complex_cut_sheet_pwhs, cut_sheet_pwhs);
        };

    auto place_part_in_sheet =
        [&](Sheet& sheet, const Part& part,
            std::vector<CGAL::Polygon_with_holes_2<EK>>& cut_sheet_pwhs) {
          auto pwhs = part.pwhs;
          move_pwhs(pwhs, (part.location - part.pwhs_offset) - zero);
          // FIX: Why not represent the sheet area with a Polygon_set_2?
          CGAL::Polygon_set_2<EK> polygon_set;
          for (const auto& pwh : sheet.pwhs) {
            if (pwh.outer_boundary().begin() == pwh.outer_boundary().end()) {
              continue;
            }
            polygon_set.insert(pwh);
          }
          for (const auto& pwh : pwhs) {
            polygon_set.join(pwh);
          }
          std::vector<CGAL::Polygon_with_holes_2<EK>> complex_cut_sheet_pwhs;
          polygon_set.polygons_with_holes(
              std::back_inserter(complex_cut_sheet_pwhs));
          cut_sheet_pwhs.clear();
          simplifyPolygonsWithHoles(complex_cut_sheet_pwhs, cut_sheet_pwhs);
        };

    // Extract footprints.
    for (size_t nth = 0; nth < count; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_MESH: {
          Part part;
          part.geometry_index = nth;
          cast_mesh_to_polygons_with_holes(geometry->mesh(nth),
                                           EK::Plane_3(0, 0, 1, 0),
                                           EK::Vector_3(0, 0, 1), part.pwhs);
          setup_part(part);
          parts.push_back(std::move(part));
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          Part part;
          part.geometry_index = nth;
          cast_polygons_with_holes(geometry->pwh(nth), geometry->plane(nth),
                                   EK::Plane_3(0, 0, 1, 0),
                                   EK::Vector_3(0, 0, 1), part.pwhs);
          setup_part(part);
          parts.push_back(std::move(part));
          break;
        }
      }
    }

    // Extract sheets.
    for (size_t nth = count; nth < size; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          std::vector<CGAL::Polygon_with_holes_2<EK>> regions;
          Sheet sheet;
          sheet.geometry_index = nth;
          sheet.is_bounded = true;
          cast_polygons_with_holes(geometry->pwh(nth), geometry->plane(nth),
                                   EK::Plane_3(0, 0, 1, 0),
                                   EK::Vector_3(0, 0, 1), sheet.pwhs);
          sheets.push_back(std::move(sheet));
          std::cout << "Setting pack:sheet on nth=" << nth << std::endl;
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
      }
    }

    {
      // Add an unbounded sheet at the end.
      // This will catch otherwise unplaceable items.
      Sheet sheet;
      sheet.geometry_index = -1;
      sheet.is_bounded = false;
      CGAL::Polygon_with_holes_2<EK> unbounded;
      sheet.pwhs.push_back(std::move(unbounded));
      sheets.push_back(std::move(sheet));
    }

    geometry->transformToLocalFrame();

    std::sort(parts.begin(), parts.end(),
              [](const Part& a, const Part& b) { return a.area > b.area; });

    auto measure_polygon_perimeter = [&](const CGAL::Polygon_2<EK>& polygon) {
      double perimeter = 0;
      if (polygon.begin() != polygon.end()) {
        auto start = polygon.vertices_circulator();
        auto edge = start;
        do {
          perimeter +=
              sqrt(to_double(CGAL::squared_distance(edge[0], edge[1])));
        } while (++edge != start);
      }
      return perimeter;
    };

    auto measure_pwhs_perimeter =
        [&](const std::vector<CGAL::Polygon_with_holes_2<EK>>& pwhs) {
          double perimeter = 0;
          for (const auto& pwh : pwhs) {
            perimeter += measure_polygon_perimeter(pwh.outer_boundary());
            for (const auto& hole : pwh.holes()) {
              perimeter += measure_polygon_perimeter(hole);
            }
          }
          return perimeter * perimeter_weight;
        };

    auto count_pwhs_holes =
        [&](const std::vector<CGAL::Polygon_with_holes_2<EK>>& pwhs) {
          size_t count = 0;
          for (const auto& pwh : pwhs) {
            count += pwh.holes().size();
          }
          return count * holes_weight;
        };

    auto measure_part_bounds = [&](const Part& part) {
      CGAL::Bbox_2 bounds = part.location.bbox();
      for (const auto& pwh : part.pwhs) {
        bounds += pwh.outer_boundary().bbox();
        for (const auto& hole : pwh.holes()) {
          bounds += hole.bbox();
        }
      }
      // Place the box at the part location.
      return CGAL::Bbox_2(bounds.xmin() + to_double(part.location.x()),
                          bounds.ymin() + to_double(part.location.y()),
                          bounds.xmax() + to_double(part.location.x()),
                          bounds.ymax() + to_double(part.location.y()));
    };

    auto measure_parts_bounds = [&](const std::vector<Part>& parts,
                                    const Part& part, size_t sheet_index) {
      // We assume that any counterpart of part in parts is not yet placed.
      CGAL::Bbox_2 bounds = measure_part_bounds(part);
      for (const auto& part : parts) {
        if (!part.is_placed || part.sheet_index != sheet_index) {
          continue;
        }
        bounds += measure_part_bounds(part);
      }
      double width = bounds.xmax() - bounds.xmin();
      double height = bounds.ymax() - bounds.ymin();
      double cost = std::max(width * width, height * height);
      return cost * bounds_weight;
    };

    auto is_point_in_bbox = [](const EK::Point_2& point,
                               const CGAL::Bbox_2& bbox) {
      return bbox.xmin() <= point.x() && point.x() <= bbox.xmax() &&
             bbox.ymin() <= point.y() && point.y() <= bbox.ymax();
    };

    size_t placed_part_count = 0;

    bool has_display_part = false;

    for (auto& base_part : parts) {
      for (auto& sheet : sheets) {
        bool has_best = false;
        double best_cost;
        Part best;
        std::vector<CGAL::Polygon_with_holes_2<EK>> best_sheet_pwhs;

        for (double orientation : orientations) {
          Part part = base_part;
          part.orientation = orientation;
          rotate_pwhs(part.pwhs, orientation);
          rotate_pwhs(part.npwhs, orientation);

          std::vector<CGAL::Polygon_with_holes_2<EK>> nfps;
          if (!has_display_part) {
            has_display_part = true;
            display_pwhs(part.pwhs, "color:#ff0000");
          }
          if (sheet.is_bounded) {
            compute_inner_fit_polygon(sheet.pwhs, part.pwhs, part.npwhs, nfps);
          } else {
            compute_outer_fit_polygon(sheet.pwhs, part.pwhs, part.npwhs, nfps);
          }
          sheet.nfps = nfps;  // for debugging
          std::vector<EK::Point_2> points;
          for (const auto& nfp : nfps) {
            if (nfp.outer_boundary().begin() != nfp.outer_boundary().end()) {
              for (const auto& point : nfp.outer_boundary()) {
                points.push_back(point);
              }
            }
            for (const auto& hole : nfp.holes()) {
              for (const auto& point : hole) {
                points.push_back(point);
              }
            }
          }

          if (points.empty()) {
            if (sheet.is_bounded) {
              // Try next orientation.
              continue;
            } else {
              // Place it in the center.
              points.emplace_back(0, 0);
            }
          }

          for (const auto& point : points) {
            // Locate the at the first possible position, for now.
            part.location = point + part.pwhs_offset;
            std::vector<CGAL::Polygon_with_holes_2<EK>> sheet_pwhs;
            if (sheet.is_bounded) {
              cut_part_from_sheet(sheet, part, sheet_pwhs);
            } else {
              place_part_in_sheet(sheet, part, sheet_pwhs);
            }
            double cost =
                measure_pwhs_perimeter(sheet_pwhs) +
                measure_parts_bounds(parts, part, sheet.geometry_index) +
                count_pwhs_holes(sheet_pwhs) * 100;
            if (!has_best || cost < best_cost) {
              best = part;
              best_cost = cost;
              best_sheet_pwhs = sheet_pwhs;
              has_best = true;
            }
          }
        }

        if (has_best) {
          if (sheet.geometry_index == -1) {
            sheet.geometry_index = geometry->add(GEOMETRY_EMPTY);
          }
          std::cout << "Placing part #" << ++placed_part_count << std::endl;
          // Place the next part.
          geometry->applyTransform(
              best.geometry_index,
              translate_to(
                  EK::Point_3(best.location.x(), best.location.y(), 0)) *
                  translate(EK::Vector_3(-best.pwhs_offset.x(),
                                         -best.pwhs_offset.y(), 0)) *
                  zturn<EK>(best.orientation).inverse() *
                  translate(EK::Vector_3(best.pwhs_offset.x(),
                                         best.pwhs_offset.y(), 0)));
          best.is_placed = true;
          best.sheet_index = sheet.geometry_index;
          sheet_by_input[best.geometry_index] = best.sheet_index;
          base_part = best;
          sheet.pwhs = best_sheet_pwhs;
          break;
        }
        // Fall through to the next sheet.
      }
    }

    for (const auto& sheet : sheets) {
      display_pwhs(sheet.pwhs, "color:#0000ff");  // remove this
      display_pwhs(sheet.nfps, "color:#00ff00");  // remove this
    }

  } catch (const std::exception& e) {
    std::cout << "Pack: " << e.what() << std::endl;
    throw;
  }

  return STATUS_OK;
}
