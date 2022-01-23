import { Point } from '../utils/point';
import { SvgType } from '../utils/svg-type';

export class SvgLine implements SvgType {
  public static Id = ["L", "l", "H", "h", "V", "v"];

  public absolute: boolean = true;
  public points: Point[] = [];

  constructor(data?: string) {
    if (data) {
      if (data.charAt(0) === "l") this.absolute = false;

      const numbers = data.substring(1).split(" ").map(parseFloat);
      for (let idx = 0; idx < numbers.length; idx += 2) {
        const point: Point = {
          x: numbers[idx],
          y: numbers[idx + 1],
        };

        if (point.x !== undefined && point.y !== undefined) {
          this.points.push(point);
        }
      }
    }
  }

  toSvg(): string {
    return `${this.absolute ? "L" : "l"}${this.points
      .map((p) => `${p.x} ${p.y}`)
      .join(" ")}`;
  }
}
