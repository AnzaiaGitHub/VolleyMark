export function SetsController({setsWon, side, callAction}) {
  const handleIncrement = () => {
    callAction("INCREMENT_SETS", side);
  };

  const handleDecrement = () => {
    if (setsWon > 0) {
      callAction("DECREMENT_SETS", side);
    }
  };

  return (
    <div className="team-set-controller">
      <div className="sets-team-handler">
        <div className="sets-btn" onClick={() => handleDecrement()}>-</div>
      </div>
      <div
        className="sets-won-card"
        onClick={()=>{handleIncrement()}}>{setsWon}</div>
    </div>
  );
}