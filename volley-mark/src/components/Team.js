import { SetsController } from "./SetsController";
import { ScoreController } from "./ScoreController"
export function Team({team, updateInfo}) {
  const handleSetsWon = (newSetsWon) => {
    updateInfo({...team,setsWon: newSetsWon});
  };

  const handleScore = (newScore) => {
    updateInfo({...team,score: newScore});
  }
  return (
    <div className="team-side">
      <div className={`name-set-row${team.side == "RIGHT" ? " reverse" : ""}`}>
        <h2 className="team-name">{team.name}</h2>
        <SetsController setsWon={team.setsWon} handleSetsWon={handleSetsWon} />
      </div>
      <ScoreController score={team.score} handleScore={handleScore} />
    </div>
  );
}