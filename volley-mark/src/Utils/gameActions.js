import { SIDE } from "../Constants";
import { userActions } from "./userActions";
export const gameActions = {
  incrementScore: (gameState, side) => {
    if(!teamWasServing(gameState, side)) {
      gameState = userActions.setService(gameState, side);
      gameState = gameActions.rotateTeam(gameState, side);
    }

    if(side === SIDE.LEFT) {
      return {...gameState, leftTeam: { ...gameState.leftTeam, score: gameState.leftTeam.score + 1 }};
    } else {
      return { ...gameState, rightTeam: { ...gameState.rightTeam, score: gameState.rightTeam.score + 1}};
    }
  },
  rotateTeam: (gameState, side) => {
    if(side === SIDE.LEFT) {
      return {
        ...gameState,
        leftTeam: {...gameState.leftTeam, positions: gameState.leftTeam.positions.slice(1).concat(gameState.leftTeam.positions[0])}
      };
    } else {
      return {
        ...gameState,
        rightTeam: {...gameState.rightTeam, positions: gameState.rightTeam.positions.slice(1).concat(gameState.rightTeam.positions[0])}
      };
    }
  }
};

const teamWasServing = (gameState, side) => {
  if(side === SIDE.LEFT) {
    return gameState.leftTeam.hasService;
  } else {
    return gameState.rightTeam.hasService;
  }
};