import * as React from 'react';
import styled from 'styled-components';
import FooterPC from '../footer/FooterPC';
import BannerApi from "../../../src/apis/BannerApi";
import {SECOND} from "../../../src/constants/times";
import {$BORDER_COLOR, $FONT_COLOR} from '../../../styles/variables.types';
import isEmpty from 'lodash/isEmpty';
import A from '../../UI/A';
import ReactCustomSlick from '../../common/ReactCustomSlick';

const StyledSlider = styled(ReactCustomSlick)`
  
  margin-top: 25px;

  &.slick-slide {
    visibility: hidden;
  }

  .slick-slide.slick-active {
    visibility: visible;
  }
  
  .slick-arrow {
    visibility: hidden;
  }
  
  .slick-dots {
    left: 50%;
    bottom: 20px;
    transform: translate(-50%);
    font-size: 0;
    
    li {
      display: inline-block;
      margin: 0 3px;
      width: auto;
      height: auto;

      button {
        width: 6px;
        height: 6px;
        background-color: ${$BORDER_COLOR};
        padding: 0;
        border-radius: 50%;

        &::before {
          display: none;
        }
      }

      &.slick-active button {
        background-color: ${$FONT_COLOR};
      }
    }
  }

  .right-ad-banner {
    position: relative;
    z-index: 2;
  }
`;

const Section = styled.section`
  float: right;
  width: 320px;

  .input-margin {
    margin-bottom: 30px;
  }
`;

interface Props {
  hideAdArea?: boolean;
  hideFooter?: boolean;
  children?: React.ReactNode | React.ComponentType;
}

const AdImg = styled.img`
  display: block;   
  width: 100%;
  box-sizing: border-box;

  &.advertising {
    margin-bottom: 33px;
    height: 300px;
    border: 1px solid ${$BORDER_COLOR};
  }
`;

const sliderSettings = {
  className: 'banner-slider',
  autoplay: true,
  autoplaySpeed: 4000,
  fade: true,
  dots: true,
  speed: 500,
  slidesToScroll: 1,
  slidesToShow: 1,
};

const AdArea = React.memo(() => {
  const [banners, setBanners] = React.useState([]);
  React.useEffect(() => {
    setTimeout(() => {
      new BannerApi()
        .rightBanner()
        .then(({data: {results}}) => !!results && setBanners(results));
    }, SECOND);
  }, []);

  return !isEmpty(banners) ? (
    <StyledSlider
      {...sliderSettings}
    >
      {banners.map(({id, title, description, avatar, bg_code, url, order}) => (
        <A
          key={`right-banner-${id}`}
          to={url}
          newTab
          className="right-ad-banner"
          queryString="device=pc&position=side_banner"
        >
          <AdImg
            src={avatar}
            alt="광고 배너"
            className="advertising"
          />
        </A>
      ))}
    </StyledSlider>
  ) : null;
});

const AdditionalContent: React.ExoticComponent<Props> = React.memo(({
  hideFooter,
  hideAdArea,
  children,
}) => {

  return (
    <Section className="additional-content">
      {children}
      {!hideAdArea && <AdArea/>}
      {!hideFooter && <FooterPC/>}
    </Section>
  );
});

export default AdditionalContent;
