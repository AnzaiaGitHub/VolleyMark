import { rotationActions } from "../actions/rotationActions";

export const rotationController = {
  rotate: (gameState, side) => {
    return rotationActions.rotate(gameState, side);
  },
  inverseRotate: (gameState, side) => {
    return rotationActions.inverseRotate(gameState, side);
  },
  updatePositions: (gameState, {side, newPositions}) => {
    return rotationActions.updatePositions(gameState, side, newPositions);
  },
};