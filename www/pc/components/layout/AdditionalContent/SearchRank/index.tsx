import * as React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import AdditionalContentItemPC from '../AdditionalContentItem/AdditionalContentItemPC';
import SearchRankItem from './SearchRankItem';
import SearchApi from '../../../../src/apis/SearchApi';
import useSaveApiResult from '../../../../src/hooks/useSaveApiResult';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {
  $BORDER_COLOR,
  $FONT_COLOR,
  $POINT_BLUE,
  $TEXT_GRAY
} from '../../../../styles/variables.types';
import lazyRenderHOC from '../../../../hocs/lazyRenderHOC';
import {SECOND} from '../../../../src/constants/times';
import ReactCustomSlick from '../../../common/ReactCustomSlick';
import SimplePaginator from '../../../UI/paginator/SimplePaginator';

const SLIDE_TO_SCROLL = 5;

const sldierSettings = {
  autoplay: true,
  autoplaySpeed: 10000,
  slidesToScroll: SLIDE_TO_SCROLL,
  slidesToShow: SLIDE_TO_SCROLL,
  speed: 500,
  vertical: true,
  arrows: false
};

const StyledAdditionalContentItemPC = styled(AdditionalContentItemPC)`
  .slick-slider {
    margin-top: 18px;
    /* margin-top: 17px; */
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  .slick-vertical .slick-slide {
    border-top: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    &:hover {
      border: 1px solid ${$POINT_BLUE};
    }
  }
`;

const Span = styled.span<{
  on?: boolean;
  after?: boolean;
}>`
  display: block;
  padding-left: 18px;
  ${fontStyleMixin({
    size: 12,
    weight: '600',
    color: $TEXT_GRAY,
    family: 'Montserrat'
  })}

  ${props => props.after && `
    &::after {
      content: '/';
      position: absolute;
      right: -12px;
      top: 1px;
      ${fontStyleMixin({
        size: 8,
        weight: 'bold',
        color: $TEXT_GRAY
      })}
    }
  `}

  ${props => props.on && `
    color: ${$FONT_COLOR};
    text-decoration: underline;
  `}
`;

const SearchRank = React.memo(() => {
  const sliderRef = React.useRef<Slider>();
  const {resData: ranks} = useSaveApiResult(() => new SearchApi().rank());
  const [currSliderIdx, setCurrSliderIdx] = React.useState(0);

  return (
    <StyledAdditionalContentItemPC
      title="인기 검색어"
      titleRightComp={
        <SimplePaginator
          content={{
            left: (
              <Span on={currSliderIdx === 0} after>
                01 - 05
              </Span>
            ),
            right: (
              <Span on={currSliderIdx === SLIDE_TO_SCROLL}>
                06 - 10
              </Span>
            )
          }}
          prevClickEvent={() => sliderRef.current.slickGoTo(0)}
          nextClickEvent={() => sliderRef.current.slickGoTo(5)}
        />
      }
    >
      <ReactCustomSlick
        ref={sliderRef}
        beforeChange={(_, next) => setCurrSliderIdx(next)}
        {...sldierSettings}
      >
        {(ranks || [{}]).map(({keyword}, order) => (
          <SearchRankItem
            key={`search-rank-${keyword}`}
            rankItem={keyword}
            rankIndex={order + 1}
          />
        ))}
      </ReactCustomSlick>
    </StyledAdditionalContentItemPC>
  );
});

export default lazyRenderHOC(SearchRank, 1.3 * SECOND);
