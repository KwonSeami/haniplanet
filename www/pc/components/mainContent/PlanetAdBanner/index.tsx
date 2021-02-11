import React from 'react';
import styled from 'styled-components';
import {IPlanetAdBanner} from '../../../src/reducers/main';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import BannerItem from './BannerItem';
import {SECOND} from '../../../src/constants/times';

const AdBannerWrapper = styled.article`
  position: relative;
  width: 756px;
  border-radius: 7px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;

  .current {
    position: absolute;
    right: 16px;
    bottom: 14px;
    ${fontStyleMixin({
      size: 12,
      weight: '300',
      family: 'Montserrat',
    })};
  }
`;

const AdBannerSlider = styled(ReactCustomSlick)`
  div {
    font-size: 0;
  }

  .slick-arrow {
    width: 30px;
    height: 30px;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/arrow/icon-arrow-gray.png'),
      size: '15px auto',
      color: 'rgba(0, 0, 0, 0.8)',
    })};

    &::before {
      content: '';
    }

    &.slick-prev {
      z-index: 1;
      left: 0;
      transform: translate(0, -50%) rotate(180deg);
    }

    &.slick-next {
      z-index: 1;
      right: 0;
    }
  }
`;

const sliderSettings = {
  autoplay: true,
  autoplaySpeed: 5 * SECOND,
  slidesToShow: 1,
  draggable: true,
  infinite: true,
  speed: 400
};

interface Props {
  data: IPlanetAdBanner[];
}

const PlanetAdBanner: React.FC<Props> = ({data}) => {
  const [currSliderIdx, setCurrSliderIdx] = React.useState(0);
  const totalPage = data.length || 1;

  return (
    <AdBannerWrapper>
      <AdBannerSlider
        {...sliderSettings}
        beforeChange={(_, nextSlide) => setCurrSliderIdx(nextSlide)}
      >
        {data.map(({id, avatar, url}) => (
          <BannerItem
            key={id}
            avatar={avatar}
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
