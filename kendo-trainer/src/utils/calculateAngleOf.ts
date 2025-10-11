type coordinates = number[];
export function calculateAngleOf(
  vertex: coordinates,
  vectorA: coordinates,
  vertorB: coordinates): number {
  const [x1, y1] = vectorA;
  const [x2, y2] = vertex;
  const [x3, y3] = vertorB;
  const angle = (Math.atan2(y1 - y2, x1 - x2) - Math.atan2(y3 - y2, x3 - x2)) *
    (180 / Math.PI);
  return Math.abs(angle);
}
