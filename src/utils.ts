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
