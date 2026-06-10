import { SIDE } from './Constants';

import { useState, useReducer, useEffect } from 'react';

import { userActions, validateTimeoutAvailable } from './actions/userActions';
import { gameActions } from './actions/gameActions';
import { teamActions } from './actions/teamActions';

import { storageManager } from './Utils/storageManager';
import './App.css';
import { getDefaultGame } from './Utils/defaults';

import { scoreController } from './controllers/scoreController';
import { rotationController } from './controllers/rotationController';

import { Toolbar } from './components/Common/Toolbar';
import { Team } from './components/Team/Team';
import { MatchSettingsModal } from './components/SettingsModal/MatchSettingsModal';
import { Timer } from './components/Common/Timer';

function App() {
  const handleAction = (type, value) => {
    dispatch({type:type, payload: value});
  };

  const [showMatchSettings, setShowMatchSettings] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(0);

  const [state, dispatch] = useReducer((state, action) => {
    const savedGame = (stateToReturn) => {
      storageManager.saveGameState(stateToReturn);
      return stateToReturn;
    };

    switch(action.type) {
      case "SET_SERVICE":
        return savedGame(userActions.setService(state, action.payload));
      case "UPDATE_TEAM_NAME":
        return savedGame(userActions.updateTeamName(state, action.payload));
      case "USE_TIMEOUT":
        const {valid, message} = validateTimeoutAvailable(state, action.payload);
        if(!valid) {
          alert(message);
          return state;
        }
        setTimer(30);
        setShowTimer(true);
        return savedGame(userActions.useTimeOut(state, action.payload));
      case "STOP_TIMER":
        setTimer(0);
        setShowTimer(false);
        return state;
      case "INCREMENT_SCORE":
        const newState = scoreController.increment(state, action.payload);
        const winner = gameActions.validateWinConditions(newState);
        if(winner) {
          return savedGame(userActions.acceptWinSet(newState, winner));
        }
        return savedGame(newState);
      case "DECREMENT_SCORE":
        return savedGame(scoreController.decrement(state, action.payload));

      case "INCREMENT_SETS":
        return savedGame(userActions.incrementSets(state, action.payload));
      case "DECREMENT_SETS":
        return savedGame(userActions.decrementSets(state, action.payload));

      case "UPDATE_POSITIONS":
        return savedGame(rotationController.updatePositions(state, action.payload));
      case "ROTATE":
        return savedGame(rotationController.rotate(state, action.payload));
      case "INVERSE_ROTATE":
        return savedGame(rotationController.inverseRotate(state, action.payload));

      case "RESTART_GAME":
        return userActions.restartGame(state, action.payload);
      case "CHANGE_SIDES":
        return savedGame(userActions.changeSides(state));
      case "OPEN_MATCH_SETTINGS":
        setShowMatchSettings(true);
        return state;
      case "CLOSE_MATCH_SETTINGS":
        setShowMatchSettings(false);
        return state;
      case "UPDATE_MATCH_SETTINGS":
        return savedGame(userActions.updateMatchSettings(state, action.payload));
      case "RESET_MATCH_SETTINGS":
        return userActions.resetMatchSettings(state);

      case "TEAM_WIN_SET":
        return savedGame(userActions.acceptWinSet(state, action.payload));

      case "SET_GAME":
        return action.payload;
      default:
        return state;
    }
  }, {
    //return default
    ...getDefaultGame()
  });

  const [teams, dispatchTeams] = useReducer((teams, action) => {
    const saveTeams = (teamsToReturn) => {
      storageManager.saveTeams(teamsToReturn);
      return teamsToReturn;
    };

    try {
      switch(action.type) {
        case "ADD_TEAM":
          return saveTeams(teamActions.addTeam(teams, action.payload));
        
        case "UPDATE_TEAM":
          return saveTeams(teamActions.updateTeam(teams, action.payload.teamId, action.payload.updates));
        
        case "DELETE_TEAM":
          return saveTeams(teamActions.deleteTeam(teams, action.payload));
        
        case "ADD_PLAYER_TO_TEAM":
          return saveTeams(teamActions.addPlayerToTeam(teams, action.payload.teamId, action.payload.player));
        
        case "REMOVE_PLAYER_FROM_TEAM":
          return saveTeams(teamActions.removePlayerFromTeam(teams, action.payload.teamId, action.payload.playerId));
        
        case "UPDATE_PLAYER_IN_TEAM":
          return saveTeams(teamActions.updatePlayerInTeam(teams, action.payload.teamId, action.payload.playerId, action.payload.updates));
        
        case "DUPLICATE_TEAM":
          return saveTeams(teamActions.duplicateTeam(teams, action.payload));
        
        case "LOAD_TEAMS":
          return storageManager.loadTeams();
        
        case "SAVE_TEAMS":
          return saveTeams(action.payload);
        
        case "CLEAR_TEAMS":
          storageManager.clearTeams();
          return [];
        
        default:
          return teams;
      }
    } catch (error) {
      console.error("Team action error:", error);
      alert(error.message || "An error occurred with team management");
      return teams;
    }
  }, storageManager.loadTeams());

  useEffect(() => {
    dispatch({type: "SET_GAME", payload: storageManager.loadGameState()});
  }, []);

  return (
    <div className="volley-mark">
      {showMatchSettings &&  <MatchSettingsModal teams={teams} settings={state.settings} callAction={handleAction} />}
      {showTimer && <Timer seconds={timer} callAction={handleAction} />}
      <Team teamMatchInfo={{...state.leftTeam}} settings={state.settings} side={SIDE.LEFT} callAction={handleAction} />
      <Team teamMatchInfo={{...state.rightTeam}} settings={state.settings} side={SIDE.RIGHT} callAction={handleAction}/>
      <Toolbar leftTeam={state.leftTeam} rightTeam={state.rightTeam} settings={state.settings} callAction={handleAction}/>
    </div>
  );
}
export default App;
