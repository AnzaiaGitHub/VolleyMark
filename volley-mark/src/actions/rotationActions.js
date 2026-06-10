import { getTeamKey } from "../Utils/helper";

const rotationActions = {
  rotate: (gameState, side) => {
    const teamKey = getTeamKey(side);

    return {
      ...gameState,
      [teamKey]: {
        ...gameState[teamKey],
        positions: rotatePositionsForward(gameState[teamKey].positions)
      }
    }
  },
  inverseRotate: (gameState, side) => {
    const teamKey = getTeamKey(side);
    return {
      ...gameState,
      [teamKey]: {
        ...gameState[teamKey],
        positions: rotatePositionsBackward(gameState[teamKey].positions)
      }
    }
  },
  updatePositions: (gameState, side, newPositions) => {
    const teamKey = getTeamKey(side);
    return {
      ...gameState,
      [teamKey]: {
        ...gameState[teamKey],
        positions: newPositions
      }
    }
  }
};

const rotatePositionsBackward = (positions) => {
  return [positions[positions.length - 1], ...positions.slice(0, -1)];
};

const rotatePositionsForward = (positions) => {
  return positions.slice(1).concat(positions[0]);
};

export { rotationActions };