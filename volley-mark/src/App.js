import { useReducer, useEffect } from 'react';
import { Team } from './components/Team';
import { MiddleToolbar } from './components/MiddleToolbar';
import { gameActions } from './Utils/gameActions';
import { userActions } from './Utils/userActions';
import { storageManager } from './Utils/storageManager';
import { SIDE } from './Constants';
import './App.css';
import { getDefaultGame } from './Utils/defaults';

function App() {
  const handleAction = (type, value) => {
    dispatch({type:type, payload: value});
  };

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

      case "INCREMENT_SCORE":
        return savedGame(gameActions.incrementScore(state, action.payload));
      case "DECREMENT_SCORE":
        return savedGame(userActions.decrementScore(state, action.payload));
      case "INCREMENT_SETS":
        return savedGame(userActions.incrementSets(state, action.payload));
      case "DECREMENT_SETS":
        return savedGame(userActions.decrementSets(state, action.payload));
      case "UPDATE_POSITIONS":
        return savedGame(userActions.updatePositions(state, action.payload));

      case "RESTART_GAME":
        return userActions.restartGame(state, action.payload);
      case "CHANGE_SIDES":
        return savedGame(userActions.changeSides(state));
      case "USE_TIMEOUT":
        return savedGame(userActions.useTimeOut(state, action.payload));

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
      <Team team={{...state.leftTeam}} side={SIDE.LEFT} callAction={handleAction} />
      <MiddleToolbar callAction={handleAction}/>
      <Team team={{...state.rightTeam}} side={SIDE.RIGHT} callAction={handleAction}/>
    </div>
  );
}
export default App;
