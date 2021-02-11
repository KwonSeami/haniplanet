import styled from 'styled-components';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const MarketingDiv = styled.div`
  position: relative;
  width: 680px;
  margin: auto;
  border-top: 1px solid ${$BORDER_COLOR};
  padding: 4px 0 32px 102px;
  box-sizing: border-box;

  h2 {
    position: absolute;
    left: 0;
    top: 23px;
    ${fontStyleMixin({size: 11, weight: 'bold'})}

    span {
      display: block;
      padding: 0;
    }
  }

  li {
    padding-top: 19px;
  }

  span {
    display: inline-block;
    vertical-align: middle;
    padding-left: 6px;
    ${fontStyleMixin({size: 11, color: $TEXT_GRAY})}
  }
`;

export default MarketingDiv;