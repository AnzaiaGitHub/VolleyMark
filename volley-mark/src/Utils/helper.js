import { SIDE } from "../Constants";

export const getTeamKey = (side) => side === SIDE.LEFT ? 'leftTeam' : 'rightTeam';
export const teamWasServing = (gameState, side) => {
  const teamKey = getTeamKey(side);
  return gameState[teamKey].hasService;
};
export const updateTeamProperty = (gameState, side, updates) => {
  const teamKey = getTeamKey(side);
  return {
    ...gameState,
    [teamKey]: {
      ...gameState[teamKey],
      ...updates
    }
  };
};

export const getOtherTeamKey = (side) => side === SIDE.LEFT ? 'rightTeam' : 'leftTeam';