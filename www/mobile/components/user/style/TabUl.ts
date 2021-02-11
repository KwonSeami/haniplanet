import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../../styles/variables.types';

const TabUl = styled.ul`
  position: relative;
  z-index: 1;
  width: 680px;
  margin: -1px auto auto;

  li {
    float: left;
    width: 33.333%;
    height: 54px;

    a {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 46px;
      box-sizing: border-box;
      text-align: center;
      ${fontStyleMixin({size: 15, color: $TEXT_GRAY, weight: '300'})}
    }

    &.on a {
      border-top: 1px solid ${$POINT_BLUE};
      ${fontStyleMixin({weight: '600', color: $FONT_COLOR})}
    }
  }
`;

export default TabUl;