const localStorageKey = "VolleyMarkScore"
var gameData = {
  teamsData: {
    LEFT: {
      name: "Team A",
      setsWon: 0,
      score: 0,
      positions:["A1","A2","A3","A4","A5","A6"],
      usedTimeOuts: 0,
      hasService: true
    },
    RIGHT: {
      name: "Team B",
      setsWon: 0,
      score: 0,
      positions:["B1","B2","B3","B4","B5","B6"],
      usedTimeOuts: 0,
      hasService: false
    }
  },
  setsNumber: 5,
  setPoints: 25,
  winConditions: {
    diffPoints:true,
    firstWithSetPoints:false,
  }
};

function getStoredGame() {
  return localStorage.getItem(localStorageKey);
}

function loadGame(gameInput) {
  try {
    validateGameInput(gameInput);
    setGameData(gameInput);
  } catch(error) {
    console.log('An error occurred trying to load the existing game');
    console.error (error, gameInput);
  }
}

function saveGame() {
  const gameValue = JSON.stringify(gameData);

  localStorage.setItem(localStorageKey, gameValue);
}

function setGameData(gameInput) {
}

function validateGameInput(gameInput) {
  //it has teams, and the correct data to be loaded.
  validateTeamsData(gameInput);
  validateGameData(gameInput);
}

function validateTeamsData(gameInput) {
  const teamsDataInput = gameInput.teamsData;
  const [rightTeamInput, leftTeamInput] = [teamsDataInput.RIGHT, teamsDataInput.LEFT];

  validateTeamData(rightTeamInput);
  validateTeamData(leftTeamInput);
}

function validateTeamData(teamInput) {
  if(typeof teamInput.name != typeof teamsData.LEFT.name) {
    throw Error('Invalid team Name type');
  }

  if(typeof teamInput.setsWon != typeof teamsData.LEFT.setsWon) {
    throw Error('Invalid team sets won type');
  }

  if(typeof teamInput.score != typeof teamsData.LEFT.score) {
    throw Error('Invalid team score type');
  }

  if(typeof teamInput.positions != typeof teamsData.LEFT.positions) {
    throw Error('Invalid team positions type');
  }
  if(teamInput.positions.length() != teamsData.LEFT.positions.length()) {
    throw Error('Invalid team positions length');
  }
  
  if(typeof teamInput.usedTimeOuts != typeof teamsData.LEFT.usedTimeOuts) {
    throw Error('Invalid team timeOuts type');
  }

  if(typeof teamInput.hasService != typeof teamsData.LEFT.hasService) {
    throw Error('Invalid team hasService type');
  }
}

function validateGameData(gameInput) {
  if(typeof gameInput.setsNumber != typeof gameData.setsNumber) {
    throw Error('Invalid sets Number type for game');
  }

  if(typeof gameInput.setPoints != typeof gameData.setPoints) {
    throw Error('Invalid set points type for game');
  }

  if(typeof gameInput.winConditions != typeof gameData.winConditions) {
    throw Error('Invalid winConditions type for game');
  }

  const winConInput = gameInput.winConditions;
  const winConExisting = {...gameData.winConditions};
  if(typeof winConInput.diffPoints != typeof winConExisting.diffPoints) {
    throw Error('Invalid different points type for Game winConditions');
  }
  if(typeof winConInput.firstWithSetPoints != typeof winConExisting.firstWithSetPoints) {
    throw Error('Invalid first with setPoints type for Game winConditions');
  }
}
