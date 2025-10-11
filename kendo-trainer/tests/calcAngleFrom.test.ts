import { it, expect, describe } from "vitest";
import { calculateAngleOf } from "../src/utils/calculateAngleOf";
describe("calculateAngleOf", () => {
  // it("requires three sets of x and y coordinates", () => {
  //   expect(() => calculateAngleOf()).toThrowError("test");
  // });
  it.each([
    [[0, 0], [1, 0], [0, 1], 90],
    [[1, 0], [2, 0], [2, 1], 45],
  ])(
    "should calculate angle of a vertex and two vectors",
    (a, b, c, expected: number) => {
      expect(calculateAngleOf(a, b, c)).toBe(expected);
    },
  );
});
