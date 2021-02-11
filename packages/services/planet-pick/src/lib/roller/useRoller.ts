import * as React from 'react';

interface IRollerConfig {
  initialSlide: number;
  autoPlay: boolean;
  autoPlaySpeed: number;
}

const DEFAULT_CONFIG: IRollerConfig = {
  initialSlide: 0,
  autoPlay: false,
  autoPlaySpeed: 2000,
};

const useRoller = (length: number, config: Partial<IRollerConfig> = {}) => {
  const {
    initialSlide,
    autoPlay,
    autoPlaySpeed,
  } = {...DEFAULT_CONFIG, ...config};

  // State
  const [isPause, setIsPause] = React.useState(false);
  const [activeSlide, setActiveSlide] = React.useState(initialSlide);

  // Constants
  const lastSlideIdx = length - 1;

  // Function
  const goToSlide = (index: number) => setActiveSlide(index);
  const pauseSlide = () => setIsPause(true);
  const resumeSlide = () => setIsPause(false);
  const goToNextSlide = () => setActiveSlide(curr => (curr + 1) % length);
  const goToPrevSlide = () => setActiveSlide(curr => curr ? curr - 1 : lastSlideIdx);

  React.useEffect(() => {
    if (!autoPlay || isPause) return;
    const timeoutID = setInterval(goToNextSlide, autoPlaySpeed);

    return () => clearInterval(timeoutID);
  }, [autoPlay, isPause]);

  return {
    activeSlide,
    isPause,
    goToSlide,
    pauseSlide,
    resumeSlide,
    goToNextSlide,
    goToPrevSlide,
  }
};

export default useRoller;
