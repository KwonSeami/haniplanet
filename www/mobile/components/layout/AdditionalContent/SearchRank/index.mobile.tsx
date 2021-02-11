import * as React from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import ReactCustomSlick from '../../../common/ReactCustomSlick';
import SearchApi from '../../../../src/apis/SearchApi';
import useSaveApiResult from '../../../../src/hooks/useSaveApiResult';
import {staticUrl} from '../../../../src/constants/env';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE} from '../../../../styles/variables.types';

const sldierSettings = {
  vertical: true,
  verticalSwiping: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
  speed: 500,
  autoplaySpeed: 2000
};

const Div = styled.div`
  position: relative;
  z-index: 1;
  padding: 6px 0 0 92px;
`;

const H2 = styled.h2`
  position: absolute;
  left: 14px;
  top: 8px;
  ${fontStyleMixin({
    size: 12, 
    weight: 'bold'
  })};

  &::after {
    content: '';
    position: absolute;
    right: -11px;
    top: 3px;
    width: 1px;
    height: 10px;
    background-color: ${$BORDER_COLOR};
  }
`;

const StyledLink = styled.a`
  display: block;
  position: relative;
  padding: 0 35px 0 6px;
  width: 100%;
  box-sizing: border-box;
  ${fontStyleMixin({
    size: 12, 
    color: $POINT_BLUE,
    weight: 'bold'
  })};

  span {
    display: inline-block;
    vertical-align: middle;
    margin-top: -3px;
    padding-right: 6px;
    ${fontStyleMixin({
      size: 12, 
      family: 'Montserrat',
      weight: '600'
    })};
  }
`;

const Img = styled.img`
  width: 12px;
  display: inline-block !important;
  vertical-align: middle;
  margin: -3px 0 0 5px;

  @media screen and (max-width: 680px) {
    position: absolute;
    right: 14px;
    top: 1px;
    margin: 0;
  }
`;

const SearchRankMobile = React.memo(() => {
  const sliderRef = React.useRef<Slider>();
  const {resData: ranks} = useSaveApiResult(() => new SearchApi().rank());

  return !isEmpty(ranks) ? (
    <Div>
      <H2>인기 검색어</H2>
      <ReactCustomSlick
        ref={sliderRef}
        {...sldierSettings}
      >
        {ranks.map(({keyword}, order) => (
          <Link
            key={`search-rank--${keyword}`}
            href={`/search?q=${keyword}`}
          >
            <StyledLink className="ellipsis">
              <span>{order + 1}</span>
              {keyword}
              <Img
                src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png')}
                alt="인기검색어 더보기"
              />
            </StyledLink>
          </Link>
        ))}
      </ReactCustomSlick>
    </Div>
  ) : null;
});

export default SearchRankMobile;
