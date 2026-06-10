import { userActions } from "../actions/userActions";
import { rotationActions } from "../actions/rotationActions";
import { scoreActions } from "../actions/scoreActions";
import { teamWasServing } from "../Utils/helper";

export const scoreController = {
  increment: (gameState, side) => {
    let updatedState = gameState;
    updatedState = scoreActions.incrementScore(updatedState, side);
    
    if(!teamWasServing(gameState, side)) {
      updatedState = rotationActions.rotate(updatedState, side);
      updatedState = userActions.setService(updatedState, side);
    }
    
    return updatedState;
  },
  decrement: (gameState, side) => {
    return scoreActions.decrementScore(gameState, side);
  },
  reset: (gameState, side) => {
    return scoreActions.resetScore(gameState, side);
  }
};