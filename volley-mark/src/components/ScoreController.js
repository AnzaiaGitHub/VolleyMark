export function ScoreController({score, handleScore}) {
  const handleIncrement = () => {
    handleScore(score + 1);
  };

  const handleDecrement = () => {
    if(score > 0){
      handleScore(score - 1);
    }
  };


  return (
    <>
      <div className='scoreMark'>{score}</div>
    </>
  );
}