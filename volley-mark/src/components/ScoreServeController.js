import { ServiceBall } from './ServiceBall';
export function ScoreServeController({score, hasService, setService, side, callAction}) {
  const handleIncrement = () => {
    callAction("INCREMENT_SCORE", side);
  };

  const handleDecrement = () => {
    if (score > 0) {
      callAction("DECREMENT_SCORE", side);
    }
  };

  return (
    <div className={`score-controller${side === 'RIGHT' ? " reverse" : ""}`}>
      <div className="service-decrement-container">
        <ServiceBall hasService={hasService} setService={setService} />
        <div className="score-decrement" onClick={() => handleDecrement()}>-</div>
      </div>
      <div className='score-mark'>
        <div onClick={() => handleIncrement()}>
          {score.toString().split('').map((char,index) => {
            return (<span key={index + side}>{char}</span>)
          })}
        </div>
      </div>
    </div>
  );
}