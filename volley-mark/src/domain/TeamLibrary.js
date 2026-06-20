import { getLabel } from "../Utils/Labels";
import { Team } from "./Team";
import { Player, createPlayer } from "./Player";

export class TeamLibrary {
  constructor(teams = []) {
    this.teams = teams.map((t) => (t instanceof Team ? t : Team.fromJSON(t)));
  }

  static fromJSON(data) {
    if (!data) {
      return new TeamLibrary([]);
    }
    const list = Array.isArray(data) ? data : data.teams || [];
    return new TeamLibrary(list);
  }

  toJSON() {
    return this.teams.map((t) => t.toJSON());
  }

  addTeam(teamData) {
    const { name, players } = teamData;
    if (!name || name.trim() === "") {
      throw new Error(getLabel("name_cannot_be_empty") || "Team name cannot be empty");
    }
    const playerList = (players || []).map((p, index) =>
      p instanceof Player ? p : Player.fromJSON(typeof p === "string" ? { tshirt: p, id: index + 1 } : p)
    );
    return new TeamLibrary([...this.teams, new Team({ id: `team_${Date.now()}`, name, players: playerList })]);
  }

  updateTeam(teamId, updates) {
    return new TeamLibrary(
      this.teams.map((team) =>
        team.id === teamId
          ? Team.fromJSON({ ...team.toJSON(), ...updates, id: team.id, createdAt: team.createdAt })
          : team
      )
    );
  }

  deleteTeam(teamId) {
    return new TeamLibrary(this.teams.filter((team) => team.id !== teamId));
  }

  getTeamById(teamId) {
    return this.teams.find((team) => team.id === teamId) || null;
  }

  addPlayerToTeam(teamId, player) {
    return new TeamLibrary(
      this.teams.map((team) =>
        team.id === teamId
          ? team.updatePlayers([...team.players, player instanceof Player ? player : Player.fromJSON(player)])
          : team
      )
    );
  }

  removePlayerFromTeam(teamId, playerId) {
    return new TeamLibrary(
      this.teams.map((team) =>
        team.id === teamId
          ? team.updatePlayers(team.players.filter((p) => p.id !== playerId))
          : team
      )
    );
  }

  updatePlayerInTeam(teamId, playerId, updates) {
    return new TeamLibrary(
      this.teams.map((team) =>
        team.id === teamId
          ? team.updatePlayers(
              team.players.map((p) => (p.id === playerId ? Player.fromJSON({ ...p.toJSON(), ...updates }) : p))
            )
          : team
      )
    );
  }

  duplicateTeam(teamId) {
    const teamToDuplicate = this.getTeamById(teamId);
    if (!teamToDuplicate) {
      throw new Error("Team not found");
    }
    const duplicated = new Team({
      id: `team_${Date.now()}`,
      name: teamToDuplicate.name + " (Copy)",
      players: teamToDuplicate.players.map((p) => createPlayer(p.tshirt, p.id)),
    });
    return new TeamLibrary([...this.teams, duplicated]);
  }

  replaceAll(teams) {
    return TeamLibrary.fromJSON(teams);
  }
}

export function createTeam(name, players = []) {
  return new Team({ id: `team_${Date.now()}`, name, players }).toJSON();
}
