import { describe, expect, test } from 'vitest';

import { readXmlTag, XmlTagType } from './xml-read-tag';

describe("xml-read-tag", () => {
  test("a test", () => {
    const parsed = readXmlTag(
      `<path d="M0 10 H100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />`
    );

    expect(parsed).toEqual({
      index: 0,
      attributes: {
        d: "M0 10 H100",
        stroke: "lightgrey",
        "stroke-dasharray": "1",
        "stroke-width": "0.5",
      },
      name: "path",
      type: XmlTagType.selfClosing,
    });
  });
});
