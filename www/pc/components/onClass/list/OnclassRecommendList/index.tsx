import * as React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import ReactCustomSlick from '../../../common/ReactCustomSlick';
import FeedApi from '../../../../src/apis/FeedApi';
import Loading from '../../../common/Loading';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import SimplePaginator from '../../../UI/paginator/SimplePaginator';
import {staticUrl} from '../../../../src/constants/env';
import BandCard from '../../../UI/Card/BandCard/BandCard';
import isEmpty from 'lodash/isEmpty';
import OnClassRecommendItem from './OnClassRecommendItem';
import cn from 'classnames';
import NoContentText from '../../../NoContent/NoContentText';

const StyledBandCard = styled(BandCard)`
  width: 1090px;
  margin: auto;
  padding: 40px 0 50px;
  box-sizing: border-box;

  &.recommend-band-card {
    border-top: 0;
  }

  .slider-wrap {
    position: relative;
  }

  .slick-list {
    width: 1117px;
  }
`;

const StyledSimplePaginator = styled(SimplePaginator)`
  position: absolute;
  right: -4px;
  top: -44px;
  z-index: 2;

  button {
    padding-right: 4px;

    img { 
      width: 25px;
    }
  }
`;

const SLIDER_SHOW_LENGTH = 3;

const sliderSettings = {
  slidesToShow: SLIDER_SHOW_LENGTH,
  slidesToScroll: 1,
  speed: 500,
  arrows: false,
  dots: false,
  infinite: false,
  variableWidth: true
};

interface Props {
  className?: string;
  title: string;
}

const OnClassRecommendCard: React.FC<Props> = (({
  className,
  title,
}) => {
    const [resData, setResData] = React.useState([]);
    const [pending, setPending] = React.useState(true);
    // API
    const feedApi: FeedApi = useCallAccessFunc(access => access && new FeedApi(access));
    const sliderRef = React.useRef<Slider>(null);

    React.useEffect(() => {
      if (feedApi) {
        feedApi.onclass()
          .then(({status, data: {results}}) => {
            if( status === 200 ) {
              setPending(false);
              setResData(results);
            }
        });
      }
    }, []);

    if (pending) {
      return <Loading/>;
    }

    return (
      <StyledBandCard
        className={cn('recommend-band-card', className)}
        title={title}
      >
        <div className="slider-wrap">
          {resData.length > 3 && (
            <StyledSimplePaginator
              content={{
                left: (
                  <img
                    src={staticUrl("/static/images/icon/arrow/icon-arrow-left3.png")}
                    alt="이전으로"
                  />
                ),
                right: (
                  <img
                    src={staticUrl("/static/images/icon/arrow/icon-arrow-right3.png")}
                    alt="다음으로"
                  />
                )
              }}
              prevClickEvent={() => sliderRef.current.slickPrev()}
              nextClickEvent={() => sliderRef.current.slickNext()}
            />
          )}
          {!isEmpty(resData) ? (
            <ReactCustomSlick
              ref={sliderRef}
              {...sliderSettings}
            >
              {resData.map(({
                slug,
                story,
                oncoming_month,
                thumbnail = ''
              }) =>
                <OnClassRecommendItem
                  slug={slug}
                  story={story}
                  oncoming_month={oncoming_month}
                  thumbnail={thumbnail}
                />
              )}
            </ReactCustomSlick>
          ) : (
            <NoContentText alt="목록이 비었습니다.">
              <p>
                와 당신은 모든 강의를 마스터하셨군요!<br/>
                추천해 드릴 강의가 없네요!<br/>
                추천해 드릴 강의를 찾아올게요! 조금만 기다려주세요!
              </p>
            </NoContentText>
          )}
        </div>
      </StyledBandCard>
    );
  }
);

export default React.memo(OnClassRecommendCard);
