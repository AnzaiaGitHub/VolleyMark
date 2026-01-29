import { getTeamKey, updateTeamProperty } from "../Utils/helper";

const scoreActions = {
  incrementScore: (gameState, side) => {
    const teamKey = getTeamKey(side);
    return updateTeamProperty(gameState, side, {
      score: gameState[teamKey].score + 1
    });
  },
  decrementScore: (gameState, side) => {
    const teamKey = getTeamKey(side);
    return updateTeamProperty(gameState, side, {
      score: Math.max(0, gameState[teamKey].score - 1)
    });
  },
  resetScore: (gameState, side) => {
    return updateTeamProperty(gameState, side, {
      score: 0
    });
  }
};

export { scoreActions };