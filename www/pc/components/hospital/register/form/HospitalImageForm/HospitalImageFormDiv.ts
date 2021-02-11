import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../../../../styles/variables.types';

const HospitalImageFormDiv = styled.div`
  position: relative;
  height: 300px;
  padding: 25px;
  border: 1px solid ${$BORDER_COLOR};
  border-top: 1px solid ${$FONT_COLOR};
  box-sizing: border-box;

  &:hover {
    .imgs-content ul .imgs-explain {
      img {
        opacity: 1;
      }

      span {
        ${fontStyleMixin({
          size: 14,
          color: '#999',
        })};
      }
    }
  }

  p {
    position: absolute;
    top: -26px;
    left: 0;

    ${fontStyleMixin({
      size: 16,
      weight: '600',
      family: 'Montserrat',
      color: $TEXT_GRAY,
    })};

    span {
      ${fontStyleMixin({
        size: 16,
        weight: '600',
        family: 'Montserrat',
        color: $POINT_BLUE,
      })};
    }
  }

  .imgs-content {
    width: 100%;
    height: 100%;

    ul {
      width: 100%;
      height: 100%;

      li {
        width: 184px;
        height: 120px;
        margin-left: 6px;
        vertical-align: middle;

        &:first-child, &:nth-child(6) {
          margin-left: 0;
        }

        &:nth-child(n+6) {
          margin-top: 10px;
        }

        &.imgs-explain {
          width: 100%;
          height: 100%;
          text-align: center;
          padding-top: 82px;
    
          > img {
            display: block;
            width: 52px;
            margin: 0 auto 4px;
            opacity: 0.5;
          }
    
          span {
            ${fontStyleMixin({size: 14, color: $TEXT_GRAY})};
          }
        }
      }
    }
  }
`;

export default HospitalImageFormDiv;