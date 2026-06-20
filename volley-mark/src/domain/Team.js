import { Player, createPlayer } from "./Player";

const generateTeamId = () => `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export class Team {
  constructor({ id, name, players = [], createdAt }) {
    this.id = id;
    this.name = name;
    this.players = players;
    this.createdAt = createdAt ?? Date.now();
  }

  static createDefault(label = "A") {
    const name = typeof label === "string" && label.startsWith("Team ") ? label : `Team ${label}`;
    const players = ["1", "2", "3", "4", "5", "6"].map((n) =>
      createPlayer(name.slice(-1) + n, parseInt(n, 10))
    );
    return new Team({
      id: Date.now().toString(),
      name,
      players,
    });
  }

  static fromJSON(data) {
    if (!data) {
      return Team.createDefault("A");
    }

    const legacyName = data.name;
    const players = (data.players || []).map((p) =>
      typeof p === "string" ? createPlayer(p, 0) : Player.fromJSON(p)
    );

    return new Team({
      id: data.id ?? generateTeamId(),
      name: legacyName ?? "Team",
      players,
      createdAt: data.createdAt,
    });
  }

  updateName(name) {
    return new Team({
      id: this.id,
      name,
      players: this.players,
      createdAt: this.createdAt,
    });
  }

  updatePlayers(players) {
    const normalized = players.map((p) =>
      p instanceof Player ? p : Player.fromJSON(p)
    );
    return new Team({
      id: this.id,
      name: this.name,
      players: normalized,
      createdAt: this.createdAt,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      players: this.players.map((p) => (p.toJSON ? p.toJSON() : p)),
      createdAt: this.createdAt,
    };
  }
}

export function getDefaultTeam(teamName) {
  return Team.createDefault(teamName);
}

export function getDefaultPlayers(teamName) {
  return Team.createDefault(teamName).players;
}
