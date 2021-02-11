import React from 'react';
import styled from 'styled-components';
import {$WHITE, $TEXT_GRAY, $GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import WeeklyNews from './WeeklyNews';
import NewsUrlPopup from './NewsUrlPopup';
import {IPlanetNews} from '../../../src/reducers/main';
import {useDispatch} from 'react-redux';
import {patchCuratingThunk, curatingCacheKey} from '../../../src/reducers/main/thunk';
import {pushPopup} from '../../../src/reducers/popup';
import PrevButton from '../SliderButton/PrevButton';
import NextButton from '../SliderButton/NextButton';
import PlanetNewsUrlCard from './NewsUrlCard';
import NewsUrlButton from './NewsUrlButton';
import MainDailyNews from './MainDailyNews';
import SimpleDailyNews from './SimpleDailyNews';
import {LocalCache} from 'browser-cache-storage';
import isEmpty from 'lodash/isEmpty';
import NoContentText from '../../NoContent/NoContentText';

const MainNewsWrapper = styled.div`
  max-width: 680px;
  margin: 0 auto 8px;
  background-color: ${$WHITE};

  .title-news {
    position: relative;
    padding: 12px 15px 13px;
    box-sizing: border-box;

    h2 {
      letter-spacing: -0.4px;
      ${fontStyleMixin({
        size: 17,
        weight: '600',
      })};

      span {
        margin-left: 6px;
        ${fontStyleMixin({
          size: 13,
          color: '#999'
        })};
      }

      > button {
        float: right;

        img {
          width: 16px;
          vertical-align: middle;
        }
      }
    }
  }

  ul {
    display: table;
    table-layout: fixed;
    width: 100%;
    height: 80px;
    border-top: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  .today-news {
    position: relative;

    h2 {
      padding: 12px 15px 2px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })};
    }

    .no-content-text {
      padding-bottom: 30px;
    }
  }

  .weekly-news {
    position: relative;

    h2 {
      padding: 12px 15px 8px;
      border-top: 1px solid ${$BORDER_COLOR};
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })};
    }
  }

  .current-wrapper {
    padding: 3px 0 14px;
    text-align: center;

    button {
      img {
        width: 7px;
        vertical-align: middle;
        margin-top: -5px;
      }

      &.prev-btn {
        img {
          transform: rotate(180deg);
        }
      }
    }

    .current {
      margin: -5px 16px 0;
      vertical-align: middle;
      display: inline-block;
      ${fontStyleMixin({
        size: 12,
        family: 'Montserrat',
        weight: '300',
      })};
    }
  }
`;

const DailyNewsSlider = styled(ReactCustomSlick)`
  padding: 12px 15px 0;

  .today-slide-content {
    div {
      box-sizing: border-box;
    }

    > div {
      display: inline-block;
      vertical-align: top;

      &.left-headline {
        width: 730px;
  
        div {
          width: calc(100% - 280px);
          padding: 0 32px 0 18px;
          display: inline-block;
          vertical-align: top;
        }
      }
    }

    h2 {
      ${fontStyleMixin({
        size: 18,
        weight: '600'
      })};
    }

    span {
      ${fontStyleMixin({
        size: 13,
        weight: '600',
        color: $TEXT_GRAY
      })};
    }

    p {
      width: 100%;
      height: 8.5em;
      line-height: 1.7;
      margin-top: 9px;
      word-wrap: break-word;
      white-space: pre-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      ${fontStyleMixin({
        size: 14,
        color: $GRAY
      })};
    }
  }
`;

const WeeklyNewsSlider = styled(ReactCustomSlick)`
  margin-bottom: 10px;
`;

const DAILY_SLIDE_ROWS = 3;

const dailySliderSettings = {
  autoplay: false,
  slidesToShow: 1,
  draggable: false,
  arrows: false,
  infinite: false,
  rows: DAILY_SLIDE_ROWS,
  slidesPerRow: 1
};

const WEEKLY_SLIDE_ROWS = 5;

const weeklySliderSettings = {
  autoplay: false,
  slidesToShow: 1,
  draggable: false,
  arrows: false,
  infinite: false,
  rows: WEEKLY_SLIDE_ROWS,
  slidePerRow: 1
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

  const dailySliderRef = React.useRef(null);
  const weeklySliderRef = React.useRef(null);

  const dailyNewsTotalPage = Math.ceil(dailyNews.length / DAILY_SLIDE_ROWS) || 1;
  const weeklyNewsTotalPage = Math.ceil(weeklyNews.length / WEEKLY_SLIDE_ROWS) || 1;

  const [dailyCurrSliderIdx, setDailyCurrSliderIdx] = React.useState(0);
  const [weeklyCurrSliderIdx, setWeeklyCurrSliderIdx] = React.useState(0);

  const changeCuratingPk = React.useCallback((id: number) => {
    dispatch(
      patchCuratingThunk('planetNews', id, () => {
        dailySliderRef.current.slickGoTo(0, true);
        weeklySliderRef.current.slickGoTo(0, true);
      })
    );
  }, []);

  const openNewsUrlPopup = React.useCallback(() => {
    dispatch(
      pushPopup(NewsUrlPopup, {newspaper})
    );
  }, [newspaper]);

  const changeDailySlide = React.useCallback((_, nextSlide: number) => {
    setDailyCurrSliderIdx(nextSlide);
  }, []);

  const changeWeeklySlide = React.useCallback((_, nextSlide: number) => {
    setWeeklyCurrSliderIdx(nextSlide);
  }, []);

  try {
    return (
      <MainNewsWrapper>
        <div className="title-news">
          <h2>
            플래닛 뉴스
            <span>
              신문사별로 선택해보세요!
            </span>
            <NewsUrlButton onClick={openNewsUrlPopup}/>
          </h2>
        </div>
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
        </ul>
        <div className="today-news">
          <h2>오늘 뉴스</h2>
          {!isEmpty(dailyNews) ? (
            <>
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
                }, index) => {
                  const isMainNews = index % DAILY_SLIDE_ROWS === 0;
                  const newspaperName = newspaper[curatingPk]?.name;
      
                  return (
                    isMainNews ? (
                      <MainDailyNews
                        key={id}
                        url={url}
                        title={title}
                        newspaper={newspaperName}
                        description={description}
                        image={image}
                      />
                    ) : (
                      <SimpleDailyNews
                        key={id}
                        url={url}
                        title={title}
                        newspaper={newspaperName}
                      />
                    )
                  );
                })}
              </DailyNewsSlider>
              <div className="current-wrapper">
                <PrevButton onClick={() => dailySliderRef.current.slickPrev()}/>
                <span className="current no-select">
                  {dailyCurrSliderIdx + 1}&nbsp;/&nbsp;{dailyNewsTotalPage}
                </span>
                <NextButton onClick={() => dailySliderRef.current.slickNext()}/>
              </div>
            </>
          ) : (
            <NoContentText
              alt="오늘 뉴스가 없습니다."
              className="no-content-text"
            >
              <p>오늘 뉴스가 없습니다.</p>
            </NoContentText>
          )}
        </div>
        <div className="weekly-news">
          <h2>주간 뉴스</h2>
          <WeeklyNewsSlider
            ref={weeklySliderRef}
            {...weeklySliderSettings}
            beforeChange={changeWeeklySlide}
          >
            {weeklyNews.map(({title, url}, index) => {
              const newspaperName = newspaper[curatingPk]?.name;

              return (
                <WeeklyNews
                  key={`${title}-${url}-${index}`}
                  title={title}
                  url={url}
                  newspaper={newspaperName}
                />
              );
            })}
          </WeeklyNewsSlider>
          <div className="current-wrapper">
            <PrevButton onClick={() => weeklySliderRef.current.slickPrev()}/>
            <span className="current no-select">
              {weeklyCurrSliderIdx + 1}&nbsp;/&nbsp;{weeklyNewsTotalPage}
            </span>
            <NextButton onClick={() => weeklySliderRef.current.slickNext()}/>
          </div>
        </div>
      </MainNewsWrapper>
    );
  } catch(e) {
    const cacheKey = curatingCacheKey('planetNews', curatingPk);
    LocalCache.del(cacheKey);
  }
};

export default React.memo(MainPlanetNews);
