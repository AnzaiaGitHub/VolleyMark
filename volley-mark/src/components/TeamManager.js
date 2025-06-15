import { useState } from "react";
import { getLabel } from "../Utils/Labels";
export function TeamManager({ positions, side, usedTimeOuts, callAction }) {
  const [showCourtPositions, setShowCourtPositions] = useState(false);
  const [showEditPositions, setShowEditPosition] = useState(false);
  
  const updatePositions = (newPositions) => {
    setShowEditPosition(false);
    callAction("UPDATE_POSITIONS", {side: side, newPositions: newPositions});
  };
  
  const toggleCourtVisibility = () => {
    setShowEditPosition(false);
    setShowCourtPositions(!showCourtPositions);
  };

  return (
    <div className={"team-manager "+side.toLowerCase()}>
      <p className={`team-manager_show-btn`} onClick={toggleCourtVisibility}>
        {showCourtPositions ? getLabel("close") : getLabel("manage_team")}
      </p>

      {showCourtPositions &&
      <>
        {(showEditPositions && <EditRotation positions={positions} updatePositions={updatePositions}/>) || <Rotation positions={positions} editPositions={() => setShowEditPosition(true)} />}
        <TimeOuts usedTimeOuts={usedTimeOuts} side={side} callAction={callAction} />
      </>
      }
    </div>
  );
}

function Rotation({ positions, editPositions}) {
  return (
    <>
      <ul className="rotation-list">
        {positions.map((position, index) => (
          <li
            key={index}
            className={`rotation-item p${+index+1}`}
            onClick={() => editPositions()}>
            <span className="position-label">{position}</span>
          </li>
        ))}
      </ul>
    </>

  );
}

function EditRotation({ positions, updatePositions }) {
  const [editedRotation, setEditedRotation] = useState(positions.join(','));
  const checkPositions = (positions) => {
    const positionArray = positions.split(',').map(pos => pos.trim());
    if (positionArray.length !== 6) {
      alert(getLabel("type_six_positions"));
      return false;
    }
    return true;
  };

  return (
    <div className="edit-rotation">
      <label for="rotation">Edit Rotation
      <input
        name="rotation"
        type="text"
        value={editedRotation}
        onChange={(e) => setEditedRotation(e.target.value)}
        onBlur={() => {
          if(editedRotation.trim() === '') {
            setEditedRotation(['1','2','3','4','5','6'].join(','));
            return;
          }
          if(!checkPositions(editedRotation)) {
            setEditedRotation(positions.join(','));
          }}}
        autoFocus
        className="edit-positions-input"
        />
      </label>
      <button
        className="save-positions-btn"
        onClick={() => {
          const newPositions = editedRotation.split(',').map(pos => pos.trim());
          updatePositions(newPositions);
        }}>
        Save Positions
      </button>
    </div>
  );
}

function TimeOuts({ usedTimeOuts, side, callAction}) {
  const handleClick = () => {
    callAction("USE_TIMEOUT", side);
  };
  return (
    <div className="timeouts-container">
      <p>{getLabel("used_time_outs")}</p>
      <button onClick={handleClick}>{usedTimeOuts}</button>
    </div>
  );
}