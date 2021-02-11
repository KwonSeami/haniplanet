import React from 'react';
import styled from 'styled-components';
import {IPlanetAdBanner} from '../../../src/reducers/main';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$GRAY} from '../../../styles/variables.types';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {SECOND} from '../../../src/constants/times';
import BannerItem from './BannerItem';

const AdBannerWrapper = styled.article`
  position: relative;
  max-width: 680px;
  margin: 6px auto;

  .current {
    position: absolute;
    top: 68px;
    right: 9px;
    ${fontStyleMixin({
      size: 10,
      weight: '600',
      family: 'Montserrat',
      color: $GRAY
    })};
  }
`;

const AdBannerSlider = styled(ReactCustomSlick)`
  width: 100%;

  div {
    font-size: 0;
  }
`;

const sliderSettings = {
  autoplay: true,
  autoplaySpeed: 5 * SECOND,
  slidesToShow: 1,
  draggable: true,
  infinite: true,
  arrows: false
};

interface Props {
  data: IPlanetAdBanner[];
}

const PlanetAdBanner: React.FC<Props> = ({data}) => {
  const [currSliderIdx, setCurrSliderIdx] = React.useState(0);

  const changeSlide = React.useCallback((_, nextSlide: number) => {
    setCurrSliderIdx(nextSlide);
  }, []);

  const totalPage = data.length || 1;

  return (
    <AdBannerWrapper>
      <AdBannerSlider
        {...sliderSettings}
        beforeChange={changeSlide}
      >
        {data.map(({
          id,
          mobile_bg_img,
          mobile_under_480,
          mobile_over_480,
          url
        }) => (
          <BannerItem
            key={id}
            mobile_bg_img={mobile_bg_img}
            mobile_under_480={mobile_under_480}
            mobile_over_480={mobile_over_480}
            url={url}
          />
        ))}
      </AdBannerSlider>
      <span className="current no-select">
        {currSliderIdx + 1}&nbsp;/&nbsp;{totalPage}
      </span>
    </AdBannerWrapper>
  );
};

export default React.memo(PlanetAdBanner);
