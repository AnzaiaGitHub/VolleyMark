import { LOCAL_STORAGE_GAME_KEY, LOCAL_STORAGE_TEAMS_KEY }  from "../Constants.js";
import { getDefaultGame } from "./defaults.js";
import { getLabel } from "./Labels.js";
import { getLatestStorageVersion } from "./defaults.js";

export const storageManager = {  
  clearGameState: () => {
    localStorage.removeItem(LOCAL_STORAGE_GAME_KEY);
  },
  saveGameState: (gameState) => {
    localStorage.setItem(LOCAL_STORAGE_GAME_KEY, JSON.stringify(gameState));
  },
  loadGameState: () => {
    let defaultGameState = getDefaultGame();
    const gameState = localStorage.getItem(LOCAL_STORAGE_GAME_KEY);

    if (!gameState) {
      return defaultGameState;
    }

    const checkVersionCompatibility = (gameInfo) => {
      if(gameInfo.STORAGE_VERSION === getLatestStorageVersion()) {
        return true;
      }

      window.alert(getLabel("incompatible_game_version") || "The saved game version is not compatible with the current app version. The saved game will be deleted.");
      localStorage.removeItem(LOCAL_STORAGE_GAME_KEY);
      return false;
    }

    const getExistentGameInfo = (gameInfo) => {
      if(!gameInfo || !gameInfo.leftTeam || !gameInfo.rightTeam || !gameInfo.STORAGE_VERSION) {
        return "No game information available.";
      }

      return [
        gameInfo.leftTeam.name + " - " + gameInfo.rightTeam.name,
        "Sets: " + gameInfo.leftTeam.setsWon + " - " + gameInfo.rightTeam.setsWon,
        "Score: " +gameInfo.leftTeam.score + " - " + gameInfo.rightTeam.score,
        "Date: " + new Date(gameInfo.gameDate).toLocaleString(),
      ]
        .join("\n");
    }

    let parsedGame;
    try {
      parsedGame = JSON.parse(gameState);
    } catch (e) {
      console.error("Error parsing game state from localStorage:", e);
      return defaultGameState;
    }

    const existentGameInfo = getExistentGameInfo(parsedGame);
    if(checkVersionCompatibility(parsedGame) && window.confirm(getLabel("there_is_saved_game")+":\n\n" + existentGameInfo + "\n\n"+getLabel("want_to_restore_it"))) {
      defaultGameState = parsedGame;
    } else {
      alert(getLabel("game_not_restored"));
      localStorage.removeItem(LOCAL_STORAGE_GAME_KEY);
    }

    return defaultGameState;
  },
  loadTeams: () => {
    const teamsState = localStorage.getItem(LOCAL_STORAGE_TEAMS_KEY);
    if (!teamsState) {
      return [];
    }
    try {
      return JSON.parse(teamsState);
    } catch (e) {
      console.error("Error parsing teams state from localStorage:", e);
      return [];
    }
  },
  saveTeams: (teams) => {
    localStorage.setItem(LOCAL_STORAGE_TEAMS_KEY, JSON.stringify(teams));
  },
  clearTeams: () => {
    localStorage.removeItem(LOCAL_STORAGE_TEAMS_KEY);
  }
}