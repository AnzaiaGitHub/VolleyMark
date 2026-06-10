import React, { useState } from "react";
import { getLabel } from "../../Utils/Labels";
import { crossedArrowsSVG } from "../../icons/crossedArrows";
import { restartSVG } from "../../icons/restart";
export function RotationManager({ team, side, callAction }) {
  const [showEditPositions, setShowEditPosition] = useState(false);
  const positions = team.positions;
  const [editingPosition, setEditingPosition] = useState(0);
  const updatePositions = (newPositions) => {
    setShowEditPosition(false);
    callAction("UPDATE_POSITIONS", {side: side, newPositions: newPositions});
  };

  const editPositions = (positionToEdit) => {
    setEditingPosition(positionToEdit);
    setShowEditPosition(true);
  };

  return (
    <div className="rotation-manager">
      {
        showEditPositions ?
        <EditRotation positions={positions} updatePositions={updatePositions} callAction={callAction} positionToEdit={editingPosition}/> :
        <Rotation positions={positions} editPositions={editPositions} side={side} callAction={callAction} />
      }
    </div>
  );
}
  
function Rotation({ positions, editPositions, side, callAction }) {
  const rotate = () => {
    callAction("ROTATE", side);
  };

  const inverseRotate = () => {
    callAction("INVERSE_ROTATE", side);
  };

  const playerChange = () => {
    console.log("Player change for " + side);
  };

  return (
    <div className="rotation-container">
      <ul className={`rotation-list ${side.toLowerCase()}`}>
        {positions.map((position, index) => (
          <li
            key={index}
            className={`rotation-item p${+index+1} ${side.toLowerCase()}`}
            onClick={() => editPositions(index)}>
            <span className="position-label">{position}</span>
          </li>
        ))}
      </ul>
      <div className="rotation-btn_container">
        <button className="player-change" onClick={playerChange}>
          {crossedArrowsSVG()}
        </button>
        <button className="rotate-forward" onClick={rotate}>
          {restartSVG()}
        </button>
        <button className="rotate-backward" onClick={inverseRotate}>
          {restartSVG()}
        </button>
      </div>
    </div>
  );
}

function EditRotation({ positions, updatePositions, positionToEdit }) {
  const [editedRotation, setEditedRotation] = useState(positions);
  const [positionIndex, setPositionIndex] = useState(positionToEdit);
  const [positionValue, setPositionValue] = useState(positions[positionToEdit]);

  const handleBlur = () => {
    if(positionValue.trim() === '') {
      setPositionValue(positions[positionIndex]);
      return;
    }
    setEditedRotation(prev => {
      const newRotation = [...prev];
      newRotation[positionIndex] = positionValue.trim();
      return newRotation;
    });
  };

  const handleSave = () => {
    handleBlur();
    updatePositions(editedRotation);
  };

  const handleNextPosition = () => {
    handleBlur();
    if(positionIndex < 5) {
      setPositionIndex(positionIndex + 1);
      setPositionValue(positions[positionIndex + 1]);
    } else {
      setPositionIndex(0);
      setPositionValue(positions[0]);
    }
  };

  const handleLastPosition = () => {
    handleBlur();
    if(positionIndex > 0) {
      setPositionIndex(positionIndex - 1);
      setPositionValue(positions[positionIndex - 1]);
    } else {
      setPositionIndex(5);
      setPositionValue(positions[5]);
    }
  };

  const handleIndexClick = (index) => {
    handleBlur();
    setPositionIndex(index);
    setPositionValue(positions[index]);
  }

  return (
    <div className="edit-rotation">
      <ul className="rotation-list">
        {editedRotation.map((position, index) => (
          <li key={index} className={`rotation-item${index === positionIndex ? " editing" : ""}`} onClick={() => handleIndexClick(index)}>
            <span className="position-label">{position}</span>
          </li>
        ))}
      </ul>
      <label htmlFor="rotation">{(getLabel("edit_position") || "Edit Position") + " " + (positionIndex + 1)}:
      <input
        name="rotation"
        type="text"
        value={positionValue}
        onChange={(e) => setPositionValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
        className="edit-positions-input"
        />
      </label>
      <div className="edit-rotation-btns">
        <button onClick={handleLastPosition} className="position-handler-btn">
          {getLabel("last") || "Last"}
        </button>
        <button onClick={handleNextPosition} className="position-handler-btn">
          {getLabel("next") || "Next"}
        </button>
        <button
          className="save-positions-btn"
          onClick={handleSave}>
          {(getLabel("save") || "Save Positions")}
        </button>
      </div>
    </div>
  );
}