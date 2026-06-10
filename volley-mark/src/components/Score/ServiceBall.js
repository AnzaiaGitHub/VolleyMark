import { VolleyBallSVG } from "../../icons/volleyBall";
export function ServiceBall({hasService, setService}) {
  return (
    <div onClick={() => setService()} className={`service-ball${hasService ? ' to-serve' : ''}`}>
      {VolleyBallSVG()}
    </div>
  );
}