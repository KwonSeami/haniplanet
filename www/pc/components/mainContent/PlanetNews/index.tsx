import React, {useRef, useCallback, useState} from 'react';
import styled from 'styled-components';
import {$POINT_BLUE, $BORDER_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import SimplePaginator from '../../UI/paginator/SimplePaginator';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import NewsUrlPopup from './NewsUrlPopup';
import {IPlanetNews} from '../../../src/reducers/main'; 
import PlanetNewsUrlCard from './NewsUrlCard';
import {useDispatch} from 'react-redux';
import {patchCuratingThunk, curatingCacheKey} from '../../../src/reducers/main/thunk';
import MainWeeklyNews from './MainWeeklyNews';
import SimpleWeeklyNews from './SimpleWeeklyNews';
import DailyNews from './DailyNews';
import NewsUrlButton from './NewsUrlButton';
import {pushPopup} from '../../../src/reducers/popup';
import {LocalCache} from 'browser-cache-storage';
import isEmpty from 'lodash/isEmpty';
import NoContentText from '../../NoContent/NoContentText';

const MainNewsWrapper = styled.div`
  max-width: 1090px;
  margin: auto;

  .title-news {
    position: relative;
    margin: 40px 0 34px;
    padding-top: 26px;
    box-sizing: border-box;
    border-top: 1px solid ${$BORDER_COLOR};

    h2 {
      line-height: 24px;
      ${fontStyleMixin({
        size: 22,
        weight: '600',
      })};

      span {
        margin: -5px 0 0 8px;
        vertical-align: middle;
        display: inline-block;
        ${fontStyleMixin({
          size: 14,
          color: '#999'
        })};
      }
    }

    > ul {
      position: absolute;
      top: 19px;
      right: 0;

      li {
        ${heightMixin(42)};
        display: inline-block;
        vertical-align: middle;
        border: 1px solid #eee;
        box-sizing: border-box;
        text-align: center;

        &:last-child {
          width: 68px;
          margin-left: 11px;
        }

        &.on {
          border-color: ${$POINT_BLUE};
        }

        .news-url-btn img {
          width: 16px;
          vertical-align: middle;
        }
      }
    }
  }

  .today-news {
    position: relative;
    padding-bottom: 31px;
    overflow: hidden;

    > h2 {
      padding-bottom: 16px;
      ${fontStyleMixin({
        size: 20,
        weight: '300'
      })};
    }
  }

  .weekly-news {
    position: relative;
    overflow: hidden;

    > h2 {
      padding-bottom: 16px;
      ${fontStyleMixin({
        size: 20,
        weight: '300'
      })}
    }
  }

  .current-wrapper {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;

    .current {
      margin-right: 13px;
      ${fontStyleMixin({
        size: 12,
        family: 'Montserrat',
        weight: '300',
      })};
    }
  }
`;

const StyledSimplePaginator = styled(SimplePaginator)`
  display: inline-block;  

  button {
    padding-right: 4px;

    + button {
      padding-right: 0;
    }

    img { 
      width: 25px;
    }
  }
`;

const DailyNewsSlider = styled(ReactCustomSlick)`
  width: 1115px;

  .daily-news-wrapper {
    height: 180px;
    display: flex !important;
    flex-direction: column;
    flex-wrap: wrap;
  }
`;

const WeeklyNewsSlider = styled(ReactCustomSlick)`
  width: 1125px;

  .slick-slide {
    padding-right: 38px;
    box-sizing: border-box;
  }
`;

const DAILY_SLIDER_SLIDES = 5;

const dailySliderSettings = {
  autoplay: false,
  slidesToShow: DAILY_SLIDER_SLIDES,
  slidesToScroll: DAILY_SLIDER_SLIDES,
  draggable: false,
  arrows: false,
  infinite: false,
  variableWidth: true
};

const WEEKLY_SLIDER_ROWS = 5;
const WEEKLY_SLIDES_PER_SLIDE = 10;
const WEEKLY_SLIDES_PER_ROW = 2;

const weeklySliderSettings = {
  autoplay: false,
  slidesToShow: WEEKLY_SLIDES_PER_ROW,
  slidesToScroll: WEEKLY_SLIDES_PER_ROW,
  arrows: false,
  draggable: false,
  infinite: false,
  rows: WEEKLY_SLIDER_ROWS,
  slidePerRow: WEEKLY_SLIDES_PER_ROW
};

interface Props {
  data: IPlanetNews;
}

const MainPlanetNews: React.FC<Props> = ({data}) => {
  const dispatch = useDispatch();

  const {
    curatingPk,
    newspaper,
    dailyNews = [],
    weeklyNews = []
  } = data;

  const dailySliderRef = useRef(null);
  const weeklySliderRef = useRef(null);

  const dailyNewsTotalPage = Math.ceil(dailyNews.length / DAILY_SLIDER_SLIDES) || 1;
  const weeklyNewsTotalPage = Math.ceil(weeklyNews.length / WEEKLY_SLIDES_PER_SLIDE) || 1;

  const [dailyCurrSliderIdx, setDailyCurrSliderIdx] = useState(0);
  const [weeklyCurrSliderIdx, setWeeklyCurrSliderIdx] = useState(0);

  const changeCuratingPk = useCallback((id: number) => {
    dispatch(
      patchCuratingThunk('planetNews', id, () => {
        dailySliderRef.current.slickGoTo(0, true);
        weeklySliderRef.current.slickGoTo(0, true);
      })
    );
  }, []);

  const openNewsUrlPopup = () => {
    dispatch(
      pushPopup(NewsUrlPopup, {newspaper})
    );
  };

  const changeDailySlide = useCallback((_, nextSlide: number) => {
    setDailyCurrSliderIdx(nextSlide);
  }, []);

  const changeWeeklySlide = useCallback((_, nextSlide: number) => {
    setWeeklyCurrSliderIdx(nextSlide);
  }, []);

  const clickPrevOfWeeklySlider = useCallback(() => {
    const nextSlide = weeklyCurrSliderIdx - WEEKLY_SLIDES_PER_ROW
    weeklySliderRef.current.slickGoTo(nextSlide, true);
  }, [weeklyCurrSliderIdx]);

  const clickNextOfWeeklySlider = useCallback(() => {
    const nextSlide = weeklyCurrSliderIdx + WEEKLY_SLIDES_PER_ROW;
    weeklySliderRef.current.slickGoTo(nextSlide, true);
  }, [weeklyCurrSliderIdx]);

  const clickPrevOfDailySlider = useCallback(() => {
    const nextSlide = dailyCurrSliderIdx - DAILY_SLIDER_SLIDES;
    dailySliderRef.current.slickGoTo(nextSlide, true);
  }, [dailyCurrSliderIdx]);

  const clickNextOfDailySlider = useCallback(() => {
    const nextSlide = dailyCurrSliderIdx + DAILY_SLIDER_SLIDES;
    dailySliderRef.current.slickGoTo(nextSlide, true);
  }, [dailyCurrSliderIdx]);

  try {
    return (
      <MainNewsWrapper>
        <div className="title-news">
          <h2>
            플래닛 뉴스
            <span>
              신문사별로 뉴스를 선택해보세요!
            </span>
          </h2>
          <ul>
            {Object.values(newspaper).map(({
              id,
              name,
              avatar
            }) => (
              <PlanetNewsUrlCard
                key={id}
                id={id}
                name={name}
                logo={avatar}
                isSelected={id === curatingPk}
                onClick={changeCuratingPk}
              />
            ))}
            <li>
              <NewsUrlButton onClick={openNewsUrlPopup}/>
            </li>
          </ul>
        </div>
        <div className="today-news">
          <h2>오늘 뉴스</h2>
          <div className="current-wrapper">
            <span className="current no-select">
              {(dailyCurrSliderIdx / DAILY_SLIDER_SLIDES) + 1}
              &nbsp;&nbsp;/&nbsp;&nbsp;
              {dailyNewsTotalPage}
            </span>
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
              prevClickEvent={clickPrevOfDailySlider}
              nextClickEvent={clickNextOfDailySlider}
            />
          </div>
          {!isEmpty(dailyNews) ? (
            <DailyNewsSlider
              ref={dailySliderRef}
              {...dailySliderSettings}
              beforeChange={changeDailySlide}
            >
              {dailyNews.map(({
                id,
                url,
                title,
                description,
                image
              }) => {
                const newspaperName = newspaper[curatingPk]?.name;

                return (
                  <DailyNews
                    key={id}
                    url={url}
                    title={title}
                    newspaper={newspaperName}
                    description={description}
                    image={image}
                  />
                );
              })}
            </DailyNewsSlider>
          ) : (
            <NoContentText alt="오늘 뉴스가 없습니다.">
              <p>오늘 뉴스가 없습니다.</p>
            </NoContentText>
          )}
        </div>
        <div className="weekly-news">
          <h2>주간 뉴스</h2>
          <div className="current-wrapper">
            <span className="current no-select">
              {(weeklyCurrSliderIdx / WEEKLY_SLIDES_PER_ROW) + 1}
              &nbsp;&nbsp;/&nbsp;&nbsp;
              {weeklyNewsTotalPage}
            </span>
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
              prevClickEvent={clickPrevOfWeeklySlider}
              nextClickEvent={clickNextOfWeeklySlider}
            />
          </div>
          <WeeklyNewsSlider
            ref={weeklySliderRef}
            {...weeklySliderSettings}
            beforeChange={changeWeeklySlide}
          >
            {weeklyNews.map(({
              id,
              url,
              title,
              description,
              image
            }, index) => {
              const isMainNews = index % WEEKLY_SLIDER_ROWS === 0;
              const newspaperName = newspaper[curatingPk]?.name;
  
              return isMainNews ? (
                <MainWeeklyNews
                  key={id}
                  url={url}
                  title={title}
                  description={description}
                  image={image}
                  newspaper={newspaperName}
                />
              ) : (
                <SimpleWeeklyNews
                  key={id}
                  title={title}
                  url={url}
                  newspaper={newspaperName}
                />
              );
            })}
          </WeeklyNewsSlider>
        </div>
      </MainNewsWrapper>
    );
  } catch(e) {
    const cacheKey = curatingCacheKey('planetNews', curatingPk);
    LocalCache.del(cacheKey);
  }
};

export default React.memo(MainPlanetNews);
