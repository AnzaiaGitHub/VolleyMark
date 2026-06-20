import { Game } from "./Game";
import { SIDE } from "../Constants";
import { TeamMatchInfo } from "./TeamMatchInfo";

describe("Game domain", () => {
  test("incrementScore rotates and grants service on side-out", () => {
    const game = Game.defaults();
    const receivingSide = game.rightTeam.hasService ? SIDE.LEFT : SIDE.RIGHT;
    const beforePositions = [...game.getTeam(receivingSide).positions];

    const updated = game.incrementScore(receivingSide);

    expect(updated.getTeam(receivingSide).score).toBe(1);
    expect(updated.getTeam(receivingSide).hasService).toBe(true);
    expect(updated.getTeam(receivingSide).positions).not.toEqual(beforePositions);
  });

  test("validateWin with deuce requires two point lead", () => {
    const base = Game.defaults();
    const leftAt24 = new TeamMatchInfo({ ...base.leftTeam.toJSON(), score: 24 });
    const rightAt24 = new TeamMatchInfo({ ...base.rightTeam.toJSON(), score: 24 });
    let game = base.withTeams(leftAt24, rightAt24);
    expect(game.validateWin()).toBe(false);

    const leftAt26 = new TeamMatchInfo({ ...base.leftTeam.toJSON(), score: 26 });
    const rightStillAt24 = new TeamMatchInfo({ ...base.rightTeam.toJSON(), score: 24 });
    game = base.withTeams(leftAt26, rightStillAt24);
    expect(game.validateWin()).toBe(SIDE.LEFT);
  });

  test("validateWin without deuce ends at max points", () => {
    const base = Game.defaults();
    const leftAt25 = new TeamMatchInfo({ ...base.leftTeam.toJSON(), score: 25 });
    const game = new Game({
      ...base.toJSON(),
      settings: { maxSetPoints: 25, deuce: { allowed: false }, maxSets: 5, maxTimeOuts: 2 },
      leftTeam: leftAt25,
      rightTeam: base.rightTeam,
    });

    expect(game.validateWin()).toBe(SIDE.LEFT);
  });

  test("toJSON and fromJSON round-trip", () => {
    const original = Game.defaults().incrementScore(SIDE.LEFT);
    const restored = Game.fromJSON(original.toJSON());

    expect(restored.toJSON()).toEqual(original.toJSON());
  });
});
