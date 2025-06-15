import { useEffect, useState, useRef } from "react";
import { getLabel } from "../Utils/Labels";
import { SetsController } from "./SetsController";
import { ScoreServeController } from "./ScoreServeController"
import { TeamManager } from "./TeamManager";
export function Team({team, side, callAction}) {
  const setService = () => {
    callAction("SET_SERVICE", side);
  };

  const handleNameChange = (newName) => {
    if (newName.trim() === "") {
      alert(getLabel("name_cannot_be_empty"));
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
      <TeamManager positions={team.positions} side={side} usedTimeOuts={team.usedTimeOuts} callAction={callAction}/>
    </div>
  );
}

function TeamName({name, changeName}) {
  const [teamInputName, setTeamInputName] = useState(name);
  const [showNameInput, setShowNameInput] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setTeamInputName(name);
  }, [name]);

  useEffect(() => {
    if (showNameInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showNameInput]);
  return (
    <div className="team-name">
      {showNameInput ? (
        <input
          type="text"
          value={teamInputName}
          onChange={(e) => setTeamInputName(e.target.value)}
          onBlur={() => {
            changeName(teamInputName);
            setShowNameInput(false);
          }}
          ref={inputRef}
        />
      ) : (
        <h2 onClick={() => setShowNameInput(true)}>{name}</h2>
      )}
    </div>
  );
}