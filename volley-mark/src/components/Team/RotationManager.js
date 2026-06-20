import React, { useEffect, useRef, useState } from "react";
import { getLabel } from "../../Utils/Labels";
import { crossedArrowsSVG } from "../../icons/crossedArrows";
import { restartSVG } from "../../icons/restart";
import { BottomSheet } from "../Common/BottomSheet";

export function RotationManager({ team, side, callAction }) {
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editingPosition, setEditingPosition] = useState(0);
  const positions = team.positions;

  const updatePositions = (newPositions) => {
    setShowEditSheet(false);
    callAction("UPDATE_POSITIONS", {side: side, newPositions: newPositions});
  };

  const editPositions = (positionToEdit) => {
    setEditingPosition(positionToEdit);
    setShowEditSheet(true);
  };

  return (
    <div className="rotation-manager">
      <Rotation positions={positions} editPositions={editPositions} side={side} callAction={callAction} />
      {showEditSheet && (
        <RotationEditSheet
          positions={positions}
          positionToEdit={editingPosition}
          onSave={updatePositions}
          onClose={() => setShowEditSheet(false)}
        />
      )}
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

function RotationEditSheet({ positions, positionToEdit, onSave, onClose }) {
  const [editedRotation, setEditedRotation] = useState(positions);
  const [positionIndex, setPositionIndex] = useState(positionToEdit);
  const [positionValue, setPositionValue] = useState(positions[positionToEdit]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [positionIndex]);

  const commitValue = () => {
    const trimmed = positionValue.trim();
    if (trimmed === "") {
      setPositionValue(editedRotation[positionIndex]);
      return editedRotation;
    }
    const newRotation = [...editedRotation];
    newRotation[positionIndex] = trimmed;
    setEditedRotation(newRotation);
    return newRotation;
  };

  const handleSave = () => {
    const latest = commitValue();
    onSave(latest);
  };

  const handleNextPosition = () => {
    const latest = commitValue();
    setEditedRotation(latest);
    const nextIndex = positionIndex < 5 ? positionIndex + 1 : 0;
    setPositionIndex(nextIndex);
    setPositionValue(latest[nextIndex]);
  };

  const handleLastPosition = () => {
    const latest = commitValue();
    setEditedRotation(latest);
    const prevIndex = positionIndex > 0 ? positionIndex - 1 : 5;
    setPositionIndex(prevIndex);
    setPositionValue(latest[prevIndex]);
  };

  const handleIndexClick = (index) => {
    const latest = commitValue();
    setEditedRotation(latest);
    setPositionIndex(index);
    setPositionValue(latest[index]);
  };

  return (
    <BottomSheet
      isOpen
      title={(getLabel("edit_position") || "Edit Position") + " " + (positionIndex + 1)}
      primaryLabel={getLabel("save") || "Save"}
      secondaryLabel={getLabel("cancel") || "Cancel"}
      onPrimary={handleSave}
      onSecondary={onClose}
      onClose={onClose}
    >
      <div className="edit-rotation-sheet">
        <ul className="rotation-list">
          {editedRotation.map((position, index) => (
            <li
              key={index}
              className={`rotation-item${index === positionIndex ? " editing" : ""}`}
              onClick={() => handleIndexClick(index)}
            >
              <span className="position-label">{position}</span>
            </li>
          ))}
        </ul>
        <label htmlFor="rotation-sheet-input">
          {(getLabel("edit_position") || "Edit Position") + " " + (positionIndex + 1)}:
          <input
            id="rotation-sheet-input"
            ref={inputRef}
            name="rotation"
            type="text"
            value={positionValue}
            onChange={(e) => setPositionValue(e.target.value)}
            className="edit-positions-input"
          />
        </label>
        <div className="edit-rotation-btns">
          <button type="button" onClick={handleLastPosition} className="position-handler-btn">
            {getLabel("last") || "Last"}
          </button>
          <button type="button" onClick={handleNextPosition} className="position-handler-btn">
            {getLabel("next") || "Next"}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
