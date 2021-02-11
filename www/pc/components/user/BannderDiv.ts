import styled from 'styled-components';
import {$BORDER_COLOR, $GRAY} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';

const BannerDiv = styled.div`
  height: 159px;
  box-sizing: border-box;
  padding-top: 58px;
  text-align: center;
  position: relative;
  border-bottom: 1px solid ${$BORDER_COLOR};

  h2 {
    ${fontStyleMixin({size: 28, weight: '300'})}
  }

  a {
    display: block;
    position: absolute;
    left: 40px;
    top: 36px;
    ${fontStyleMixin({size: 15, color: $GRAY})}
    
    img {
      width: 30px;
      display: inline-block;
      vertical-align: middle;
      margin: -5px 11px 0 0;
    }
  }
`;

export default BannerDiv;
