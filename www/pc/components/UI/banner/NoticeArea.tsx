import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import Slider from 'react-slick';
import styled from 'styled-components';
import {$GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import Link from 'next/link';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import SimplePaginator from '../paginator/SimplePaginator';

const sliderSettings = {
  vertical: true,
  verticalSwiping: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
  speed: 500,
  autoplaySpeed: 5000,
};

const NoticeDiv = styled.div`
  width: 1125px;
  margin: 9px auto auto;
  position: relative;
  z-index: 2;
  padding-left: 100px;
  box-sizing: border-box;

  .notice-title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;

    h2 {
      display: inline-block;
      vertical-align: middle;
      padding-right: 5px;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
      })};
    }
  }
`;

const StyledSlider = styled(ReactCustomSlick)`
  z-index: 10;
`;

const StyledA = styled.a`
  ${fontStyleMixin({
  size: 12,
  color: $GRAY,
})}
`;

const StyledSimplePaginator = styled(SimplePaginator)`
  position: absolute;
  right: 14px;
  top: 3px;
`;

const NoticeArea = React.memo(({storyList}) => {
  const sliderRef = React.useRef<Slider>();

  return !isEmpty(storyList) && (
    <NoticeDiv>
      <div className="notice-title">
        <h2>공지사항</h2>
        <StyledSimplePaginator
          prevClickEvent={() => sliderRef.current.slickPrev()}
          nextClickEvent={() => sliderRef.current.slickNext()}
        />
      </div>
      <StyledSlider
        ref={sliderRef}
        {...sliderSettings}
      >
        {storyList.map(({id, title}) => (
          <Link
            key={`notice-${id}`}
            href="/story/[id]"
            as={`/story/${id}`}
          >
            <StyledA className="notice-text">
              {title}
            </StyledA>
          </Link>
        ))}
      </StyledSlider>
    </NoticeDiv>
  );
});

NoticeArea.displayName = 'NoticeArea';

export default NoticeArea;

