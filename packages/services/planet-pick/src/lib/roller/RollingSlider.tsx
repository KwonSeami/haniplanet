import * as React from 'react';
import cn from 'classnames';
import useRoller from './useRoller';

interface IRollerKeyword {
  keyword: string;
  count: number;
}

interface Props {
  keywordList: IRollerKeyword[];
  RollingItem: React.ComponentType<IRollerKeyword>;
}

const INITIAL_STATE = {
  autoPlay: true,
  autoPlaySpeed: 3000,
};

const RollingSlider: React.FC<Props> = ({keywordList = [], RollingItem}) => {
  const {activeSlide, isPause, pauseSlide, resumeSlide} = useRoller(keywordList.length, INITIAL_STATE);

  const pauseRollingSlider = () => !isPause && pauseSlide();
  const resumeRollingSlider = () => isPause && resumeSlide();

  return (
    <div className="rolling-slider">
      <ul
        onMouseOver={pauseRollingSlider}
        onMouseLeave={resumeRollingSlider}
      >
        {keywordList.map((item, idx) => (
          <li
            key={item.keyword}
            // 일시정지 중이 아닐 때와 activeSlide일 때 on className을 추가합니다.
            // hover 시의 스타일 변화는 사용하는 곳에선 css :hover 셀렉터로 작성이 필요합니다.
            className={cn({on: !isPause && idx === activeSlide})}
          >
            <RollingItem {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo<Props>(RollingSlider);
