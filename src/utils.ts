import { blocksPerRow, blockW } from "./constants";
import type { BallData, BlockData } from "./types";

// generate block for this row
export const generateBlocksRow = (row: number) => {
  "worklet"; // generating blocks on UI thread
  const blocks: BlockData[] = [];

  // generate
  for (let col = 0; col < blocksPerRow; col++) {
    // x: col * (blockW + gap) + initial_position_of_first_block
    // x: col * (blockW + 10) -> first block at 0
    // +5 -> now, first block at 5
    const shouldAdd = Math.random() <= 0.5;

    if (shouldAdd) {
      blocks.push({
        x: col * (blockW + 10) + 5,
        y: row * (blockW + 20),
        w: blockW,
        val: 1,
      });
    }
  }

  return blocks;
};

export const checkCollision = (ball: BallData, block: BlockData): boolean => {
  "worklet";
  // top-left corner of the block: block.x, block.y,
  // width of block: block.w
  const blockBottomRightX = block.x + block.w;
  const blockBottomRightY = block.y + block.w;

  // closest point (from the circle) in the block
  const closestX = Math.max(block.x, Math.min(ball.x, blockBottomRightX));
  const closestY = Math.max(block.y, Math.min(ball.y, blockBottomRightY));

  // distance from the ball's center to the closest point
  const distanceX = ball.x - closestX;
  const distanceY = ball.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // collision if distance is less than the ball's radius
  return distanceSquared < ball.r * ball.r;
};

export const getResetPositionAndDirection = (
  ball: BallData,
  block: BlockData,
): BallData | null => {
  "worklet";
  // if no collision
  if (!checkCollision(ball, block)) return null;

  const blockBottomRightX = block.x + block.w;
  const blockBottomRightY = block.y + block.w; // block is square so, width == height
  const radius = ball.r;

  // top collision -> ball moving downwards & distance of (top-edge of block, center) < radius
  if (ball.dy > 0 && Math.abs(block.y - ball.y) < radius) {
    const newDy = ball.dy * -1; // reverse vertical direction
    const newCy = block.y - radius; // avoid ball boundary trapping
    return { ...ball, dy: newDy, y: newCy };
  }
  // bottom collision -> ball moving upwards & ...
  else if (ball.dy < 0 && Math.abs(blockBottomRightY - ball.y) < radius) {
    const newDy = ball.dy * -1;
    const newCy = blockBottomRightY + radius;
    return { ...ball, dy: newDy, y: newCy };
  }
  // left collision -> ball moving rightwards & ...
  else if (ball.dx > 0 && Math.abs(ball.x - block.x) < radius) {
    const newDx = ball.dx * -1;
    const newCx = block.x - radius;
    return { ...ball, dx: newDx, x: newCx };
  }
  // right collision -> ball moving left & ...
  else if (ball.dx < 0 && Math.abs(blockBottomRightX - block.x) < radius) {
    const newDx = ball.dx * -1;
    const newCx = blockBottomRightX + radius;
    return { ...ball, x: newCx, dx: newDx };
  }

  return null;
};
