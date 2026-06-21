export class MatchSettings {
  constructor({ maxSetPoints, deuce, maxSets, maxTimeOuts, setSubstitutions } = {}) {
    this.maxSetPoints = maxSetPoints ?? 25;
    this.deuce = deuce ?? { allowed: true, howMany: undefined };
    this.maxSets = maxSets ?? 5;
    this.maxTimeOuts = maxTimeOuts ?? 2;
    this.setSubstitutions = setSubstitutions ?? 6;
  }

  static defaults() {
    return new MatchSettings();
  }

  static fromJSON(data) {
    if (!data) {
      return MatchSettings.defaults();
    }
    return new MatchSettings({
      maxSetPoints: data.maxSetPoints,
      deuce: data.deuce,
      maxSets: data.maxSets,
      maxTimeOuts: data.maxTimeOuts,
      setSubstitutions: data.setSubstitutions,
    });
  }

  toJSON() {
    return {
      maxSetPoints: this.maxSetPoints,
      deuce: { ...this.deuce },
      maxSets: this.maxSets,
      maxTimeOuts: this.maxTimeOuts,
      setSubstitutions: this.setSubstitutions,
    };
  }
}

export function getDefaultSettings() {
  return MatchSettings.defaults().toJSON();
}
