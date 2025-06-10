import { useState } from "react";
import { SetsController } from "./SetsController";
import { ScoreServeController } from "./ScoreServeController"
import { TeamRotation } from "./TeamRotation";
export function Team({team, side, callAction}) {
  const setService = () => {
    callAction("SET_SERVICE", side);
  };

  const handleNameChange = (newName) => {
    if (newName.trim() === "") {
      alert("Team name cannot be empty");
      return;
    }

    callAction("UPDATE_TEAM_NAME", { side, name: newName });
  };

  return (
    <div className="team-side">
      <div className={`name-set-row${side == "RIGHT" ? " reverse" : ""}`}>
        <TeamName name={team.name} changeName={handleNameChange}/>
        <SetsController setsWon={team.setsWon} side={side} callAction={callAction} />
      </div>
      <ScoreServeController score={team.score} hasService={team.hasService} setService={setService} side={side} callAction={callAction} />
      <TeamRotation positions={team.positions} side={side} callAction={callAction}/>
    </div>
  );
}

function TeamName({name, changeName}) {
  const [teamName, setTeamName] = useState(name);
  const [showNameInput, setShowNameInput] = useState(false);

  return (
    <div className="team-name">
      {showNameInput ? (
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          onBlur={() => {
            changeName(teamName);
            setShowNameInput(false);
          }}
          autoFocus
        />
      ) : (
        <h2 onClick={() => setShowNameInput(true)}>{teamName}</h2>
      )}
    </div>
  );
}