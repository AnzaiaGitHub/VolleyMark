import { SIDE } from './Constants';

import { useState, useReducer, useEffect } from 'react';

import { userActions, validateTimeoutAvailable } from './actions/userActions';
import { gameActions } from './actions/gameActions';

import { storageManager } from './Utils/storageManager';
import './App.css';
import { getDefaultGame } from './Utils/defaults';

import { scoreController } from './controllers/scoreController';
import { rotationController } from './controllers/rotationController';

import { MiddleToolbar } from './components/MiddleToolbar';
import { Team } from './components/Team';
import { MatchSettingsModal } from './components/MatchSettingsModal';
import { Timer } from './components/Timer';

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

  useEffect(() => {
    dispatch({type: "SET_GAME", payload: storageManager.loadGameState()});
  }, []);

  return (
    <div className="volley-mark">
      {showMatchSettings &&  <MatchSettingsModal settings={state.settings} callAction={handleAction} />}
      {showTimer && <Timer seconds={timer} callAction={handleAction} />}
      <Team team={{...state.leftTeam}} side={SIDE.LEFT} callAction={handleAction} />
      <MiddleToolbar settings = {state.settings} callAction={handleAction}/>
      <Team team={{...state.rightTeam}} side={SIDE.RIGHT} callAction={handleAction}/>
    </div>
  );
}
export default App;
