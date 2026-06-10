import { STORAGE_VERSION } from "../Constants";

export const getDefaultGame = () => {
  const defaultTeamA = getDefaultTeam('A');
  const defaultTeamB = getDefaultTeam('B');
  return {
    gameDate: Date.now(),
    currentDeuces: 0,
    settings: getDefaultSettings(),
    leftTeam: getTeamMatchInfo(defaultTeamA, true),
    rightTeam: getTeamMatchInfo(defaultTeamB, false),
    STORAGE_VERSION: getLatestStorageVersion(),
  };
};

/**
 * Create a game from saved teams
 * @param {Object} leftTeam - Left team object with name and players
 * @param {Object} rightTeam - Right team object with name and players
 * @returns {Object} Game state initialized with the provided teams
 */
export const getGameFromTeams = (leftTeam, rightTeam) => {
  if (!leftTeam || !rightTeam) {
    return getDefaultGame();
  }

  return {
    gameDate: Date.now(),
    currentDeuces: 0,
    settings: getDefaultSettings(),
    leftTeam: getTeamMatchInfo(leftTeam, true),
    rightTeam: getTeamMatchInfo(rightTeam, false),
    STORAGE_VERSION: getLatestStorageVersion(),
  };
};

export const getDefaultTeam = (teamName) => {
  const defaultName = "Team " + teamName;
  return {
    id: Date.now().toString(),
    name: defaultName,
    players: getDefaultPlayers(defaultName),
  };
};

export const getDefaultPlayers = (teamName) => {
  return ['1','2','3','4','5','6'].map(n => {
    return createPlayer(teamName.slice(-1) + n, parseInt(n));
  })
};

export const createPlayer = (playerName, id) => {
  return {
    tshirt: playerName,
    id: id
  };
};

const getTeamMatchInfo = (team, hasService) => {
  return {
    team: team,
    hasService: hasService,
    positions: team.players.map(player => player.tshirt).slice(0,6), //take only the first 6 players for the positions
    score: 0,
    setsWon:0,
    usedTimeOuts: 0,
  };
};

export const getDefaultSettings = () => {
  return {
    maxSetPoints: 25,
    deuce: {//if deuces are not allowed, the game must end when the first team reach the maxSetsPoints
      allowed: true,
      howMany: undefined, //undefined means unlimited
    },
    maxSets: 5,
    maxTimeOuts: 2
  }
};

export const getLatestStorageVersion = () => {
  return STORAGE_VERSION;
};