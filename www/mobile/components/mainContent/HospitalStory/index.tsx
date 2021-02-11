import React from 'react';
import styled from 'styled-components';
import {$WHITE, $GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import Button from '../../inputs/Button';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import RepresentArticle from './RepresentArticle';
import SideArticle from './SideArticle';
import {IPlanetHospitalStory} from '../../../src/reducers/main';
import {useDispatch} from 'react-redux';
import {patchCuratingThunk, curatingCacheKey} from '../../../src/reducers/main/thunk';
import HospitalStoryTag from './HospitalStoryTag';
import PrevButton from '../SliderButton/PrevButton';
import NextButton from '../SliderButton/NextButton';
import Router from 'next/router';
import {LocalCache} from 'browser-cache-storage';

const MainHospitalWrapper = styled.div`
  position: relative;
  max-width: 680px;
  margin: 0 auto;
  background-color: ${$WHITE};

  > div.title-hospital {
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
    }

    .button {
      margin-top: 15px;

      img {
        width: 18px;
        margin: -3px 0 0 3px;
        vertical-align: middle;
      }
    }
  }

  ul.category-tab {
    padding: 10px 15px;
    background-color: #f6f7f9;
    overflow-x: auto;
    white-space: nowrap;
  }

  .current-wrapper {
    padding: 14px 0;
    text-align: center;

    button {
      img {
        width: 7px;
        vertical-align: middle;
        margin-top: -4px;
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

const HospitalStorySlider = styled(ReactCustomSlick)`
  padding: 0 15px;
`;

const SLIDES_TO_SHOW = 3;

const hospitalSliderSettings = {
  autoplay: false,
  slidesToShow: 1,
  draggable: false,
  arrows: false,
  infinite: false,
  rows: 3,
  slidesPerRow: 1
};

interface Props {
  data: IPlanetHospitalStory;
}

const MainHospitalStory: React.FC<Props> = ({data}) => {
  const dispatch = useDispatch();

  const [currSliderIdx, setCurrSliderIdx] = React.useState(0);

  const sliderRef = React.useRef(null);

  const changeCuratingPk = React.useCallback((id: number) => {
    dispatch(
      patchCuratingThunk('hospitalStory', id, () => {
        sliderRef.current.slickGoTo(0, true);
      })
    );
  }, []);

  const changeSlide = React.useCallback((_, nextSlide: number) => {
    setCurrSliderIdx(nextSlide);
  }, []);

  const {
    curatingPk,
    tags,
    stories = []
  } = data;
  const totalPage = Math.ceil(stories.length / SLIDES_TO_SHOW);

  try {
    return (
      <MainHospitalWrapper>
        <div className="title-hospital">
          <h2>
            한의원 스토리
            <span>
              특별한 한의원/한의사를 만나보세요
            </span>
          </h2>
          <Button
            size={{
              width: '100%',
              height: '44px'
            }}
            border={{
              width: '1px',
              radius: '3px',
              color: $BORDER_COLOR,
            }}
            font={{
              size: '14px',
              color: $GRAY,
            }}
            onClick={() => Router.push('/hospital')}
          >
            더 많은 한의원 보기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-main-more.png')}
              alt="화살표"
            />
          </Button>
        </div>
        <ul className="category-tab">
          {Object.values(tags).map(({id, name}) => (
            <HospitalStoryTag
              key={id}
              id={id}
              name={name}
              isHighlighted={curatingPk === id}
              onClick={changeCuratingPk}
            />
          ))}
        </ul>
        <HospitalStorySlider
          {...hospitalSliderSettings}
          ref={sliderRef}
          beforeChange={changeSlide}
        >
          {stories.map(({
            id,
            title,
            url,
            description,
            image,
            user
          }, index) => (
            index % SLIDES_TO_SHOW === 0 ? (
              <RepresentArticle
                key={id}
                title={title}
                user={user}
                description={description}
                image={image}
                url={url}
              />
            ) : (
              <SideArticle
                key={id}
                title={title}
                user={user}
                description={description}
                image={image}
                url={url}
              />
            )
          ))}
        </HospitalStorySlider>
        <div className="current-wrapper">
          <PrevButton onClick={() => sliderRef.current.slickPrev()}/>
          <span className="current no-select">
            {currSliderIdx + 1}&nbsp;/&nbsp;{totalPage}
          </span>
          <NextButton onClick={() => sliderRef.current.slickNext()}/>
        </div>
      </MainHospitalWrapper>
    );
  } catch(e) {
    const cacheKey = curatingCacheKey('hospitalStory', curatingPk);
    LocalCache.del(cacheKey);
  }
};

export default React.memo(MainHospitalStory);
