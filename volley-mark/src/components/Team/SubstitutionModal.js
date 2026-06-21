import React, { useState } from "react";
import { getLabel } from "../../Utils/Labels";
import "./SubstitutionModal.css";

export function SubstitutionModal({ team, positions, side, onSubstitute, onClose }) {
  const [selectedOutPlayer, setSelectedOutPlayer] = useState(null);
  const [selectedInPlayer, setSelectedInPlayer] = useState(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  // Get players currently on court
  const playersOnCourt = positions;

  // Get players available on bench (not on court)
  const playersOnBench = team.players.filter(
    (player) => !playersOnCourt.includes(player.tshirt)
  );

  const handleAddNewPlayer = () => {
    if (newPlayerName.trim() === "") {
      alert(getLabel("name_cannot_be_empty") || "Name cannot be empty");
      return;
    }

    if (selectedOutPlayer === null) {
      alert(getLabel("select_player_to_substitute") || "Please select a player to substitute");
      return;
    }

    // Use the new player name as the replacement
    handleConfirmSubstitution(selectedOutPlayer, newPlayerName.trim());
  };

  const handleConfirmSubstitution = (outPlayer, inPlayer) => {
    if (outPlayer === null || inPlayer === null) {
      alert(getLabel("select_both_players") || "Please select both players");
      return;
    }

    const newPositions = [...positions];
    const outIndex = newPositions.indexOf(outPlayer);
    if (outIndex !== -1) {
      newPositions[outIndex] = inPlayer;
      onSubstitute(newPositions);
      onClose();
    }
  };

  const handleRegularSubstitution = () => {
    if (selectedOutPlayer && selectedInPlayer) {
      handleConfirmSubstitution(selectedOutPlayer, selectedInPlayer);
    }
  };

  const isValid = selectedOutPlayer !== null && (selectedInPlayer !== null || (showAddPlayer && newPlayerName.trim()));

  return (
    <div className="substitution-modal-overlay">
      <div className="substitution-modal">
        <div className="modal-header">
          <h2>{getLabel("player_substitution") || "Player Substitution"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Players on Court */}
          <section className="section">
            <h3>{getLabel("players_on_court") || "Players on Court"}</h3>
            <div className="players-list">
              {playersOnCourt.map((player, index) => (
                <button
                  key={index}
                  className={`player-btn ${selectedOutPlayer === player ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedOutPlayer(player);
                    setSelectedInPlayer(null);
                    setShowAddPlayer(false);
                  }}
                >
                  <span className="position">{index + 1}</span>
                  <span className="name">{player}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Replacement Options */}
          {selectedOutPlayer && (
            <>
              {/* Available Players on Bench */}
              {playersOnBench.length > 0 && (
                <section className="section">
                  <h3>{getLabel("available_players") || "Available Players"}</h3>
                  <div className="players-list bench">
                    {playersOnBench.map((player) => (
                      <button
                        key={player.id}
                        className={`player-btn ${selectedInPlayer === player.tshirt ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedInPlayer(player.tshirt);
                          setShowAddPlayer(false);
                        }}
                      >
                        <span className="name">{player.tshirt}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Add New Player Option */}
              <section className="section">
                <button
                  className={`toggle-add-btn ${showAddPlayer ? "active" : ""}`}
                  onClick={() => {
                    setShowAddPlayer(!showAddPlayer);
                    setSelectedInPlayer(null);
                  }}
                >
                  {showAddPlayer ? "−" : "+"} {getLabel("add_new_player") || "Add New Player"}
                </button>

                {showAddPlayer && (
                  <div className="add-player-form">
                    <input
                      type="text"
                      placeholder={getLabel("player_name") || "Player name"}
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      autoFocus
                    />
                    <button
                      className="add-player-submit"
                      onClick={handleAddNewPlayer}
                      disabled={!newPlayerName.trim()}
                    >
                      {getLabel("add") || "Add"}
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button
            className="confirm-btn"
            onClick={handleRegularSubstitution}
            disabled={!isValid}
          >
            {getLabel("confirm_substitution") || "Confirm Substitution"}
          </button>
          <button className="cancel-btn" onClick={onClose}>
            {getLabel("cancel") || "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
