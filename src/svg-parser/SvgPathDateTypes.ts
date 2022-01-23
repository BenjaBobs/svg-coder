import { Point } from './utils/point';

/**
 * SVG defines 6 types of path commands, for a total of 20 commands:
 *
 * * Move: M, m
 * * LineTo: L, l, H, h, V, v
 * * Cubic Bézier Curve: C, c, S, s
 * * Quadratic Bézier Curve: Q, q, T, t
 * * Elliptical Arc Curve: A, a
 * * ClosePath: Z, z
 */
export type SvgPathData =
  | SvgMoveAbsolute
  | SvgMoveRelative
  | SvgLineAbsolute
  | SvgLineRelative
  | SvgLineHorizontalAbsolute
  | SvgLineHorizontalRelative
  | SvgLineVerticalAbsolute
  | SvgLineVerticalRelative
  | SvgBezierQuadraticAbsolute
  | SvgBezierQuadraticRelative
  | SvgBezierQuadraticAbsoluteSmooth
  | SvgBezierQuadraticRelativeSmooth
  | SvgBezierCubicAbsolute
  | SvgBezierCubicRelative
  | SvgBezierCubicAbsoluteSmooth
  | SvgBezierCubicRelativeSmooth
  | SvgArcAbsolute
  | SvgArcRelative
  | SvgClosePath;

type SvgMoveAbsolute = { tag: "M"; destination: Point | Point[] };
type SvgMoveRelative = { tag: "m"; destination: Point | Point[] };

type SvgLineAbsolute = { tag: "L"; destination: Point | Point[] };
type SvgLineRelative = { tag: "l"; destination: Point | Point[] };
type SvgLineHorizontalAbsolute = { tag: "H"; x: number | number[] };
type SvgLineHorizontalRelative = { tag: "h"; x: number | number[] };
type SvgLineVerticalAbsolute = { tag: "V"; y: number | number[] };
type SvgLineVerticalRelative = { tag: "v"; y: number | number[] };

type SvgBezierQuadraticAbsolute = {
  tag: "Q";
  data: SvgBezierQuadraticData | SvgBezierQuadraticData[];
};
type SvgBezierQuadraticRelative = {
  tag: "q";
  data: SvgBezierQuadraticData | SvgBezierQuadraticData[];
};
type SvgBezierQuadraticData = {
  anchor: Point;
  destination: Point;
};

type SvgBezierQuadraticAbsoluteSmooth = Point & { tag: "T" };
type SvgBezierQuadraticRelativeSmooth = Point & { tag: "t" };

type SvgBezierCubicAbsolute = SvgBezierCubicData & { tag: "C" };
type SvgBezierCubicRelative = SvgBezierCubicData & { tag: "c" };
type SvgBezierCubicData = {
  anchorFrom: Point;
  anchorTo: Point;
  destination: Point;
};
type SvgBezierCubicAbsoluteSmooth = SvgBezierCubicSmoothData & { tag: "S" };
type SvgBezierCubicRelativeSmooth = SvgBezierCubicSmoothData & { tag: "s" };
type SvgBezierCubicSmoothData = {
  anchor: Point;
  destination: Point;
};

type SvgArcAbsolute = SvgArgData & { tag: "A" };
type SvgArcRelative = SvgArgData & { tag: "a" };
type SvgArgData = {
  ellipse: Ellipse;
  largeArc: boolean;
  sweep: boolean;
  destination: Point;
};

type SvgClosePath = { tag: "Z" | "z" };

type Ellipse = {
  radiusX: number;
  radiusY: number;
  rotation: number;
};
