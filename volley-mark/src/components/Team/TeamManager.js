import { useState } from "react";
import { getLabel } from "../../Utils/Labels";
import { RotationManager } from "./RotationManager";
import { SubstitutionModal } from "./SubstitutionModal";
import { crossedArrowsSVG } from "../../icons/crossedArrows";

export function TeamManager({ team, side, callAction, maxTimeOuts, setSubstitutions }) {
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);

  const handleSubstitution = (newPositions) => {
    // newPositions array is passed from SubstitutionModal
    // The substitutePlayer logic in the domain handles adding new players
    const outPlayer = team.positions.find((p, i) => newPositions[i] !== p);
    const inPlayer = newPositions.find((p, i) => team.positions[i] !== p);
    
    if (outPlayer && inPlayer) {
      callAction("SUBSTITUTE_PLAYER", { side, outPlayer, inPlayer });
      callAction("USE_SUBSTITUTION", side);
    }
  };

  return (
    <div className={"team-manager "+side.toLowerCase()}>
      <h2>{team.team.name}</h2>
      <RotationManager team={team} side={side} callAction={callAction}/>
      <div className="team-manager-controls">
        <TimeOuts usedTimeOuts={team.usedTimeOuts} maxTimeOuts={maxTimeOuts} side={side} callAction={callAction} />
        <Substitutions 
          usedSubstitutions={team.usedSubstitutions} 
          maxSubstitutions={setSubstitutions} 
          side={side} 
          onOpenModal={() => setShowSubstitutionModal(true)}
        />
      </div>
      {showSubstitutionModal && (
        <SubstitutionModal
          team={team.team}
          positions={team.positions}
          side={side}
          onSubstitute={handleSubstitution}
          onClose={() => setShowSubstitutionModal(false)}
        />
      )}
    </div>
  );
}

function TimeOuts({ usedTimeOuts, maxTimeOuts, side, callAction}) {
  const handleClick = () => {
    callAction("USE_TIMEOUT", side);
  };
  return (
    <div className="timeouts-container">
      <p>{usedTimeOuts + "/" + maxTimeOuts}</p>
      <button onClick={handleClick} className="timeout-btn">
        {"T"}
      </button>
    </div>
  );
}

function Substitutions({ usedSubstitutions, maxSubstitutions, side, onOpenModal }) {
  return (
    <div className="substitutions-container">
      <p>{usedSubstitutions + "/" + maxSubstitutions}</p>
      <button onClick={onOpenModal} className="substitution-btn">
        {crossedArrowsSVG()}
      </button>
    </div>
  );
}