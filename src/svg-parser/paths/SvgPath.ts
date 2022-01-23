import { XmlElement } from '../../xml-parser/XmlParser';
import { SvgType } from '../utils/svg-type';
import { SvgLine } from './SvgLine';

type SvgPathData = SvgLine;

type SvgColorData = {
  color?: string;
  opacity?: number;
};

type SvgStroke = SvgColorData & {
  "stroke-width"?: number;
  dash?: number[];
};

export class SvgPath implements SvgType {
  public static pathDataIdentifiers = [...SvgLine.Id];
  public data: SvgPathData[] = [];
  public stroke: SvgStroke = {};
  public fill: SvgColorData = {};

  constructor(input?: XmlElement) {
    if (input) {
      const attrs = input.attributes!;
      if (attrs["d"]?.length) {
        const pathDataString = attrs["d"];
        const strs: string[] = [];

        for (let i = 0; i < pathDataString.length; i++) {
          if (SvgPath.pathDataIdentifiers.includes(pathDataString[i])) {
            strs.push(pathDataString[i]);
          } else {
            strs[strs.length - 1] += pathDataString[i];
          }
        }

        for (const dataElementStr of strs) {
          const element = SvgPath.parseDataElement(dataElementStr);
          if (element) {
            this.data.push(element);
          }
        }
      }

      if (attrs["stroke"]) {
        this.stroke.color = attrs["stroke"];
      }

      if (attrs["stroke-width"]) {
        const value = parseFloat(attrs["stroke-width"]);
        if (!Number.isNaN(value)) {
          this.stroke["stroke-width"] = value;
        }
      }

      if (attrs["stroke-dasharray"]) {
        const values = attrs["stroke-dasharray"].split(" ");

        if (values.length) {
          this.stroke.dash = values;
        }
      }
    }
  }

  static parseDataElement(str: string) {
    const char = str.charAt(0);
    if (SvgLine.Id.includes(char)) return new SvgLine(str);

    return undefined;
  }

  toSvg(pretty?: boolean): string {
    const parts: string[] = ["<path"];

    if (this.data.length)
      parts.push(`d="${this.data.map((d) => d.toSvg()).join(" ")}"`);
    if (this.stroke.color) parts.push(`stroke="${this.stroke.color}"`);
    if (this.stroke["stroke-width"])
      parts.push(`stroke-width="${this.stroke["stroke-width"]}"`);

    if (this.stroke.dash?.length)
      parts.push(`stroke-dasharray="${this.stroke.dash.join(" ")}"`);

    parts.push("/>");
    return parts.join(" ");
  }
}
