import { getDefaultGame } from "./defaults";
import { SIDE } from "../Constants";
import { gameActions } from "./gameActions";
import { storageManager } from "./storageManager";
import { getLabel } from "../Utils/Labels";

export const userActions = {
  setService: (gameState, teamSide) => {
    let services = [true, false];

    if(teamSide === SIDE.RIGHT) {
      services = services.reverse();
    }
    return {
      ...gameState,
      leftTeam: {...gameState.leftTeam, hasService: services[0]},
      rightTeam: {...gameState.rightTeam, hasService: services[1]}
    }
  },
  updateTeamName: (gameState, {side, name}) => {
    if(side === SIDE.LEFT) {
      return {...gameState, leftTeam: {...gameState.leftTeam, name: name}};
    } else {
      return {...gameState, rightTeam: {...gameState.rightTeam, name: name}};
    }
  },
  decrementScore: (gameState, side) => {
    if(side === SIDE.LEFT) {
      return {...gameState, leftTeam: {...gameState.leftTeam, score: Math.max(0, gameState.leftTeam.score - 1)}};
    } else {
      return {...gameState, rightTeam: {...gameState.rightTeam, score: Math.max(0, gameState.rightTeam.score - 1)}};
    }
  },
  incrementSets: (gameState, side) => {
    if(side === SIDE.LEFT) {
      return {...gameState, leftTeam: {...gameState.leftTeam, setsWon: gameState.leftTeam.setsWon + 1}};
    } else {
      return {...gameState, rightTeam: {...gameState.rightTeam, setsWon: gameState.rightTeam.setsWon + 1}};
    }
  },
  decrementSets: (gameState, side) => {
    if(side === SIDE.LEFT) {
      return {...gameState, leftTeam: {...gameState.leftTeam, setsWon: Math.max(0, gameState.leftTeam.setsWon - 1)}};
    } else {
      return {...gameState, rightTeam: {...gameState.rightTeam, setsWon: Math.max(0, gameState.rightTeam.setsWon - 1)}};
    }
  },
  updatePositions: (gameState, {side, newPositions}) => {
    if(side === SIDE.LEFT) {
      return {
        ...gameState,
        leftTeam: {...gameState.leftTeam, positions: newPositions}
      };
    } else {
      return {
        ...gameState,
        rightTeam: {...gameState.rightTeam, positions: newPositions}
      };
    }
  },
  rotateTeam: (gameState, side) => {
    return gameActions.rotateTeam(gameState, side);
  },
  inverseRotateTeam: (gameState, side) => {
    if(side === SIDE.LEFT) {
      return {
        ...gameState,
        leftTeam: {...gameState.leftTeam, positions: [gameState.leftTeam.positions[gameState.leftTeam.positions.length - 1]].concat(gameState.leftTeam.positions.slice(0, -1))}
      };
    } else {
      return {
        ...gameState,
        rightTeam: {...gameState.rightTeam, positions: [gameState.rightTeam.positions[gameState.rightTeam.positions.length - 1]].concat(gameState.rightTeam.positions.slice(0, -1))}
      };
    }
  },
  restartGame: (gameState, preserveData) => {
    const newGame = getDefaultGame();
    if(!preserveData) {
      storageManager.clearGameState();
      return newGame;
    }

    newGame.leftTeam = {
      ...newGame.leftTeam,
      name: gameState.leftTeam.name,
      positions: gameState.leftTeam.positions,
      setsWon: gameState.leftTeam.setsWon
    };
    newGame.rightTeam = {
      ...newGame.rightTeam,
      name: gameState.rightTeam.name,
      positions: gameState.rightTeam.positions,
      setsWon: gameState.rightTeam.setsWon
    };
    return newGame;
  },
  changeSides: (gameState) => {
    return {
      ...gameState,
      leftTeam: {...gameState.rightTeam},
      rightTeam: {...gameState.leftTeam}
    };
  },
  useTimeOut: (gameState, side) => {
    const sideIsLeft = side === SIDE.LEFT;
    const maxTimeOuts = gameState.settings.maxTimeOuts;
    const leftUsed = +gameState.leftTeam.usedTimeOuts;
    const rightUsed = +gameState.rightTeam.usedTimeOuts;
    
    if(
      (sideIsLeft && leftUsed === maxTimeOuts) ||
      (!sideIsLeft && rightUsed === maxTimeOuts)
    ) {
      alert(getLabel("team_reached_max_timeouts") +' '+maxTimeOuts);
      return gameState;
    }
    
    const newState = {...gameState};
    if(sideIsLeft) {
      newState.leftTeam.usedTimeOuts = leftUsed + 1;
    } else {
      newState.rightTeam.usedTimeOuts = rightUsed + 1;
    }

    return {...newState};
  }
};