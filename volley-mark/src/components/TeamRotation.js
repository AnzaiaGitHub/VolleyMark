import { useState } from "react";
export function TeamRotation({ positions, side, callAction }) {
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
    <div className="team-rotation">
      <button className="toggle-rotation-btn" onClick={toggleCourtVisibility}>
        {showCourtPositions ? "Hide Rotation" : "Show Rotation"}
      </button>

      {showCourtPositions &&
      <>
        {!showEditPositions && <Rotation positions={positions} side={side} editPositions={() => setShowEditPosition(true)} />}
        {showEditPositions && <EditRotation positions={positions} updatePositions={updatePositions}/> }
      </>
      }
    </div>
  );
}

function Rotation({ positions, side, editPositions}) {
  const sideLetter = side === "LEFT" ? "L" : "R";
  return (
    <>
      <h3 className="rotation-title">Team Rotation</h3>
      <ul className="rotation-list">
        {positions.map((position, index) => (
          <li
            key={index}
            className={`rotation-item `+sideLetter+`${+index + 1}`}
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
      alert("Please enter exactly 6 positions, separated by commas.");
      return false;
    }
    return true;
  };

  return (
    <div className="edit-rotation">
      <h4>Edit Rotation</h4>
      <input
        type="text"
        value={editedRotation}
        onChange={(e) => setEditedRotation(e.target.value)}
        onBlur={() => {
          if(!checkPositions(editedRotation)) {
            setEditedRotation(positions.join(','));
          }}}
        autoFocus
        className="edit-positions-input"
        />
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