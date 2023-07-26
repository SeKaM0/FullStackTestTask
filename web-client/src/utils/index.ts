export const getDirectionName = (dx: number, dy: number) => {
  if (dx === -1 && dy === 0) return "left";
  if (dx === 1 && dy === 0) return "right";
  if (dx === 0 && dy === -1) return "up";
  if (dx === 0 && dy === 1) return "down";
  return "unknown";
};
