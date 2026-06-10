import { ServiceBall } from './ServiceBall';
export function ScoreServeController({teamInfo, side, callAction}) {
  const handleIncrement = () => {
    callAction("INCREMENT_SCORE", side);
  };

  const handleDecrement = () => {
    callAction("DECREMENT_SCORE", side);
  };

  const setService = () => {
    callAction("SET_SERVICE", side);
  };

  return (
    <div className={`score-controller${side === 'RIGHT' ? " reverse" : ""}`}>
      <div className="service-decrement-container">
        {
          <p className={`service-indicator ${side.toLowerCase()} ${teamInfo.hasService ? "to-serve" : ""}`}>
            {teamInfo.positions[0]}
          </p>
        }
        <ServiceBall hasService={teamInfo.hasService} setService={setService} />
        <div className="score-decrement" onClick={() => handleDecrement()}>-</div>
      </div>
      <div className='score-mark'>
        <div onClick={() => handleIncrement()}>
          {teamInfo.score.toString().split('').map((char,index) => {
            return (<span key={index + side}>{char}</span>)
          })}
        </div>
      </div>
    </div>
  );
}