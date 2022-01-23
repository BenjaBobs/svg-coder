import { describe, expect, test } from 'vitest';

import { SvgLine } from './SvgLine';
import { SvgPath } from './SvgPath';

describe("SvgPath", () => {
  test("lala", () => {
    const input = '<path d="L0 10" stroke="red" stroke-width="1" />';

    const path = new SvgPath(input);
    expect(path.data).toEqual([new SvgLine("L0 10")]);
    expect(path.stroke?.color).toBe("red");
    expect(path.stroke?.thickness).toBe(1);

    expect(path.toSvg()).toEqual(input);
  });
});
