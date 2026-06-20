import { STORAGE_VERSION, SIDE } from "../Constants";
import { getLabel } from "../Utils/Labels";
import { Team } from "./Team";
import { TeamMatchInfo } from "./TeamMatchInfo";
import { MatchSettings } from "./MatchSettings";

const getTeamKey = (side) => (side === SIDE.LEFT ? "leftTeam" : "rightTeam");

export class Game {
  constructor({ gameDate, currentDeuces, settings, leftTeam, rightTeam, storageVersion }) {
    this.gameDate = gameDate ?? Date.now();
    this.currentDeuces = currentDeuces ?? 0;
    this.settings = settings instanceof MatchSettings ? settings : MatchSettings.fromJSON(settings);
    this.leftTeam = leftTeam instanceof TeamMatchInfo ? leftTeam : TeamMatchInfo.fromJSON(leftTeam);
    this.rightTeam = rightTeam instanceof TeamMatchInfo ? rightTeam : TeamMatchInfo.fromJSON(rightTeam);
    this.STORAGE_VERSION = storageVersion ?? STORAGE_VERSION;
  }

  static defaults() {
    const left = Team.createDefault("A");
    const right = Team.createDefault("B");
    return new Game({
      gameDate: Date.now(),
      currentDeuces: 0,
      settings: MatchSettings.defaults(),
      leftTeam: TeamMatchInfo.fromTeam(left, true),
      rightTeam: TeamMatchInfo.fromTeam(right, false),
      storageVersion: STORAGE_VERSION,
    });
  }

  static fromTeams(leftTeam, rightTeam) {
    if (!leftTeam || !rightTeam) {
      return Game.defaults();
    }
    return new Game({
      gameDate: Date.now(),
      currentDeuces: 0,
      settings: MatchSettings.defaults(),
      leftTeam: TeamMatchInfo.fromTeam(Team.fromJSON(leftTeam), true),
      rightTeam: TeamMatchInfo.fromTeam(Team.fromJSON(rightTeam), false),
      storageVersion: STORAGE_VERSION,
    });
  }

  static fromJSON(data) {
    if (!data) {
      return Game.defaults();
    }
    return new Game({
      gameDate: data.gameDate,
      currentDeuces: data.currentDeuces,
      settings: MatchSettings.fromJSON(data.settings),
      leftTeam: TeamMatchInfo.fromJSON(data.leftTeam),
      rightTeam: TeamMatchInfo.fromJSON(data.rightTeam),
      storageVersion: data.STORAGE_VERSION,
    });
  }

  getTeam(side) {
    return side === SIDE.LEFT ? this.leftTeam : this.rightTeam;
  }

  withTeams(leftTeam, rightTeam) {
    return new Game({ ...this.toJSON(), leftTeam, rightTeam, settings: this.settings });
  }

  teamWasServing(side) {
    return this.getTeam(side).hasService;
  }

