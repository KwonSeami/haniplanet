import * as React from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import A from '../A';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR} from '../../../styles/variables.types';

interface ImageProps {
  src: string;
  textBox?: boolean;
}

const StyledSlider = styled(ReactCustomSlick)`
  margin-top: -26px;

  .slick-slide {
    visibility: hidden;
  }

  .slick-slide.slick-active {
    visibility: visible;
  }

  .slick-dots {
    bottom: 50%;
    right: 50%;
    width: auto;
    margin: 0 -340px -10px 0;

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
  
  @media screen and (max-width: 640px) {
    .slick-dots {
      right: 10px;
      margin-right: 0;
    }
  }
  
  @media screen and (max-width: 500px) {
    .slick-dots {
      margin-bottom: -20px;
    }
  }
`;

const Div = styled.div<{ bg_code: string }>`
  width: 100%;
  height: 212px;
  box-sizing: border-box;
  padding: 60px 0 57px;
  background-color: ${({bg_code}) => `#${bg_code}`};

  ul {
    width: 582px;
    margin: auto;
    box-sizing: border-box;
    text-align: center;

    li {
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      width: 82px;

      &.text-box {
        padding-left: 18px;
        width: calc(100% - 82px);
        text-align: left;

        a {
          display: block;
          padding-top: 12px;
          ${fontStyleMixin({
            size: 10,
            weight: 'bold',
          })};
        }
      }

      h2 {
        ${fontStyleMixin({
          size: 19,
          weight: '300',
        })};
        

        span {
          display: block;
          padding-bottom: 5px;
          ${fontStyleMixin({
            size: 11,
            weight: 'bold',
          })};
        }
      }
    }
  }

  @media screen and (max-width: 640px) {
    ul {
      width: 420px;

      li {
        width: 74px;

        &.text-box {
          width: calc(100% - 74px);
          padding-left: 16px;
        }

        h2{
          font-size: 18px;

          span {
            font-size: 10px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 500px) {
    height: auto;

    ul {
      width: 100%;
      padding: 0 20px;
    }
  }
`;

const BannerImg = styled.img<ImageProps>`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  ${({src}) => backgroundImgMixin({
    img: src
  })}

  @media screen and (max-width: 640px) {
    width: 74px;
    height: 74px;
  }
`;

const LinkImg = styled.img`
  display: block;
  margin-top: -2px;
  width: 58px;
`;

const sliderSettings = {
  className: 'banner-slider',
  autoplay: true,
  autoplaySpeed: 4000,
  fade: true,
  speed: 500,
  slidesToScroll: 1,
  slidesToShow: 1,
  arrows: false,
  dots: true,
};

interface Props {
  topBanner: ITopBanner[];
  className?: string;
}

const BannerSliderMobile = React.memo<Props>(({topBanner, className}) => {
  return !isEmpty(topBanner) ? (
    <StyledSlider
      {...sliderSettings}
      className={className}
    >
      {topBanner.map(({avatar, title, description, bg_code, url}) => (
        <Div
          key={avatar}
          bg_code={bg_code}
        >
          <ul>
            <li>
              <BannerImg
                key={avatar}
                src={avatar}
              />
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
        </Div>
      ))}
    </StyledSlider>
  ) : null;
});

export default BannerSliderMobile;
