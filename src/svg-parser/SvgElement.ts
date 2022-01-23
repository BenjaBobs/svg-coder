import { SvgPath } from './paths/SvgPath';
import { Rect } from './utils/rect';
import { SvgType } from './utils/svg-type';

type SvgContext =
  | "tagOpen"
  | "elementName"
  | "tagClose"
  | "attributeName"
  | "attributeValue";
const lala: {
  [key in SvgContext]: {
    type: string;
    lookAhead: number;
    matcher: RegExp;
    levelDiff?: number;
  }[];
} = {
  tagOpen: [
    {
      type: "tagOpen",
      lookAhead: 0,
      matcher: /[<]/,
      levelDiff: 0,
    },
  ],
};
// TODO
function parse(input: string, context: SvgContext) {
  for (let i = 0; i < input.length; i++) {
    for (const potentialMatcher of lala[context]) {
      const str = input.slice(i, i + potentialMatcher.lookAhead);
      potentialMatcher.matcher.test(str);
    }
  }
}

type SvgChildElement = SvgPath;

export class SvgElement implements SvgType {
  public children: SvgChildElement[] = [];
  public version = "1.1";
  public xmlns = "http://www.w3.org/2000/svg";
  public viewbox: Rect = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  constructor(input?: string) {
    if (input) {
      const attrsString = input.substring(4);
    }
  }

  toSvg(pretty?: boolean): string {
    return `<svg version="${this.version}" viewbox="${this.viewbox.x} ${
      this.viewbox.y
    } ${this.viewbox.width} ${this.viewbox.height}" xmlns="${this.xmlns}" />
    ${this.children.map((c) => c.toSvg(pretty)).join("\n")}
    </svg>`;
  }
}
