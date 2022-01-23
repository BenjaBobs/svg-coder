import { describe, expect, test } from 'vitest';

import { testDimensions } from '../utils/testing-utils';
import { SvgLine } from './SvgLine';

const dimensions = testDimensions<SvgLine>()({
  relativity: [
    {
      name: "Absolute",
      input: "L",
      expectations: (line) => {
        expect(line.absolute).toBeTruthy();
        expect(line.toSvg().charAt(0)).toBe("L");
      },
    },
    {
      name: "Relative",
      input: "l",
      expectations: (line) => {
        expect(line.absolute).toBeFalsy();
        expect(line.toSvg().charAt(0)).toBe("l");
      },
    },
  ],
  cardinality: [
    {
      name: "single",
      input: "1 2",
      expectations: (line) => {
        expect(line.points).toEqual([
          {
            x: 1,
            y: 2,
          },
        ]);
        expect(line.toSvg().substring(1)).toBe("1 2");
      },
    },
    {
      name: "multiple",
      input: "1 2 3 4",
      expectations: (line) => {
        expect(line.points).toEqual([
          {
            x: 1,
            y: 2,
          },
          {
            x: 3,
            y: 4,
          },
        ]);
        expect(line.toSvg().substring(1)).toBe("1 2 3 4");
      },
    },
  ],
});

describe("SvgLine", () => {
  for (const relativity of Object.values(dimensions.relativity))
    for (const cardinality of Object.values(dimensions.cardinality)) {
      test(`${relativity.name} - ${cardinality.name}`, () => {
        const input = relativity.input + cardinality.input;
        const line = new SvgLine(input);

        relativity.expectations(line);
        cardinality.expectations(line);
      });
    }
});
