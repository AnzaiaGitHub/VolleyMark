import { Team } from "./Team";

const rotateForward = (positions) => positions.slice(1).concat(positions[0]);
const rotateBackward = (positions) => [positions[positions.length - 1], ...positions.slice(0, -1)];

export class TeamMatchInfo {
  constructor({ team, hasService, positions, score, setsWon, usedTimeOuts, usedSubstitutions }) {
    this.team = team instanceof Team ? team : Team.fromJSON(team);
    this.hasService = Boolean(hasService);
    this.positions = positions ?? this.team.players.map((p) => p.tshirt).slice(0, 6);
    this.score = score ?? 0;
    this.setsWon = setsWon ?? 0;
    this.usedTimeOuts = usedTimeOuts ?? 0;
    this.usedSubstitutions = usedSubstitutions ?? 0;
  }

  static fromTeam(team, hasService) {
    const positions = team.players.map((p) => p.tshirt).slice(0, 6);
    return new TeamMatchInfo({ team, hasService, positions, score: 0, setsWon: 0, usedTimeOuts: 0, usedSubstitutions: 0 });
  }

  static fromJSON(data) {
    if (!data) {
      return TeamMatchInfo.fromTeam(Team.createDefault("A"), false);
    }

    const teamData = data.team ?? {
      id: data.id,
      name: data.name,
      players: data.players,
    };

    return new TeamMatchInfo({
      team: Team.fromJSON(teamData),
      hasService: data.hasService,
      positions: data.positions,
      score: data.score,
      setsWon: data.setsWon,
      usedTimeOuts: data.usedTimeOuts,
      usedSubstitutions: data.usedSubstitutions,
    });
  }

  get name() {
    return this.team.name;
  }

  incrementScore() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, score: this.score + 1 });
  }

  decrementScore() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, score: Math.max(0, this.score - 1) });
  }

  resetScore() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, score: 0 });
  }

  incrementSets() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, setsWon: this.setsWon + 1 });
  }

  decrementSets() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, setsWon: Math.max(0, this.setsWon - 1) });
  }

  useTimeOut() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, usedTimeOuts: this.usedTimeOuts + 1 });
  }

  decrementTimeOut() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, usedTimeOuts: Math.max(0, this.usedTimeOuts - 1) });
  }

  useSubstitution() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, usedSubstitutions: this.usedSubstitutions + 1 });
  }

  decrementSubstitutions() {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, usedSubstitutions: Math.max(0, this.usedSubstitutions - 1) });
  }

  setService(hasService) {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, hasService });
  }

  updateTeamName(name) {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team.updateName(name) });
  }

  rotate() {
    return new TeamMatchInfo({
      ...this.toJSON(),
      team: this.team,
      positions: rotateForward(this.positions),
    });
  }

  inverseRotate() {
    return new TeamMatchInfo({
      ...this.toJSON(),
      team: this.team,
      positions: rotateBackward(this.positions),
    });
  }

  updatePositions(newPositions) {
    return new TeamMatchInfo({ ...this.toJSON(), team: this.team, positions: newPositions });
  }

  substitutePlayer(outPlayerTshirt, inPlayerTshirt) {
    // Check if the incoming player is new to the team
    const playerExists = this.team.players.some(p => p.tshirt === inPlayerTshirt);
    let updatedTeam = this.team;
    
    if (!playerExists) {
      updatedTeam = this.team.addPlayer(inPlayerTshirt);
    }

    // Update positions
    const newPositions = [...this.positions];
    const outIndex = newPositions.indexOf(outPlayerTshirt);
    if (outIndex !== -1) {
      newPositions[outIndex] = inPlayerTshirt;
    }

    return new TeamMatchInfo({
      ...this.toJSON(),
      team: updatedTeam,
      positions: newPositions,
    });
  }

  resetForNewSet() {
    return new TeamMatchInfo({
      ...this.toJSON(),
      team: this.team,
      score: 0,
      usedTimeOuts: 0,
      usedSubstitutions: 0,
    });
  }

  toJSON() {
    return {
      team: this.team.toJSON(),
      hasService: this.hasService,
      positions: [...this.positions],
      score: this.score,
      setsWon: this.setsWon,
      usedSubstitutions: this.usedSubstitutions,
      usedTimeOuts: this.usedTimeOuts,
    };
  }
}

export function getTeamMatchInfo(team, hasService) {
  return TeamMatchInfo.fromTeam(team, hasService);
}
