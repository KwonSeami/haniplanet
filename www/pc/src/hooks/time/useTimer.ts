import * as React from 'react';
import useInterval from '../useInterval';
import {SECOND} from '../../constants/times';

interface IArgument {
  time: number;
  autoStart?: boolean;
}

const useTimer = ({time, autoStart}: IArgument) => {
  const [timer, setTimer] = React.useState(time);
  const memoSetTimer = React.useCallback(() => {
    setTimer(curr => curr - SECOND);
  }, []);

  React.useEffect(() => {
    if (timer <= 0) {
      clearInterval(interval.intervalId);
    }
  }, [timer]);

  const interval = useInterval({
    duration: 1 * SECOND,
    callback: memoSetTimer,
    autoStart
  });

  return {
    timer,
    ...interval
  };
};

export default useTimer;
