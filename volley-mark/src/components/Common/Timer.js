import { getLabel } from "../../Utils/Labels";
import { useEffect, useState } from "react";

export const Timer = ({seconds, callAction}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);

  const stop = () => {
    callAction("STOP_TIMER", null);
  };

  useEffect(() => {
    setRemainingSeconds(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      callAction("STOP_TIMER", null);
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, stop]);

  return (
    <div className="timer" onClick={stop}>
      <p>{remainingSeconds}</p>
    </div>
  );
};