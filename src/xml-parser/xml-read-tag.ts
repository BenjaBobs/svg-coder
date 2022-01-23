export enum XmlTagType {
  opening,
  closing,
  selfClosing,
}

export function readXmlTag(input: string) {
  const match = input.match(xmlTagExpr);

  if (!match) return undefined;

  return {
    index: match.index!,
    length: match[0].length,
    attributes: readXmlAttrs(match.groups!["attrs"]),
    name: match.groups!["type"],
    type: match.groups?.["closing"]
      ? XmlTagType.closing
      : match.groups?.["selfClosing"]
      ? XmlTagType.selfClosing
      : XmlTagType.opening,
  };
}

function readXmlAttrs(input?: string) {
  if (!input) return undefined;
  const matches = input.matchAll(xmlAttrsExpr);

  const attributes: { [key: string]: string } = {};
  for (const match of matches) {
    attributes[match.groups!["key"]] =
      match.groups!["rawValue"] ?? match.groups!["quotedValue"] ?? true;
  }

  return attributes;
}

const xmlAttrsExpr =
  /\s+(?<key>(?:\w|:|-)+)(?:(?:=(?:(?<rawValue>\w+)|(?:"(?<quotedValue>[^"]*)")))*)/g;

const xmlTagExpr =
  /<(?:\s+)?(?<closing>\/)?(?<type>[^ />]+)\s?(?<attrs>(?:\s+(?:(?:\w|:|-)+)(?:(?:=(?:(?:\w+)|(?:"(?:[^"]*)")))*))*)?\s*(?<selfClosing>\/)?>/;
