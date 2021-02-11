import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import A from "../A";
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {$BORDER_COLOR, $FONT_COLOR} from '../../../styles/variables.types';

const StyledSlider = styled(ReactCustomSlick)`
  margin-top: -29px;

  .slick-slide {
    visibility: hidden;
  }

  .slick-slide.slick-active {
    visibility: visible;
  }

  .slick-dots {
    top: 50%;
    right: 50%;
    width: 10px;
    height: 10px;
    margin: -210px -460px 0 0;
    transform: rotate(-90deg);

    li {
      display: block;
      width: 4px;
      height: 4px;
      margin: 4px 0;

      button {
        width: 4px;
        height: 4px;
        background-color: ${$BORDER_COLOR};
        padding: 0;
        border-radius: 50%;

        &:before {
          display: none;
        }
      }

      &.slick-active button {
        background-color: ${$FONT_COLOR};
      }
    }
  }

  .slick-arrow {
    top: 140px;
    width: 30px;
    height: 75px;
    z-index: 1;

    &::before {
      display: none;
    }

    &.slick-prev {
      left: 50%;
      margin-left: -550px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/icon-banner-prev.png')
      })}
    }

    &.slick-next {
      right: 50%;
      margin-right: -550px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/icon-banner-next.png')
      })}
    }
  }

  @media screen and (max-width: 1125px) {
    .slick-prev {
      left: 10px !important;
      margin: 0 !important;
    }
  }
`;

const Div = styled.div<{ bg_code: string } & ImageProps>`
  width: 100%;
  height: 530px;
  box-sizing: border-box;
  padding-top: 78px;
  background-color: ${({bg_code}) => `#${bg_code}`};

  & > .wrapper {
    width: 1125px !important;
    margin: auto;
    box-sizing: border-box;
    height: 220px;
    text-align: left;

    ul {
      margin-left: 281px;  
    
      li {
        display: inline-block;
        vertical-align: middle;
  
        .banner-avatar {
          width: 128px;
          height: 128px;
          ${({src}) => backgroundImgMixin({
            img: src
          })}
        }
  
        &.text-box {
          padding-left: 10px;
          text-align: left;
  
          a {
            display: block;
            padding-top: 23px;
            ${fontStyleMixin({
              size: 12,
              weight: 'bold',
            })};
          }
        }
  
        h2 {
          ${fontStyleMixin({
            size: 23,
            weight: '300',
          })};
  
          span {
            display: block;
            padding-bottom: 5px;
            ${fontStyleMixin({
              size: 12,
              weight: 'bold'
            })};
          }
        }
      }
    }    
  }
`;

const LinkImg = styled.img`
  display: block;
  width: 76px;
`;

const sliderSettings = {
  className: 'banner-slider',
  autoplay: true,
  autoplaySpeed: 4000,
  fade: true,
  speed: 500,
  slidesToScroll: 1,
  slidesToShow: 1,
  dots: true
};

interface Props {
  topBanner: ITopBanner[];
  className?: string;
}

interface ImageProps {
  src: string;
}

const BannerSliderPC = React.memo<Props>(({topBanner, className}) => 
  !isEmpty(topBanner) ? (
    <StyledSlider
      {...sliderSettings}
      className={className}
    >
      {topBanner.map(({avatar, title, description, bg_code, url}) => (
        <Div
          key={url}
          bg_code={bg_code}
          src={avatar}
        >
          <div className="wrapper">
            <ul key={title}>
              <li>
                <div className="banner-avatar"/>
              </li>
              <li className="text-box">
                <h2>
                  <span>{description}</span>
                  {title}
                </h2>
                {url && (
                  <A to={url}>
                    바로가기
                    <LinkImg
                      src={staticUrl('/static/images/icon/arrow/icon-shortcuts.png')}
                      alt="바로가기"
                    />
                  </A>
                )}
              </li>
            </ul>
          </div>
        </Div>
      ))}
    </StyledSlider>
  ) : null
);

BannerSliderPC.displayName = 'BannerSliderPC';
export default BannerSliderPC;
