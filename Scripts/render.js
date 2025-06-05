const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const gameLog_container = document.getElementById("gameLog");

const teamRenderSelectors = {
  name: "#teamName",
  setsWon: "#setScore",
  score: "#scoreMark",
  teamPosition: ["#1",
  "#2",
  "#3",
  "#4",
  "#5",
  "#6"],
  timeOuts: ["#timeOut1",
  "#timeOut2"],
  service: "#service"
}

const Team = {
  LEFT: "LEFT",
  RIGHT: "RIGHT"
}
function create(elementType) {
  return document.createElement(elementType);
}

// takes the GameState argument and render all the team items
function renderGame(gameState){
  renderLeftTeam();
  renderRightTeam();
}

function renderLeftTeam() {
  renderTeam(Team.LEFT);
}

function renderRightTeam() {
  renderTeam(Team.RIGHT);
}

function renderTeam(teamToRender) {
  renderName(teamToRender);
  renderSetsWon(teamToRender);
  renderCurrentScore(teamToRender);
  renderTeamPosition(teamToRender);
  renderTimeOuts(teamToRender);
  renderTeamHasService(teamToRender);
}

function renderName(teamToRender) {
  const selector = teamRenderSelectors.name + teamToRender;
  const element = getElementBySelector(selector);
  console.log(GAME_DATA);

  element.innerHTML = GAME_DATA.teamsData[teamToRender].name;
}

function renderSetsWon(teamToRender) {
  const selector = teamRenderSelectors.setsWon + teamToRender;
  const element = getElementBySelector(selector);

  element.innerHTML = GAME_DATA.teamsData[teamToRender].setsWon;
}

function renderCurrentScore(teamToRender) {
  const selector = teamRenderSelectors.score + teamToRender;
  const element = getElementBySelector(selector);

  element.innerHTML = GAME_DATA.teamsData[teamToRender].score;
}

function renderTeamPosition(teamToRender) {
  const selectors = teamRenderSelectors.teamPosition.map((position)=> position + teamToRender);

  const elements = selectors.map((selector) => getElementBySelector(selector));

  elements.forEach((index, element) => {
    element.innerHTML = GAME_DATA.teamsData[teamToRender].positions[index];
  });
}

function renderTimeOuts(teamToRender) {
  const selectors = teamRenderSelectors.timeOuts.map((TO)=> TO + teamToRender);

  const elements = selectors.map((selector) => getElementBySelector(selector));

  const teamTimeOuts = GAME_DATA.teamsData[teamToRender].usedTimeOuts;
  for(let i = 0; i < teamTimeOuts; i++) {
    elements[i].checked = true;
  }
}

function renderTeamHasService(teamToRender) {
  const selector = teamRenderSelectors.service + teamToRender;
  const element = getElementBySelector(selector);

  const teamHasService = GAME_DATA.teamsData[teamToRender].hasService
  const serviceIndicatorIsOn = element.classList.contains("service");

  if(teamHasService && !serviceIndicatorIsOn) {
    element.classList.add("service");
  }

  if(!teamHasService && serviceIndicatorIsOn) {
    element.classList.remove("service");
  }
}


function getElementBySelector(selector) {
  return document.querySelector(selector);
}