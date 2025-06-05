const localStorageKey = "VolleyMarkScore"
var GAME_DATA;

function getStoredGame() {
  console.log('getStoredGame');
  
  return localStorage.getItem(localStorageKey);
}

function loadGame(gameInput) {
  console.log('loadGame');
  
  try {
    validateGameInput(gameInput);
    setGameData(gameInput);
  } catch(error) {
    console.log('An error occurred trying to load the existing game');
    console.error (error, gameInput);
    startNewGame();
  }
}

function saveGame() {
  console.log('saveGame');
  
  const gameValue = JSON.stringify(GAME_DATA);

  localStorage.setItem(localStorageKey, gameValue);
}

function setGameData(gameInput) {
  console.log('setGame');
  GAME_DATA = {...gameInput};
  console.log(GAME_DATA);
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
  if(typeof gameInput.setsNumber != typeof GAME_DATA.setsNumber) {
    throw Error('Invalid sets Number type for game');
  }

  if(typeof gameInput.setPoints != typeof GAME_DATA.setPoints) {
    throw Error('Invalid set points type for game');
  }

  if(typeof gameInput.winConditions != typeof GAME_DATA.winConditions) {
    throw Error('Invalid winConditions type for game');
  }

  const winConInput = gameInput.winConditions;
  const winConExisting = {...GAME_DATA.winConditions};
  if(typeof winConInput.diffPoints != typeof winConExisting.diffPoints) {
    throw Error('Invalid different points type for Game winConditions');
  }
  if(typeof winConInput.firstWithSetPoints != typeof winConExisting.firstWithSetPoints) {
    throw Error('Invalid first with setPoints type for Game winConditions');
  }
}

function startNewGame() {
  fetch('../mockData/mockedGameData.JSON')
     .then(response => {
       if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
       }
       return response.json();
     })
     .then(data => {
       setGameData(data);
     })
     .catch(error => {
       console.error('Error fetching or parsing JSON:', error);
     });
}
