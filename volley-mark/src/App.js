import { SIDE } from './Constants';

import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';

import { storageManager } from './Utils/storageManager';
import './App.css';
import { Game } from './domain/Game';

import { createGameReducer } from './reducers/gameReducer';
import { createTeamsReducer } from './reducers/teamsReducer';

import { Toolbar } from './components/Common/Toolbar';
import { InputSheetProvider } from './components/Common/InputSheetProvider';
import { Team } from './components/Team/Team';
import { MatchSettingsModal } from './components/SettingsModal/MatchSettingsModal';
import { Timer } from './components/Common/Timer';
import './components/Common/BottomSheet.css';

function App() {
  const [showMatchSettings, setShowMatchSettings] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(0);

  const onTimeoutUsed = useCallback(() => {
    setTimer(30);
    setShowTimer(true);
  }, []);

  const onStopTimer = useCallback(() => {
    setTimer(0);
    setShowTimer(false);
  }, []);

  const gameReducer = useMemo(
    () => createGameReducer({ storageManager, onTimeoutUsed, onStopTimer }),
    [onTimeoutUsed, onStopTimer]
  );

  const teamsReducer = useMemo(
    () => createTeamsReducer({ storageManager }),
    []
  );

  const [state, dispatch] = useReducer(gameReducer, Game.defaults());
  const [teams, dispatchTeams] = useReducer(teamsReducer, storageManager.loadTeams());

  useEffect(() => {
    dispatch({ type: "SET_GAME", payload: storageManager.loadGameState() });
  }, []);

  const handleAction = (type, value) => {
    if (type === "OPEN_MATCH_SETTINGS") {
      setShowMatchSettings(true);
      return;
    }
    if (type === "CLOSE_MATCH_SETTINGS") {
      setShowMatchSettings(false);
      return;
    }
    dispatch({ type, payload: value });
  };

  const handleTeamAction = (type, value) => {
    dispatchTeams({ type, payload: value });
  };

  const gameSnapshot = state.toJSON();
  const teamsSnapshot = teams.toJSON();

  return (
    <InputSheetProvider>
      <div className="volley-mark">
        {showMatchSettings && (
          <MatchSettingsModal
            teams={teamsSnapshot}
            settings={gameSnapshot.settings}
            callAction={handleAction}
            callTeamAction={handleTeamAction}
          />
        )}
        {showTimer && <Timer seconds={timer} callAction={handleAction} />}
        <Team teamMatchInfo={gameSnapshot.leftTeam} settings={gameSnapshot.settings} side={SIDE.LEFT} callAction={handleAction} />
        <Team teamMatchInfo={gameSnapshot.rightTeam} settings={gameSnapshot.settings} side={SIDE.RIGHT} callAction={handleAction}/>
        <Toolbar leftTeam={gameSnapshot.leftTeam} rightTeam={gameSnapshot.rightTeam} settings={gameSnapshot.settings} callAction={handleAction}/>
      </div>
    </InputSheetProvider>
  );
}
export default App;
