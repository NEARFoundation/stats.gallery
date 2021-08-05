export interface AccountLevel {
  level: number;
  requiredToNextLevel: number;
  creditToNextLevel: number;
}

export function currentLevel(points: number): AccountLevel {
  const level = Math.log2((points + 100) / 100) | 0;
  const totalPointsToCurrentLevel = 2 ** level * 100 - 100;
  const totalPointsToNextLevel = 2 ** (level + 1) * 100;
  return {
    level: level + 1, // +1 so that accounts start at level 1 instead of level 0
    requiredToNextLevel: totalPointsToNextLevel - totalPointsToCurrentLevel,
    creditToNextLevel: points - totalPointsToCurrentLevel,
  };
}
