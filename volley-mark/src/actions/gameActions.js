import { SIDE } from "../Constants";

const gameActions = {
  validateWinConditions: (gameState) => {
    const deuce = gameState.settings.deuce;

    let teamWon;
    if(deuce.allowed) {
      teamWon = validateDeuces(gameState);
    } else {
      teamWon = validateMaxPoints(gameState);
    }

    return teamWon;
  }
};

const validateDeuces  = ({currentDeuces, leftTeam, rightTeam, settings}) => {
  if(
    reachedMaxPoints(settings, leftTeam) &&
    differenceGreaterThanTwo(leftTeam, rightTeam)
  ) {
    return SIDE.LEFT;
  }

  if(
    reachedMaxPoints(settings, rightTeam) &&
    differenceGreaterThanTwo(rightTeam, leftTeam)
  ) {
    return SIDE.RIGHT;
  }

  return false;
};

const reachedMaxPoints = (settings, team) => {
  return team.score >= settings.maxSetPoints;
}

const differenceGreaterThanTwo = (thisTeam, otherTeam) => {
  const difference = thisTeam.score - otherTeam.score;
  return difference >= 2;
}

const validateMaxPoints = ({callAction, settings, leftTeam, rightTeam}) => {
  if(reachedMaxPoints(settings, leftTeam)) {
    return SIDE.LEFT;
  } else if(reachedMaxPoints(settings, rightTeam)) {
    return SIDE.RIGHT;
  }
  return false;
}

export { gameActions };