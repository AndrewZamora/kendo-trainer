import { it, expect, describe } from "vitest";
type coordinates = number[];
function calculateAngleOf(
  vertex: coordinates,
  vectorA: coordinates,
  vertorB: coordinates,
): number {
  const [x1, y1] = vectorA;
  const [x2, y2] = vertex;
  const [x3, y3] = vertorB;
  const angle =
    (Math.atan2(y1 - y2, x1 - x2) - Math.atan2(y3 - y2, x3 - x2)) *
    (180 / Math.PI);
  return Math.abs(angle);
}
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
