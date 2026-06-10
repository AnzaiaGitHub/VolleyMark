import { getLabel } from "../../Utils/Labels";
import { RotationManager } from "./RotationManager";
export function TeamManager({ team, side, callAction, maxTimeOuts }) {
  return (
    <div className={"team-manager "+side.toLowerCase()}>
      <h2>{team.team.name}</h2>
      <RotationManager team={team} side={side} callAction={callAction}/>
      <TimeOuts usedTimeOuts={team.usedTimeOuts} maxTimeOuts={maxTimeOuts} side={side} callAction={callAction} />
    </div>
  );
}

function TimeOuts({ usedTimeOuts, maxTimeOuts, side, callAction}) {
  const handleClick = () => {
    callAction("USE_TIMEOUT", side);
  };
  return (
    <div className="timeouts-container">
      <p>{getLabel("used_time_outs") || "Used Time Outs"}</p>
      <button onClick={handleClick}>{usedTimeOuts + "/" + maxTimeOuts}</button>
    </div>
  );
}