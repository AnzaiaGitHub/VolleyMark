import { useRef } from "react";
import { getLabel } from "../../Utils/Labels";
import { useInputSheet } from "../Common/InputSheetProvider";
import { SetsController } from "./SetsController";
import { ScoreServeController } from "../Score/ScoreServeController"

export function Team({teamMatchInfo, side, callAction}) {
  const team = teamMatchInfo.team;

  const handleNameChange = (newName) => {
    if (newName.trim() === "") {
      alert(getLabel("name_cannot_be_empty"));
      return;
    }

    callAction("UPDATE_TEAM_NAME", { side, name: newName.trim() });
  };

  return (
    <div className="team-side">
      <div className={`name-set-row${side == "RIGHT" ? " reverse" : ""}`}>
        <TeamName name={team.name} changeName={handleNameChange}/>
        <SetsController setsWon={teamMatchInfo.setsWon} side={side} callAction={callAction} />
      </div>
      <ScoreServeController teamInfo={teamMatchInfo} side={side} callAction={callAction} />
    </div>
  );
}

function TeamName({name, changeName}) {
  const { openTextSheet } = useInputSheet();
  const triggerRef = useRef(null);

  const handleEdit = () => {
    openTextSheet({
      title: getLabel("team_name") || "Team Name",
      value: name,
      triggerElement: triggerRef.current,
      onSave: (newName) => {
        changeName(newName);
      },
    });
  };

  return (
    <div className="team-name">
      <h2 ref={triggerRef} tabIndex={0} onClick={handleEdit} onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleEdit();
        }
      }}>{name}</h2>
    </div>
  );
}
