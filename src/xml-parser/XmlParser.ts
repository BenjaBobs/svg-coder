import { readXmlTag, XmlTagType } from './xml-read-tag';

export type XmlElement = {
  attributes?: { [key: string]: any };
  children?: XmlElement[];
  type: string;
};

export type XmlParserOptions = {
  format?: {
    indent?: string;
  };
};

export class XmlParser {
  constructor(public options?: XmlParserOptions) {}

  serialize(input: XmlElement, level?: number): string {
    const attrs = input.attributes
      ? Object.entries(input.attributes)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")
      : "";

    let children = input.children
      ?.map((c) => this.serialize(c, (level ?? 0) + 1))
      .join("\n");
    if (children) children = "\n" + children + "\n";

    const indent = this.options?.format?.indent
      ? repeatString(this.options.format.indent, level ?? 0)
      : "";

    return !input.children
      ? `${indent}<${input.type} ${attrs ? attrs + " " : ""}/>`
      : `${indent}<${input.type} ${attrs}>${children}</${input.type}>`;
  }
  deserialize(input: string) {
    let idx = 0;
    const elementStack: XmlElement[] = [];

    while (true) {
      const tag = readXmlTag(input.slice(idx));
      if (!tag) return elementStack[0];
      idx += tag.index + tag.length;

      const currentElement = elementStack[elementStack.length - 1];

      switch (tag.type) {
        case XmlTagType.selfClosing:
          {
            const newElement: XmlElement = {
              type: tag.name,
              attributes: tag.attributes,
            };

            // if the root element was self closing, so just return it directly
            if (!currentElement) return newElement;

            // else add it as child of the current element
            if (!currentElement.children)
              currentElement.children = [newElement];
            else currentElement.children.push(newElement);
          }
          break;

        case XmlTagType.opening:
          {
            const newElement: XmlElement = {
              type: tag.name,
              attributes: tag.attributes,
              children: [],
            };

            // if this is not root element, add it as child to current element
            if (currentElement) {
              if (!currentElement.children)
                currentElement.children = [newElement];
              else currentElement.children.push(newElement);
            }

            elementStack.push(newElement);
          }
          break;

        case XmlTagType.closing:
          if (elementStack.length <= 1) return elementStack[0];
          elementStack.pop();
          break;

        default:
          throw new Error(`unknown tag ${tag.type}`);
      }
    }
  }
}

function repeatString(input: string, times: number) {
  let res = "";

  for (let i = 0; i < times; i++) {
    res += input;
  }

  return res;
}
