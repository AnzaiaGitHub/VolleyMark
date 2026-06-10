import { getDefaultGame, getDefaultSettings } from "../Utils/defaults";
import { SIDE } from "../Constants";
import { storageManager } from "../Utils/storageManager";
import { getLabel } from "../Utils/Labels";
import { getTeamKey } from "../Utils/helper";
import { scoreActions } from "./scoreActions";

/**
 * Helper to update a team's properties
 * @param {Object} gameState - Current game state
 * @param {string} side - SIDE.LEFT or SIDE.RIGHT
 * @param {Object} updates - Object with properties to update
 * @returns {Object} New game state with updated team
 */
const updateTeamProperty = (gameState, side, updates) => {
  const teamKey = getTeamKey(side);
  return {
    ...gameState,
    [teamKey]: {
      ...gameState[teamKey],
      ...updates
    }
  };
};

/**
 * Validate if a team can use a timeout
 * @param {Object} gameState - Current game state
 * @param {string} side - SIDE.LEFT or SIDE.RIGHT
 * @returns {Object} { valid: boolean, message: string }
 */
const validateTimeoutAvailable = (gameState, side) => {
  const maxTimeOuts = gameState.settings.maxTimeOuts;
  const teamKey = getTeamKey(side);
  const usedTimeOuts = +gameState[teamKey].usedTimeOuts;
  
  if(usedTimeOuts >= maxTimeOuts) {
    return {
      valid: false,
      message: getLabel("team_reached_max_timeouts") + ' ' + maxTimeOuts
    };
  }
  
  return { valid: true };
};

const userActions = {
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
    const teamKey = getTeamKey(side);
    return {
      ...gameState,
      [teamKey]: {
        ...gameState[teamKey],
        team: {
          ...gameState[teamKey].team,
          name
        }
      }
    };
  },
  incrementSets: (gameState, side) => {
    const teamKey = getTeamKey(side);
    return updateTeamProperty(gameState, side, {
      setsWon: gameState[teamKey].setsWon + 1
    });
  },
  decrementSets: (gameState, side) => {
    const teamKey = getTeamKey(side);
    return updateTeamProperty(gameState, side, {
      setsWon: Math.max(0, gameState[teamKey].setsWon - 1)
    });
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
    newGame.gameDate = gameState.gameDate;
    newGame.settings = gameState.settings;    

    storageManager.saveGameState(newGame);
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
    const teamKey = getTeamKey(side);
    return updateTeamProperty(gameState, side, {
      usedTimeOuts: gameState[teamKey].usedTimeOuts + 1
    });
  },
  updateMatchSettings: (gameState, newSettings) => {
    return {
      ...gameState,
      settings: {
        ...newSettings
      }
    };
  },
  resetMatchSettings: (gameState) => {
    return {
      ...gameState,
      settings: getDefaultSettings()
    };
  },
  acceptWinSet: (gameState, side) => {
    const teamKey = getTeamKey(side);
    const winnerTeamName = gameState[teamKey].name;

    const teamWonSetMessage = winnerTeamName
      + ' ' + (getLabel("won_set") || "won the set") + "\n\n"
      + (getLabel("want_restart_and_change_sides") || "Do you want to restart and change sides?");

    const confirmRestart = window.confirm(teamWonSetMessage);
    if(confirmRestart) {
      //addSetWon
      let updatedState = userActions.incrementSets(gameState, side);
      
      //resetScores
      updatedState = scoreActions.resetScore(updatedState, SIDE.LEFT);
      updatedState = scoreActions.resetScore(updatedState, SIDE.RIGHT);

      //changeSides
      return userActions.changeSides(updatedState);
    }

    return gameState;
  }
};

export { validateTimeoutAvailable, userActions };