import { LOCAL_STORAGE_KEY }  from "../Constants.js";
import { getDefaultGame } from "./defaults.js";
import { getLabel } from "./Labels.js";

export const storageManager = {  
  clearGameState: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
  saveGameState: (gameState) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  },
  loadGameState: () => {
    let gameToRender = getDefaultGame();
    const gameState = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!gameState) {
      return gameToRender;
    }

    const getExistentGameInfo = (gameInfo) => {
      if(!gameInfo || !gameInfo.leftTeam || !gameInfo.rightTeam) {
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
      return gameToRender;
    }

    const existentGameInfo = getExistentGameInfo(parsedGame);
    if(window.confirm(getLabel("there_is_saved_game")+":\n\n" + existentGameInfo + "\n\n"+getLabel("want_to_restore_it"))) {
      gameToRender = parsedGame;
    } else {
      alert(getLabel("game_not_restored"));
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    return gameToRender;
  }
};