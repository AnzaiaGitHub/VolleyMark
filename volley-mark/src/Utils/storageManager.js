import { LOCAL_STORAGE_GAME_KEY, LOCAL_STORAGE_TEAMS_KEY } from "../Constants.js";
import { getLabel } from "./Labels.js";
import { Game, getLatestStorageVersion } from "../domain/Game";
import { TeamLibrary } from "../domain/TeamLibrary";

const COMPATIBLE_VERSIONS = ["1.1.1", "1.2.0"];

export const storageManager = {
  clearGameState: () => {
    localStorage.removeItem(LOCAL_STORAGE_GAME_KEY);
  },
  saveGameState: (gameState) => {
    const payload = gameState instanceof Game ? gameState.toJSON() : gameState;
    localStorage.setItem(LOCAL_STORAGE_GAME_KEY, JSON.stringify(payload));
  },
  loadGameState: () => {
    let defaultGameState = Game.defaults();
    const gameState = localStorage.getItem(LOCAL_STORAGE_GAME_KEY);

    if (!gameState) {
      return defaultGameState;
    }

    const checkVersionCompatibility = (gameInfo) => {
      if (COMPATIBLE_VERSIONS.includes(gameInfo.STORAGE_VERSION)) {
        return true;
      }

      window.alert(
        getLabel("incompatible_game_version") ||
          "The saved game version is not compatible with the current app version. The saved game will be deleted."
      );
      localStorage.removeItem(LOCAL_STORAGE_GAME_KEY);
      return false;
    };

    const getExistentGameInfo = (gameInfo) => {
      if (!gameInfo || !gameInfo.leftTeam || !gameInfo.rightTeam || !gameInfo.STORAGE_VERSION) {
        return "No game information available.";
      }

      const leftName = gameInfo.leftTeam.team?.name ?? gameInfo.leftTeam.name ?? "Left";
      const rightName = gameInfo.rightTeam.team?.name ?? gameInfo.rightTeam.name ?? "Right";
      const leftScore = gameInfo.leftTeam.score ?? 0;
      const rightScore = gameInfo.rightTeam.score ?? 0;
      const leftSets = gameInfo.leftTeam.setsWon ?? 0;
      const rightSets = gameInfo.rightTeam.setsWon ?? 0;

      return [
        leftName + " - " + rightName,
        "Sets: " + leftSets + " - " + rightSets,
        "Score: " + leftScore + " - " + rightScore,
        "Date: " + new Date(gameInfo.gameDate).toLocaleString(),
      ].join("\n");
    };

    let parsedGame;
    try {
      parsedGame = JSON.parse(gameState);
    } catch (e) {
      console.error("Error parsing game state from localStorage:", e);
      return defaultGameState;
    }

    const existentGameInfo = getExistentGameInfo(parsedGame);
    if (
      checkVersionCompatibility(parsedGame) &&
      window.confirm(
        getLabel("there_is_saved_game") +
          ":\n\n" +
          existentGameInfo +
          "\n\n" +
          getLabel("want_to_restore_it")
      )
    ) {
      defaultGameState = Game.fromJSON(parsedGame);
    } else {
      alert(getLabel("game_not_restored"));
      localStorage.removeItem(LOCAL_STORAGE_GAME_KEY);
    }

    return defaultGameState;
  },
  loadTeams: () => {
    const teamsState = localStorage.getItem(LOCAL_STORAGE_TEAMS_KEY);
    if (!teamsState) {
      return new TeamLibrary([]);
    }
    try {
      return TeamLibrary.fromJSON(JSON.parse(teamsState));
    } catch (e) {
      console.error("Error parsing teams state from localStorage:", e);
      return new TeamLibrary([]);
    }
  },
  saveTeams: (teams) => {
    const payload = teams instanceof TeamLibrary ? teams.toJSON() : teams;
    localStorage.setItem(LOCAL_STORAGE_TEAMS_KEY, JSON.stringify(payload));
  },
  clearTeams: () => {
    localStorage.removeItem(LOCAL_STORAGE_TEAMS_KEY);
  },
  getLatestStorageVersion,
};
