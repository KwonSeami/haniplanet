import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';

interface IBannerProps {
  bgImgSrc: string;
  isBeta?: boolean;
}
const DetailPageBanner = styled.div<IBannerProps>`
  height: 280px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  ${({bgImgSrc}) => backgroundImgMixin({
    img: staticUrl(bgImgSrc)
  })};
  
  .center {
    width: 1035px;
    height: 100%;
    position: relative;
    text-align: left;
    margin: 0 auto;

    h2 {
      padding-top: 168px;
      ${fontStyleMixin({
        size: 13,
        weight: 'bold',
      })};
  
      span {
        position: relative;
        display: inline-block;
        z-index: 1;
        padding-top: 7px;
        ${fontStyleMixin({
          size: 30,
          weight: '300',
          color: $WHITE
        })};
                
        &::after {
          content: '';
          position: absolute;
          top: 12px;
          right: -31px;
          width: 29px;
          height: 14px;
          ${({isBeta}) => isBeta && (
            backgroundImgMixin({
              img: staticUrl('/static/images/icon/icon-banner-beta-white.png')
            })
          )};
        }
      }
  
      p {
        margin-top: 5px;
        ${fontStyleMixin({
          size: 16,
          weight: '300',
          color: $WHITE
        })};
        opacity: 0.7;
      }
    }
  }
`;

export default DetailPageBanner;