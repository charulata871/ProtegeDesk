export function calculateNodeAngle(index: number, total: number): number {
  return (index / total) * 2 * Math.PI;
}

export function calculateCircularPosition(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): { x: number; y: number } {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}
