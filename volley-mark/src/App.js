import { useReducer } from 'react';
import { Team } from './components/Team';
import './App.css';
const SIDE = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

const getDefaultTeamInfo = (name, hasService) => {
  return {
    name: name,
    hasService: hasService,
    positions: ['1','2','3','4','5','6'].map(p => name.slice(-1) + p),
    score: 0,
    setsWon:0,
    availableTimesOut: 2,
  };
};

const getDefaultSettings = () => {
  return {
    maxSetPoints: 25,
    deuce: {//if deuces are not allowed, the game must end when the first team reach the maxSetsPoints
      allowed: true,
      howMany: undefined
    }
  }
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
  }
};

const gameActions = {
  incrementScore: (gameState, side) => {
    if(!teamWasServing(gameState, side)) {
      gameState = userActions.setService(gameState, side);
      gameState = gameActions.rotateTeam(gameState, side);
    }

    if(side === SIDE.LEFT) {
      return {...gameState, leftTeam: { ...gameState.leftTeam, score: gameState.leftTeam.score + 1 }};
    } else {
      return { ...gameState, rightTeam: { ...gameState.rightTeam, score: gameState.rightTeam.score + 1}};
    }
  },
  rotateTeam: (gameState, side) => {
    if(side === SIDE.LEFT) {
      return {
        ...gameState,
        leftTeam: {...gameState.leftTeam, positions: gameState.leftTeam.positions.slice(1).concat(gameState.leftTeam.positions[0])}
      };
    } else {
      return {
        ...gameState,
        rightTeam: {...gameState.rightTeam, positions: gameState.rightTeam.positions.slice(1).concat(gameState.rightTeam.positions[0])}
      };
    }
  }
};

const teamWasServing = (gameState, side) => {
  if(side === SIDE.LEFT) {
    return gameState.leftTeam.hasService;
  } else {
    return gameState.rightTeam.hasService;
  }
}

function App() {
  const getDefaultGame = () => {
    return {
      gameDate: Date.now(),
      settings: getDefaultSettings(),
      leftTeam: getDefaultTeamInfo('Team A', true),
      rightTeam: getDefaultTeamInfo('Team B', false)
    };
  };

  const handleAction = (type, value) => {
    dispatch({type:type, payload: value});
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case "SET_SERVICE":
        return userActions.setService(state, action.payload)
      case "UPDATE_TEAM_NAME":
        return userActions.updateTeamName(state, action.payload);

      case "INCREMENT_SCORE":
        return gameActions.incrementScore(state, action.payload);
      case "DECREMENT_SCORE":
        return userActions.decrementScore(state, action.payload);
      case "INCREMENT_SETS":
        return userActions.incrementSets(state, action.payload);
      case "DECREMENT_SETS":
        return userActions.decrementSets(state, action.payload);
      case "UPDATE_POSITIONS":
        return userActions.updatePositions(state, action.payload);

      default:
        return state;
    }
    
  }, {
    //return default
    ...getDefaultGame()
  });

  return (
    <div className="volley-mark">
      <Team team={state.leftTeam} side="LEFT" callAction={handleAction} />
      <Team team={state.rightTeam} side="RIGHT" callAction={handleAction}/>
    </div>
  );
}

export default App;
