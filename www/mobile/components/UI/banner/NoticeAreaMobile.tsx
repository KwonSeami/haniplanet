import * as React from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import {$BORDER_COLOR, $GRAY, $WHITE} from '../../../styles/variables.types';

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

const Notice = styled.div`
  width: 100%;
  padding: 7px 15px 7px 66px;
  position: relative;
  box-sizing: border-box;
  background-color: ${$WHITE};
  border-bottom: 1px solid ${$BORDER_COLOR};

  @media screen and (max-width: 500px) {
    padding-left: 37px;
    border-bottom: 0;
    box-shadow: 0 2px 3px 0 rgba(153, 153, 153, 0.2);
  }

  .slide-width {
    width: 2000px;
  }
`;

const H2 = styled.h2`
  position: absolute;
  left: 14px;
  top: 9px;

  span {
    display: block;
    ${fontStyleMixin({
      size: 12,
      weight: 'bold',
    })};
  }

  img {
    width: 20px;
    display: none;
  }

  @media screen and (max-width: 500px) {
    top: 8px;
    
    span {
      display: none;
    }

    img {
      display: inline-block !important;
    }
  }
`;

const StyledA = styled.a`
  ${fontStyleMixin({
    size: 12,
    color: $GRAY,
  })};
`;

const NoticeAreaMobile = React.memo(({storyList}) => {
  const sliderRef = React.useRef<Slider>();

  return !isEmpty(storyList) && (
    <Notice>
      <H2>
        <span>공지사항</span>
        <img
          src={staticUrl('/static/images/icon/icon-mini-notice.png')}
          alt="공지사항"
        />
      </H2>
      <div className="slide-width">
        <ReactCustomSlick
          ref={sliderRef}
          {...sliderSettings}
        >
          {storyList.map(({id, title}) => (
            <Link
              key={id}
              href="/story/[id]"
              as={`/story/${id}`}
            >
              <StyledA className="notice-text">
                {title}
              </StyledA>
            </Link>
          ))}
        </ReactCustomSlick>
      </div>
    </Notice>
  );
});

export default NoticeAreaMobile;
