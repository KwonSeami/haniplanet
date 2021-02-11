import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import queryString from 'query-string';
import {useRouter} from 'next/router';
import {CardMenuLi, CardMenuUl, SubMenuLi, SubMenuUl} from '../common/Menu';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import {axiosInstance} from '@hanii/planet-apis';
import {shallowEqual, useSelector} from 'react-redux';
import {TAG_ON_MAP, TAGS} from '../../pages/modunawa';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import ReactCustomSlick from '../common/ReactCustomSlick';
import {backgroundImgMixin} from '../../styles/mixins.styles';

const StyledSlider = styled(ReactCustomSlick)`
  margin: 30px 0 0;

  &.on {
    .slick-list {
      padding-left: 57px;
      transition: 0.2s all;
    }
  }
  
  .slick-list {
    transition: 0.2s all;
  }

  .slick-track {
    white-space: nowrap;
  }
  
  .slick-slide {
    width: 158px;
    padding-right: 6px;

    &:last-child {
      padding-right: 0;
    }
  }
  
  &.show-arrow {
    .slick-arrow {
      width: 28px;
      height: 28px;
  
      &::before {
        display: none;
      }
  
      &.slick-prev {
        left: -42px;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/arrow/icon-slider-prev.png')
        })};
      }
  
      &.slick-next {
        right: -42px;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/arrow/icon-slider-next.png')
        })};
      }
    }
  }
  &.hide-prev {
    .slick-arrow {
      &::before {
        display: none;
      }
      &.slick-prev {
        width: 0 !important;
      }
      &.slick-next {
        width: 28px;
        height: 28px;
        right: -42px;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/arrow/icon-slider-next.png')
        })};
      }
    }
  }
  
  &.hide-next {
    .slick-arrow {
      &::before {
        display: none;
      }
  
      &.slick-prev {
        width: 28px;
        height: 28px;
        left: -42px;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/arrow/icon-slider-prev.png')
        })};
      }
  
      &.slick-next {
        width: 0;
      }
    }
  } 
`;

const tagBgImg = {
  '소모품/의료기기': staticUrl('/static/images/banner/img-modunawa-goods.jpg'),
  '원외탕전': staticUrl('/static/images/banner/img-modunawa-extract.jpg'),
  '원외탕전 약속상품': staticUrl('/static/images/banner/img-modunawa-promise.jpg'),
  '한약재 회사': staticUrl('/static/images/banner/img-modunawa-company.jpg'),
  '한약제제': staticUrl('/static/images/banner/img-modunawa-manufactured.jpg'),
  '인테리어': staticUrl('/static/images/banner/img-modunawa-interior.jpg'),
  '한의학 도서': staticUrl('/static/images/banner/img-modunawa-book.jpg'),
  '세무기장': staticUrl('/static/images/banner/img-modunawa-tax.jpg'),
  '기타': staticUrl('/static/images/banner/img-modunawa-etc.jpg'),
}

const SLIDE_TO_SHOW = 6;

const ModunawaMenu = () => {
  const sliderRef = React.useRef(null);
  const {query: {tag: _tagQuery, order_by: _orderByQuery}} = useRouter();
  const focusIndex = Object.keys(TAGS).findIndex(curr => TAG_ON_MAP[_tagQuery] === curr || 0);
  const TAG_LENGTH = Object.keys(TAGS).length + 1;
  const LEFTOVER_MENU = TAG_LENGTH % SLIDE_TO_SHOW;

  const [currIdx, setCurrIdx] = React.useState (focusIndex > LEFTOVER_MENU ? LEFTOVER_MENU : focusIndex);
  const [tagCount, setTagCount] = React.useState([]);
  const token = useSelector(
    ({system: {session: {access}}}) => access,
    shallowEqual,
  );

  React.useEffect(() => {
    axiosInstance({baseURL: BASE_URL, token}).get('/price-comparison/count/')
      .then(({status, data: {results}}) => {
        if (status === 200) {
          setTagCount(
            results.reduce((prev, {name, stories_count}) => ({
              ...prev,
              [name]: stories_count,
            }), {})
          );
        }
      });
  }, [token]);

  const activeTab = TAGS[TAG_ON_MAP[_tagQuery as string]] || [];

  const sliderSettings = {
    className: 'modunawa-menu',
    speed: 300,
    arrows: true,
    slidesToScroll: ((TAG_LENGTH - (currIdx + SLIDE_TO_SHOW)) > SLIDE_TO_SHOW
        ? SLIDE_TO_SHOW
        : TAG_LENGTH - currIdx
    ),
    slidesToShow: SLIDE_TO_SHOW,
    variableWidth: true,
    infinite: false,
    focusOnSelect: true,
    outerEdgeLimit: false,
    draggable: false,
    afterChange: current => setCurrIdx(current),
  };

  return (
    <>
      <CardMenuUl>
        <StyledSlider
          {...sliderSettings}
          ref={sliderRef}
          initialSlide={currIdx}
          className={cn({
            'on': currIdx > 3,
            'hide-prev': currIdx < 1,
            'hide-next': currIdx > (LEFTOVER_MENU - 1),
            'show-arrow': (!currIdx || currIdx > 0) && (LEFTOVER_MENU > currIdx)
          })}
        >
          <CardMenuLi
            key="전체"
            on={!_tagQuery}
            className={cn({on: !_tagQuery})}
          >
            <Link
              as="/modunawa"
              href="/modunawa"
              passHref
              replace
            >
              <a>
                <b>전체</b>
                <span>{tagCount['전체']}</span>
              </a>
            </Link>
          </CardMenuLi>
          {Object.keys(TAGS).map((tagName) => {
            const subTag = TAGS[tagName];
  
            const on = tagName === _tagQuery || subTag.includes(_tagQuery);
            const query = queryString.stringify({
              tag: tagName
            });
  
            return (
              <CardMenuLi
                key={tagName}
                on={on}
                bgImg={tagBgImg[tagName]}
                className={cn('map-slide',{on})}
              >
                <Link
                  as={`/modunawa?${query}`}
                  href={`/modunawa?${query}`}
                  passHref
                  replace
                >
                  <a>
                    <b>{tagName}</b>
                    <span>{tagCount[tagName] || 0}</span>
                  </a>
                </Link>
              </CardMenuLi>
            );
          })}
        </StyledSlider>
      </CardMenuUl>
      {!isEmpty(activeTab) && (
        <SubMenuUl>
          {activeTab.map(tagName => {
            const on = tagName === _tagQuery;
            const query = queryString.stringify({
              tag: tagName,
              order_by: _orderByQuery
            });

            return (
              <SubMenuLi
                key={tagName}
                on={on}
                className={cn({on})}
              >
                <Link
                  as={`/modunawa?${query}`}
                  href={`/modunawa?${query}`}
                  passHref
                  replace
                >
                  <a>
                    <b>{tagName}</b>
                    <span>{tagCount[tagName]}</span>
                  </a>
                </Link>
              </SubMenuLi>
            );
          })}
        </SubMenuUl>
      )}
    </>
  );
};

export default React.memo(ModunawaMenu);