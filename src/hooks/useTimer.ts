import { useEffect, useState } from 'react';

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const calculateDeadline = (timeout: number) => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + timeout);

  return now.getTime() - Date.now();
};

// Adapted from https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9#comment-20h8n
const useTimer = (seconds: number) => {
  const [secondsLeft, setSecondsLeft] = useState(calculateDeadline(seconds));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (secondsLeft > 0) {
        setSecondsLeft((previous) => previous - 1000);
      } else {
        setSecondsLeft(0);
        clearTimeout(timeoutId);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [secondsLeft]);

  /* If the initial deadline value changes */
  useEffect(() => {
    setSecondsLeft(calculateDeadline(seconds));
  }, [seconds]);

  return {
    hours: Math.floor((secondsLeft / HOUR) % 24),
    minutes: Math.floor((secondsLeft / MINUTE) % 60),
    seconds: Math.floor((secondsLeft / SECOND) % 60),
  };
};

export default useTimer;
