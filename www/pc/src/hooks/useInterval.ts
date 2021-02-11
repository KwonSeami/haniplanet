import * as React from 'react';

interface IArgument {
  autoStart?: boolean;
  duration: number;
  callback: () => void;
}

const useInterval = ({ autoStart, duration, callback }: IArgument) => {
  const [intervalState, setIntervalState] = React.useState(
    autoStart === undefined ? true : autoStart
  );
  const [intervalId, setIntervalId] = React.useState(null);

  const memoSetIntervalState = state => React.useCallback(() => {
    setIntervalState(state);
  }, []);

  React.useEffect(() => {
    if (intervalState) {
      const intervalId = setInterval(() => {
        callback && callback();
      }, duration);
      setIntervalId(intervalId);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [intervalState, callback, duration]);

  return {
    intervalId,
    start: memoSetIntervalState(true),
    stop: memoSetIntervalState(false)
  };
};

export default useInterval;
