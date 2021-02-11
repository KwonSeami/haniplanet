import React from 'react';
import styled from 'styled-components';
import {backgroundImgMixin} from '../../../styles/mixins.styles';
import {IPlanetAdBanner} from '../../../src/reducers/main';
import A from '../../UI/A';

const BannerDiv = styled.div<Omit<Props, 'url'>>`
  position: relative;
  height: 90px;
  ${({mobile_bg_img}) => backgroundImgMixin({
    img: mobile_bg_img
  })};

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    ${({mobile_under_480}) => backgroundImgMixin({
      img: mobile_under_480,
      size: 'auto 100%'
    })};

    @media screen and (min-width: 480px) {
      ${({mobile_over_480}) => backgroundImgMixin({
        img: mobile_over_480,
        size: 'auto 100%'
      })};
    }
  }
`;

interface Props extends Pick<IPlanetAdBanner, 'mobile_bg_img'
  | 'mobile_under_480'
  | 'mobile_over_480'
  | 'url'
> {

}

const BannerItem: React.FC<Props> = ({
  mobile_bg_img,
  mobile_under_480,
  mobile_over_480,
  url
}) => (
  <A
    to={url}
    newTab
  >
    <BannerDiv
      mobile_bg_img={mobile_bg_img}
      mobile_under_480={mobile_under_480}
      mobile_over_480={mobile_over_480}
    />
  </A>
);

export default React.memo(BannerItem);
