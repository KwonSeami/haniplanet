import React, {useState, useCallback, useRef} from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import RepresentArticle from './RepresentArticle';
import SideArticle from './SideArticle';
import SimplePaginator from '../../UI/paginator/SimplePaginator';
import {IPlanetHospitalStory} from '../../../src/reducers/main';
import HospitalStoryTag from './HospitalStoryTag';
import {useDispatch} from 'react-redux';
import {patchCuratingThunk, curatingCacheKey} from '../../../src/reducers/main/thunk';
import Link from 'next/link';
import {LocalCache} from 'browser-cache-storage';

const MainHospitalWrapper = styled.div`
  position: relative;
  max-width: 1090px;
  margin: 24px auto 0;

  > div.title-hospital {
    position: relative;
    margin: 40px 0 14px;
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

    a {
      position: absolute;
      top: 27px;
      right: -5px;
      text-decoration: underline;
      ${fontStyleMixin({
        size: 14,
      })};
  
      img {
        width: 13px;
        margin-top: -2px;
        transform: rotate(270deg);
      }
    }
  }

  ul.category-tab {
    margin-bottom: 20px;
    text-align: center;
  }

  .current-wrapper {
    position: absolute;
    z-index: 1;
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

const HospitalStorySlider = styled(ReactCustomSlick)`
  height: 352px;

  .slick-track { //아이템들 세로중앙정렬을 위한 스타일
    display: flex;
    align-items: center;
  }
`;

interface Props {
  data: IPlanetHospitalStory;
}

const SLIDES_TO_SHOW = 4;

const hospitalSliderSettings = {
  autoplay: false,
  slidesToScroll: SLIDES_TO_SHOW,
  slidesToShow: SLIDES_TO_SHOW,
  draggable: false,
  arrows: false,
  infinite: false,
  variableWidth: true
};

const MainHospitalStory: React.FC<Props> = ({data}) => {
  const dispatch = useDispatch();

  const [currSliderIdx, setCurrSliderIdx] = useState(0);

  const sliderRef = useRef(null);

  const changeCuratingPk = useCallback((id: number) => {
    dispatch(
      patchCuratingThunk('hospitalStory', id, () => {
        sliderRef.current.slickGoTo(0, true);
      })
    );
  }, []);

  const changeSlide = useCallback((_, nextSlide: number) => {
    const currSliderIdx = nextSlide / SLIDES_TO_SHOW;
    setCurrSliderIdx(currSliderIdx);
  }, []);

  const handleClickPrev = useCallback(() => {
    // 첫 페이지일 때 nextSlide 0으로 고정
    const nextSlide = ((currSliderIdx || 1) - 1) * SLIDES_TO_SHOW;
    sliderRef.current.slickGoTo(nextSlide, true);
  }, [currSliderIdx]);

  const handleClickNext = useCallback(() => {
    const nextSlide = (currSliderIdx + 1) * SLIDES_TO_SHOW;
    sliderRef.current.slickGoTo(nextSlide, true);
  }, [currSliderIdx]);

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
              한의플래닛에서 선정한 한의지식 라이브러리
            </span>
          </h2>
          <Link
            href="/hospital"
          >
            <a>
              더 많은 한의원 보기
              <img
                src={staticUrl('/static/images/icon/arrow/icon-btn-down.png')}
                alt="한의원 페이지로 이동"
              />
            </a>
          </Link>
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
        <div className="current-wrapper">
          <span className="current no-select">
            {currSliderIdx + 1}&nbsp;&nbsp;/&nbsp;&nbsp;{totalPage}
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
            prevClickEvent={handleClickPrev}
            nextClickEvent={handleClickNext}
          />
        </div>
        <HospitalStorySlider
          ref={sliderRef}
          {...hospitalSliderSettings}
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
      </MainHospitalWrapper>
    );
  } catch(e) {
    const cacheKey = curatingCacheKey('hospitalStory', curatingPk);
    LocalCache.del(cacheKey);
  }
};

export default React.memo(MainHospitalStory);
