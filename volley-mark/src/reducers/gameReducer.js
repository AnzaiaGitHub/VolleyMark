import { Game } from "../domain/Game";

export function createGameReducer({ storageManager, onTimeoutUsed, onStopTimer }) {
  return function gameReducer(state, action) {
    const game = state instanceof Game ? state : Game.fromJSON(state);

    const savedGame = (nextGame) => {
      storageManager.saveGameState(nextGame);
      return nextGame;
    };

    switch (action.type) {
      case "SET_SERVICE":
        return savedGame(game.setService(action.payload));
      case "UPDATE_TEAM_NAME":
        return savedGame(game.updateTeamName(action.payload.side, action.payload.name));
      case "USE_TIMEOUT": {
        const { valid, message } = game.validateTimeoutAvailable(action.payload);
        if (!valid) {
          alert(message);
          return game;
        }
        onTimeoutUsed();
        return savedGame(game.useTimeOut(action.payload));
      }
      case "USE_SUBSTITUTION": {
        const { valid, message } = game.validateSubstitutionAvailable(action.payload);
        if (!valid) {
          alert(message);
          return game;
        }
        return savedGame(game.useSubstitution(action.payload));
      }
      case "SUBSTITUTE_PLAYER":
        return savedGame(game.substitutePlayer(action.payload.side, action.payload.outPlayer, action.payload.inPlayer));
      case "DECREMENT_SUBSTITUTIONS":
        return savedGame(game.decrementSubstitutions(action.payload));
      case "STOP_TIMER":
        onStopTimer();
        return game;
      case "INCREMENT_SCORE": {
        const newGame = game.incrementScore(action.payload);
        const winner = newGame.validateWin();
        if (winner) {
          return savedGame(newGame.acceptWinSet(winner));
        }
        return savedGame(newGame);
      }
      case "DECREMENT_SCORE":
        return savedGame(game.decrementScore(action.payload));
      case "INCREMENT_SETS":
        return savedGame(game.incrementSets(action.payload));
      case "DECREMENT_SETS":
        return savedGame(game.decrementSets(action.payload));
      case "UPDATE_POSITIONS":
        return savedGame(game.updatePositions(action.payload.side, action.payload.newPositions));
      case "ROTATE":
        return savedGame(game.rotate(action.payload));
      case "INVERSE_ROTATE":
        return savedGame(game.inverseRotate(action.payload));
      case "RESTART_GAME": {
        const newGame = game.restartGame(action.payload);
        if (!action.payload) {
          storageManager.clearGameState();
        } else {
          storageManager.saveGameState(newGame);
        }
        return newGame;
      }
      case "CHANGE_SIDES":
        return savedGame(game.changeSides());
      case "OPEN_MATCH_SETTINGS":
      case "CLOSE_MATCH_SETTINGS":
        return game;
      case "UPDATE_MATCH_SETTINGS":
        return savedGame(game.updateMatchSettings(action.payload));
      case "RESET_MATCH_SETTINGS":
        return savedGame(game.resetMatchSettings());
      case "TEAM_WIN_SET":
        return savedGame(game.acceptWinSet(action.payload));
      case "SET_GAME":
        return action.payload instanceof Game ? action.payload : Game.fromJSON(action.payload);
      case "SELECT_TEAM":
        const selectedGame = game.selectTeam(action.payload.team, action.payload.side);
        return savedGame(selectedGame);
      default:
        return game;
    }
  };
}