  incrementScore(side) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).incrementScore();
    let game = this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );

    if (!this.teamWasServing(side)) {
      game = game.rotate(side).setService(side);
    }

    return game;
  }

  decrementScore(side) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).decrementScore();
    return this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );
  }

  rotate(side) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).rotate();
    return this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );
  }

  inverseRotate(side) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).inverseRotate();
    return this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );
  }

  updatePositions(side, newPositions) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).updatePositions(newPositions);
    return this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );
  }

  setService(side) {
    const leftHasService = side === SIDE.LEFT;
    return this.withTeams(
      this.leftTeam.setService(leftHasService),
      this.rightTeam.setService(!leftHasService)
    );
  }

  updateTeamName(side, name) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).updateTeamName(name);
    return this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );
  }

  incrementSets(side) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).incrementSets();
    return this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );
  }

  decrementSets(side) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).decrementSets();
    return this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );
  }

  useTimeOut(side) {
    const teamKey = getTeamKey(side);
    const updatedTeam = this.getTeam(side).useTimeOut();
    return this.withTeams(
      teamKey === "leftTeam" ? updatedTeam : this.leftTeam,
      teamKey === "rightTeam" ? updatedTeam : this.rightTeam
    );
  }

  changeSides() {
    return this.withTeams(this.rightTeam, this.leftTeam);
  }

  updateMatchSettings(newSettings) {
    return new Game({
      ...this.toJSON(),
      settings: MatchSettings.fromJSON(newSettings),
    });
  }

  resetMatchSettings() {
    return new Game({
      ...this.toJSON(),
      settings: MatchSettings.defaults(),
    });
  }

  restartGame(preserveData) {
    const fresh = Game.defaults();
    if (!preserveData) {
      return fresh;
    }

    return new Game({
      gameDate: this.gameDate,
      currentDeuces: 0,
      settings: this.settings,
      leftTeam: new TeamMatchInfo({
        team: this.leftTeam.team,
        hasService: true,
        positions: [...this.leftTeam.positions],
        score: 0,
        setsWon: this.leftTeam.setsWon,
        usedTimeOuts: 0,
      }),
      rightTeam: new TeamMatchInfo({
        team: this.rightTeam.team,
        hasService: false,
        positions: [...this.rightTeam.positions],
        score: 0,
        setsWon: this.rightTeam.setsWon,
        usedTimeOuts: 0,
      }),
      storageVersion: STORAGE_VERSION,
    });
  }

  validateWin() {
    if (this.settings.deuce.allowed) {
      return this.validateDeuceWin();
    }
    return this.validateMaxPointsWin();
  }

  validateDeuceWin() {
    if (
      this.leftTeam.score >= this.settings.maxSetPoints &&
      this.leftTeam.score - this.rightTeam.score >= 2
    ) {
      return SIDE.LEFT;
    }
    if (
      this.rightTeam.score >= this.settings.maxSetPoints &&
      this.rightTeam.score - this.leftTeam.score >= 2
    ) {
      return SIDE.RIGHT;
    }
    return false;
  }

  validateMaxPointsWin() {
    if (this.leftTeam.score >= this.settings.maxSetPoints) {
      return SIDE.LEFT;
    }
    if (this.rightTeam.score >= this.settings.maxSetPoints) {
      return SIDE.RIGHT;
    }
    return false;
  }

  acceptWinSet(side) {
    const winner = this.getTeam(side);
    const teamWonSetMessage =
      winner.name +
      " " +
      (getLabel("won_set") || "won the set") +
      "\n\n" +
      (getLabel("want_restart_and_change_sides") || "Do you want to restart and change sides?");

    if (!window.confirm(teamWonSetMessage)) {
      return this;
    }

    let updated = this.incrementSets(side);
    updated = updated.withTeams(
      updated.leftTeam.resetForNewSet(),
      updated.rightTeam.resetForNewSet()
    );
    return updated.changeSides();
  }

  validateTimeoutAvailable(side) {
    const usedTimeOuts = this.getTeam(side).usedTimeOuts;
    if (usedTimeOuts >= this.settings.maxTimeOuts) {
      return {
        valid: false,
        message: getLabel("team_reached_max_timeouts") + " " + this.settings.maxTimeOuts,
      };
    }
    return { valid: true };
  }

  toJSON() {
    return {
      gameDate: this.gameDate,
      currentDeuces: this.currentDeuces,
      settings: this.settings.toJSON(),
      leftTeam: this.leftTeam.toJSON(),
      rightTeam: this.rightTeam.toJSON(),
      STORAGE_VERSION: this.STORAGE_VERSION,
    };
  }
}

export function getDefaultGame() {
  return Game.defaults().toJSON();
}

export function getGameFromTeams(leftTeam, rightTeam) {
  return Game.fromTeams(leftTeam, rightTeam).toJSON();
}

export function getLatestStorageVersion() {
  return STORAGE_VERSION;
}
