import styled from 'styled-components';
import {backgroundImgMixin} from '../../../../styles/mixins.styles';

interface Props {
  bannerImg: string;
}

const HospitalBannerDiv =  styled.div<Props>`
  position: relative;
  height: 410px;
  background-blend-mode: multiply;
  ${({bannerImg}) => backgroundImgMixin({
    img: bannerImg,
    color: 'rgba(0, 0, 0, 0.7)',
  })};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.7;
    }
  }
`;

export default HospitalBannerDiv;
