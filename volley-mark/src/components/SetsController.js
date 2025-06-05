export function SetsController({setsWon, handleSetsWon}) {
  const handleIncrement = () => {
    handleSetsWon(setsWon + 1);
  };

  const handleDecrement = () => {
    if(setsWon > 0) {
      handleSetsWon(setsWon - 1);
    }
  };

  return (
    <div className="team-set-controller">
      <div className="sets-team-handler">
        <div className="sets-btn" onClick={() => handleIncrement()}>+</div>
        <div className="sets-btn" onClick={() => handleDecrement()}>-</div>
      </div>
      <div className="sets-won-card">{setsWon}</div>
    </div>
  );
}