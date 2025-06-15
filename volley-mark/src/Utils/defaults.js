export const getDefaultGame = () => {
  return {
    gameDate: Date.now(),
    settings: getDefaultSettings(),
    leftTeam: getDefaultTeamInfo('Team A', true),
    rightTeam: getDefaultTeamInfo('Team B', false)
  };
};

const getDefaultTeamInfo = (name, hasService) => {
  return {
    name: name,
    hasService: hasService,
    positions: ['1','2','3','4','5','6'].map(p => name.slice(-1) + p),
    score: 0,
    setsWon:0,
    usedTimeOuts: 0
  };
};

const getDefaultSettings = () => {
  return {
    maxSetPoints: 25,
    deuce: {//if deuces are not allowed, the game must end when the first team reach the maxSetsPoints
      allowed: true,
      howMany: undefined
    },
    maxSets: 5,
    maxTimeOuts: 2
  }
};